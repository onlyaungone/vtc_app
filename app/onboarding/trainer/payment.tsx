// PaymentScreen.tsx (only the styles have been modified)

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter, Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';

import { useTrainerOnboardingStore } from '@/hooks/onboarding/useTrainerOnboarding';

WebBrowser.maybeCompleteAuthSession();

export default function PaymentScreen() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const { submit } = useTrainerOnboardingStore();

  const handlePaymentSetup = async () => {
    setLoading(true);
    try {
      // 1. Get Cognito user & attributes
      const user = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      const sub = user.userId; // Cognito Sub
      const name = attrs['custom:fullName'] || attrs.name || 'Trainer';
      const email = attrs.email;

      // 2. Create Stripe account + get onboarding link
      const resp = await fetch(
        'https://i1jp710c63.execute-api.ap-southeast-2.amazonaws.com/default/createStripeAccount',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: sub, name, email }),
        }
      );
      const { stripeAccountId, onboardingLink, message } = await resp.json();
      if (!resp.ok || !stripeAccountId || !onboardingLink) {
        throw new Error(message || 'Stripe account creation failed');
      }

      // 3️⃣ Save stripeAccountId in DynamoDB
      const db = new DynamoDBClient({
        region: process.env.EXPO_PUBLIC_AWS_REGION || 'ap-southeast-2',
        credentials: {
          accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
        },
      });

      await db.send(
        new PutItemCommand({
          TableName: 'TrainerDetails',
          Item: {
            id: { S: sub }, // must match the PK in your table
            name: { S: name },
            email: { S: email ?? '' },
            stripeAccountId: { S: stripeAccountId },
            verified: { BOOL: false },
            createdAt: { S: new Date().toISOString() },
          },
        })
      );

      setDone(true);

      // 5. Launch Stripe onboarding (deep link)
      const redirectUri = AuthSession.makeRedirectUri({ scheme: 'myapp' });
      const result = await WebBrowser.openAuthSessionAsync(onboardingLink, redirectUri);

      await WebBrowser.dismissBrowser(); // explicitly close the modal

      if (result.type === 'success') {
        await submit();
        router.replace('/onboarding/trainer/submit');
      } else {
        Alert.alert('Onboarding', 'You cancelled or something went wrong.');
      }
    } catch (err: any) {
      console.error('❌ Payment setup error:', err);
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const skipPayment = () => {
    submit().then(() => {
      router.replace('/onboarding/trainer/submit');
    });
  };

  const goToHomeScreen = () => {
    submit().then(() => {
      router.replace('/onboarding/trainer/submit');
    });
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

      <Text style={styles.header}>Payment Setup</Text>
      <Text style={styles.description}>
        Connect your account to receive payments.
      </Text>

      <TouchableOpacity style={styles.goHomeButton} onPress={goToHomeScreen}>
        <Text style={styles.goHomeButtonText}>Go to Homescreen</Text>
      </TouchableOpacity>

      {done ? (
        <Text style={styles.done}>✅ Stripe account created successfully.</Text>
      ) : (
        <>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handlePaymentSetup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.continueButtonText}>Create Stripe Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={skipPayment}>
            <Text style={styles.skipButtonText}>Continue Without Payment</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  // “Go to Homescreen” button styling
  goHomeButton: {
    backgroundColor: '#3777F3',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 40,
    width: '80%',
    alignItems: 'center',
  },
  goHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // “Create Stripe Account” button styling
  continueButton: {
    backgroundColor: '#28A745',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // “Skip” / “Continue Without Payment” button styling
  skipButton: {
    backgroundColor: '#DDDDDD',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  // “Done” text styling
  done: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
    fontWeight: '600',
    textAlign: 'center',
  },
});
