import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { getCurrentUser } from 'aws-amplify/auth';
import { useAuth } from '@/context/AuthContext'; // Make sure this is implemented

export default function ProgramsScreen() {
  const router = useRouter();
  const { dynamoClient } = useAuth(); // ✅ Context with shared client

  const [searchTerm, setSearchTerm] = useState('');
  const [programs, setPrograms] = useState<{ id: string; name: string; userSubId?: string; image?: any }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = async () => {
    try {
      const user = await getCurrentUser();
      const userSub = user.userId;

      const command = new ScanCommand({
        TableName: 'Programs-ycmuiolpezdtdkkxmiwibhh6e4-staging',
      });

      const data = await dynamoClient.send(command);

      const items =
        data.Items?.map((item) => ({
          id: item.id?.S ?? '',
          name: item.name?.S ?? '',
          image: item.image?.S ? { uri: item.image.S } : require('@/assets/images/WorkoutList.png'),
          userSubId: item.userSubId?.S ?? '',
        })) ?? [];

      const filtered = items.filter((item) => item.userSubId === userSub);
      setPrograms(filtered);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter((program) =>
    program.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProgramPress = (program: { id: string; name: string }) => {
    router.push({
      pathname: '/screen/Program/ProgramDetail',
      params: { id: program.id, programName: program.name },
    });
  };

  const goToCreateProgramPage = () => {
    router.push('/screen/Program/createProgram');
  };

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
      <Text style={styles.header}>Your Programs</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search programs..."
        placeholderTextColor="#A0A0A0"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <ScrollView style={styles.scrollBar}>
        {loading ? (
          <Text>Loading...</Text>
        ) : filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={styles.scrollItem}
              onPress={() => handleProgramPress(program)}
            >
              <Text style={styles.scrollItemText}>{program.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>No programs found</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={goToCreateProgramPage}>
        <Text style={styles.createButtonText}>Create program</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  scrollBar: {
    flex: 1,
    marginBottom: 20,
  },
  scrollItem: {
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  scrollItemText: {
    fontSize: 16,
    color: '#00796B',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontSize: 16,
    marginTop: 10,
  },
  createButton: {
    backgroundColor: '#3777F3',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
