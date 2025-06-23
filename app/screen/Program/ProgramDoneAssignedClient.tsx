import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProgramDoneAssignedClient() {
  const { selected, type } = useLocalSearchParams(); // type: 'online' | 'inperson'
  const router = useRouter();
  const { dynamoClient } = useAuth();

  const client = JSON.parse(selected as string)[0] ?? null;

  const tableName =
    type === 'inperson'
      ? 'ProgramsInPersonClient-ycmuiolpezdtdkkxmiwibhh6e4-staging'
      : 'ProgramsOnlineClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  useEffect(() => {
    if (!client) return;

    const saveToDynamo = async () => {
      try {
        const now = new Date();
        const timestamp = now.toISOString();
        const epochMillis = Date.now();
        const uuid = uuidv4();

        const command = new PutItemCommand({
          TableName: tableName,
          Item: {
            id: { S: uuid }, // Required Partition Key
            programsId: { S: 'program-001' }, // Replace this with your real program ID
            createdAt: { S: timestamp },
            updatedAt: { S: timestamp },
            _version: { N: '1' },
            _lastChangedAt: { N: epochMillis.toString() },
            __typename: {
              S: type === 'online' ? 'ProgramsOnlineClient' : 'ProgramsInPersonClient',
            },
            ...(type === 'online'
              ? { onlineClientId: { S: client.id } }
              : { inPersonClientId: { S: client.id } }),
          },
        });

        await dynamoClient.send(command);
      } catch (err) {
        console.error('❌ Failed to save assignment:', err);
      }
    };

    saveToDynamo();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />

      <Text style={styles.headerTitle}>Successfully Assigned</Text>

      <View style={styles.contentContainer}>
        <Text style={styles.successMessage}>
          Strength Builder Phase 1 has been assigned to:
        </Text>

        <View style={styles.clientContainer}>
          <Image
            source={require('@/assets/images/client1.png')}
            style={styles.clientImage}
          />
          <View style={styles.clientDetails}>
            <Text style={styles.clientName}>{client?.name}</Text>
            <Text style={styles.clientSubtitle}>Personal Training Client</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.doneButtonContainer}
        onPress={() => router.replace('/trainerHome/home-screen')}
      >
        <LinearGradient
          colors={['#4B84C4', '#77C4C6']}
          style={styles.doneButton}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  contentContainer: { alignItems: 'center', marginBottom: 30 },
  successMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  clientContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
    width: '100%',
  },
  clientImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  clientDetails: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  clientSubtitle: { fontSize: 14, color: '#777' },
  doneButtonContainer: { marginTop: 'auto', marginBottom: 30 },
  doneButton: {
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
