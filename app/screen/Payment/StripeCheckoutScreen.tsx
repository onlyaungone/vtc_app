import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useClientOnboarding } from '@/hooks/onboarding/useClientOnboarding';

WebBrowser.maybeCompleteAuthSession();

type Params = {
  trainerEmail: string;
  trainerId: string;
  trainerName: string;
  packageType: string;
  frequency: string;
};

export default function StripeCheckoutScreen() {
  const router = useRouter();
  const { trainerEmail, trainerId, trainerName, packageType, frequency } =
    useLocalSearchParams<Params>();

  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const { submit } = useClientOnboarding();

  useEffect(() => {
    const initiateCheckout = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        const clientEmail = attrs.email;

        const priceMap: Record<string, number> = {
          Regular: 100,
          Advanced: 150,
        };
        const amount = priceMap[packageType];
        if (!amount) throw new Error(`Invalid packageType: ${packageType}`);

        const redirectUri = AuthSession.makeRedirectUri({ scheme: 'vtcapp' });
        const successUrl = 'https://expo.dev'; // Can be redirectUri if you want deep linking
        const cancelUrl = 'https://expo.dev';

        const response = await fetch(
          'https://zhrcykohu7.execute-api.ap-southeast-2.amazonaws.com/default/createCheckoutSessionClient',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, successUrl, cancelUrl }),
          }
        );

        const json = await response.json();
        if (!response.ok || !json.url) {
          throw new Error(json.error || 'Failed to retrieve checkout URL');
        }else{
          setLoading(false);
        }

        const result = await WebBrowser.openAuthSessionAsync(json.url, redirectUri);
       if( await WebBrowser.dismissBrowser()){
            setLoading(false);
       }

       
        if (result.type === 'success') {
          router.push('/clientHome/home');
        } else {
          setCancelled(true);
        }
      } catch (err: any) {
        Alert.alert('Payment Error', err.message || 'Something went wrong.');
        setLoading(false);
        router.back();
      }
    };

    initiateCheckout();
  }, [packageType]);

  const goToHomeScreen = () => {
    submit();
router.replace('/clientHome/home');

  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
        }}
      />

      {loading && <ActivityIndicator size="large" />}

      {!loading && (
        <>
          <Text style={styles.message}>Continue to Homepage.</Text>
          <TouchableOpacity style={styles.button} onPress={goToHomeScreen}>
            <Text style={styles.buttonText}>Go to Home page</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4B84C4',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
