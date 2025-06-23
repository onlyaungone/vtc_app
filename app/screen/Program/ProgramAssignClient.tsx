import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { getCurrentUser } from 'aws-amplify/auth';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { useAuth } from '@/context/AuthContext';

const ProgramAssignClient = () => {
  const router = useRouter();
  const { dynamoClient } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClients, setSelectedClients] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'online' | 'inperson'>('online');

  const TABLES = {
    online: 'OnlineClient-ycmuiolpezdtdkkxmiwibhh6e4-staging',
    inperson: 'InPersonClient-ycmuiolpezdtdkkxmiwibhh6e4-staging',
  };

  const fetchClients = async () => {
    try {
      const table = activeTab === 'online' ? TABLES.online : TABLES.inperson;
      const user = await getCurrentUser();
      const command = new ScanCommand({ TableName: table });
      const data = await dynamoClient.send(command);

      const items = data.Items?.map(item => ({
        id: item.id?.S,
        name: item.name?.S,
        sub: item.sub?.S,
        image: require('@/assets/images/client1.png'), // Placeholder image
      })) || [];

      setClients(items);
      setFilteredClients(items);
    } catch (error) {
      console.error(`Error fetching ${activeTab} clients:`, error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [activeTab]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredClients(clients);
    } else {
      const lower = query.toLowerCase();
      const filtered = clients.filter(c => c.name.toLowerCase().includes(lower));
      setFilteredClients(filtered);
    }
  };

  const toggleSelectClient = (client: any) => {
    setSelectedClients(prev =>
      prev.some(c => c.id === client.id)
        ? prev.filter(c => c.id !== client.id)
        : [...prev, client]
    );
  };

  const isSelected = (id: string) => selectedClients.some(c => c.id === id);

  const handleAssign = () => {
    if (selectedClients.length > 0) {
      router.push({
        pathname: '/screen/Program/ProgramDoneAssignedClient',
        params: {
    selected: JSON.stringify(selectedClients),
    type: activeTab, // 'online' or 'inperson'
  },

      });
    }
  };

  const renderClient = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.clientContainer}
      onPress={() => toggleSelectClient(item)}
    >
      <Image source={item.image} style={styles.clientImage} />
      <Text style={styles.clientName}>{item.name}</Text>
      <Ionicons
        name={isSelected(item.id) ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={isSelected(item.id) ? '#4B84C4' : '#E0E0E0'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Assign Clients',
          headerBackVisible: true,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'online' && styles.activeTab]}
          onPress={() => setActiveTab('online')}
        >
          <Text style={styles.toggleText}>Online Clients</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'inperson' && styles.activeTab]}
          onPress={() => setActiveTab('inperson')}
        >
          <Text style={styles.toggleText}>In-Person Clients</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search clients"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        renderItem={renderClient}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={[styles.assignButtonContainer, { opacity: selectedClients.length ? 1 : 0.4 }]}
        onPress={handleAssign}
        disabled={selectedClients.length === 0}
      >
        <Text style={styles.assignButtonText}>Assign to Client</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20 },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 80,
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4B84C4',
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    color: '#333',
    elevation: 2,
  },
  listContainer: { paddingBottom: 20 },
  clientContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  clientImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  clientName: { flex: 1, fontSize: 16, color: '#333' },
  assignButtonContainer: {
    backgroundColor: '#4B84C4',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProgramAssignClient;
