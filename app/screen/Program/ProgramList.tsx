import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
  Modal,
  Pressable, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { ScanCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { getCurrentUser } from 'aws-amplify/auth';
import { useAuth } from '@/context/AuthContext';

const ProgramListScreen: React.FC = () => {
  const router = useRouter();
  const { dynamoClient } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const TABLEPROGRAM = 'Programs-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const fetchPrograms = async () => {
    try {
      const user = await getCurrentUser();
      const userSub = user.userId;

      const command = new ScanCommand({ TableName: TABLEPROGRAM });
      const data = await dynamoClient.send(command);

      const items =
        data.Items?.map((item) => ({
          id: item.id?.S,
          name: item.name?.S,
          image: item.image?.S ? { uri: item.image.S } : require('@/assets/images/WorkoutList.png'),
          userSubId: item.userSubId?.S,
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

  const handleProgramPress = (program: any) => {
    setSelectedProgram(program);
    setModalVisible(true);
  };

  const handleEdit = () => {
    setModalVisible(false);
   router.push({
  pathname: '/screen/Program/ProgramCreateDetail',
  params: { id: selectedProgram.id, programName: selectedProgram.name },
});

  };

  const handleAssign = () => {
    setModalVisible(false);
    router.push('/screen/Program/ProgramAssignClient');
  };

  const handleDelete = async () => {
    try {
      setModalVisible(false);
      const command = new DeleteItemCommand({
        TableName: TABLEPROGRAM,
        Key: { id: { S: selectedProgram.id } },
      });
      await dynamoClient.send(command);
      setPrograms((prev) => prev.filter((p) => p.id !== selectedProgram.id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const filteredPrograms = programs.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          headerTitle: '',
          headerBackVisible: false,
          headerTransparent: true,
          headerTintColor: '#D9D9D9',
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
            onPress={() => router.back()}
        >
          <Text style={styles.createText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Programs</Text>
        <TouchableOpacity
          onPress={() => router.push('/screen/Program/createProgram')}
          style={styles.headerRight}
        >
          <Ionicons name="add-circle" size={28} color="#4B84C4" />
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search programs"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPrograms}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.programContainer} onPress={() => handleProgramPress(item)}>
            <Image source={item.image} style={styles.programImage} />
            <Text style={styles.programName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Action</Text>
            <Pressable style={styles.modalButton} onPress={handleEdit}>
              <Text style={styles.modalButtonText}>Edit Program</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={handleAssign}>
              <Text style={styles.modalButtonText}>Assign to Client</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={handleDelete}>
              <Text style={styles.modalButtonText}>Delete Program</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ textAlign: 'center', marginTop: 10, color: '#777' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  createText: { marginLeft: 6, fontSize: 16, fontWeight: '600', color: '#4B84C4' },
  searchBar: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    color: '#333',
    elevation: 2,
  },
  listContainer: { paddingBottom: 20 },
  programContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  programImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  programName: { fontSize: 18, color: '#333', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#4B84C4',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: { color: '#FFF', fontWeight: '600' },
});

export default ProgramListScreen;
