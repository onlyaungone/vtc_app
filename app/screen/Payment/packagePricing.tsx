import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import {getUrl} from "aws-amplify/storage";

type Params = {
  trainerId: string;
  trainerName: string;
  trainerEmail: string;
  trainerImage: string;
  trainerNiche: string;
  packageType: string;
};

export default function PackagePricing() {
  const router = useRouter();
  const {
    trainerId,
    trainerName,
    trainerEmail,
    trainerImage,
    trainerNiche,
    packageType,
  } = useLocalSearchParams<Params>();

  const [paymentOption, setPaymentOption] = useState<'recurring' | 'weekly' | null>(null);

  const handleContinue = () => {
    if (!paymentOption) return;

    router.push({
      pathname: '/screen/Payment/StripeCheckoutScreen',
      params: {
        trainerId,
        trainerName,
        trainerEmail,
        trainerImage,
        trainerNiche,
        packageType,
        frequency: paymentOption,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
        }}
      />

      <Text style={styles.heading}>Choose a Payment Plan</Text>
      <Text style={styles.subheading}>
        Select how you want to be billed for the <Text style={styles.bold}>{packageType}</Text> package.
      </Text>

      <TouchableOpacity
        style={[styles.card, paymentOption === 'recurring' && styles.selectedCard]}
        onPress={() => setPaymentOption('recurring')}
      >
        <Text style={[styles.optionText, paymentOption === 'recurring' && styles.selectedText]}>
          🔁 Recurring Subscription
        </Text>
        <Text style={styles.optionDesc}>
          Automatically billed weekly — best for consistent training.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, paymentOption === 'weekly' && styles.selectedCard]}
        onPress={() => setPaymentOption('weekly')}
      >
        <Text style={[styles.optionText, paymentOption === 'weekly' && styles.selectedText]}>
          💳 One-Time Weekly Payment
        </Text>
        <Text style={styles.optionDesc}>
          Pay week-by-week. Great if you're trying it out.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.continueButton, !paymentOption && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!paymentOption}
      >
        <Text style={styles.continueText}>Continue to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
    color: '#333',
  },
  card: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
  },
  selectedCard: {
    backgroundColor: '#E3F0FF',
    borderColor: '#4B84C4',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#2D2D2D',
  },
  selectedText: {
    color: '#4B84C4',
  },
  optionDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#4B84C4',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
