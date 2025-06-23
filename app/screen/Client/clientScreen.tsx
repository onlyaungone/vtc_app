import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

interface Client {
  id: string;
  name: string;
  subtitle: string;
  image: any;
}

const ClientListScreen: React.FC = () => {
  const router = useRouter();

  const clients: Client[] = [
    { id: '1', name: 'Tom Cruise', subtitle: 'Fitness That Sticks.', image: require('../../../assets/images/client1.png') },
    { id: '2', name: 'Jacky Chan', subtitle: 'Strength and Conditioning.', image: require('../../../assets/images/client2.png') },
    { id: '3', name: 'Sheldon Cooper', subtitle: 'Endurance Specialist.', image: require('../../../assets/images/client3.png') },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredData = clients.filter(client =>
      client.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClients(filteredData);
  };

  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity style={styles.clientContainer} onPress={() => router.push('/screen/Client/clientProgress')}>
      <Image source={item.image} style={styles.clientImage} />
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.name}</Text>
        <Text style={styles.clientSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
          headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backButtonText}>{'< Back'}</Text>
              </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clients</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search clients"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        renderItem={renderClientItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 70
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontFamily: 'Josefin Sans',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  clientContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  clientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  clientInfo: {
    justifyContent: 'center',
  },
  clientName: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#333',
    marginBottom: 5,
  },
  clientSubtitle: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#777',
  },
  backButtonText: {
    color: '#4B84C4',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});

export default ClientListScreen;
