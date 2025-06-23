import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "@/context/AuthContext";

const HomeScreen = () => {
  const [greeting, setGreeting] = useState('');
  const [selectedTab, setSelectedTab] = useState<'Today' | 'Week' | 'Month'>('Today');
  const [clientName, setClientName] = useState('');
  const [trainerNote, setTrainerNote] = useState('');
  const [isClientInDB, setIsClientInDB] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const TABLE1 = 'InPersonClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const TABLE2 = 'OnlineClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const BOOKINGS_TABLE = 'Bookings-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  const client = new DynamoDBClient({
    region: process.env.EXPO_PUBLIC_AWS_REGION!,
    credentials: {
      accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  async function fetchData() {
    try {
      const { userId, username } = await getCurrentUser();
      const userSub = userId || username;

      const attributes = await fetchUserAttributes();
      const fullName = attributes['custom:fullName'] || 'Unknown Name';

      const data1 = await client.send(new ScanCommand({ TableName: TABLE1 }));
      const items1 = data1.Items?.map(item => ({
        name: item.name?.S,
        sub: item.sub?.S,
      }));

      const data2 = await client.send(new ScanCommand({ TableName: TABLE2 }));
      const items2 = data2.Items?.map(item => ({
        name: item.name?.S,
        sub: item.sub?.S,
      }));

      const find1 = items1?.find(el => el.sub === userSub);
      const find2 = items2?.find(el => el.sub === userSub);

      if (find1 || find2) {
        setClientName(find1?.name || find2?.name || fullName);
        setIsClientInDB(true);
      } else {
        setClientName(fullName);
        setIsClientInDB(false);
      }

      if (find1 || find2) {
        const bookingData = await client.send(new ScanCommand({ TableName: BOOKINGS_TABLE }));
        const myBookings = bookingData.Items?.filter(item => item.clientID?.S === userSub) || [];

        const upcoming = myBookings
          .map(b => ({
            note: b.trainerNote?.S || '',
            date: new Date(b.dateTime?.S || ''),
          }))
          .filter(b => b.date > new Date())
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        if (upcoming.length > 0) {
          setTrainerNote(upcoming[0].note);
        }
      }

    } catch (err) {
      console.error('Error fetching client data:', err);
    }
  }

  useEffect(() => {
    fetchData();
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  const stats = {
    Today: {
      workouts: 1, calories: 3200, steps: 10000, water: 4,
      workoutsCompleted: 1, caloriesRemaining: 821,
      stepsTaken: 7123, waterRemaining: 3,
    },
    Week: {
      workouts: 7, calories: 22000, steps: 70000, water: 28,
      workoutsCompleted: 5, caloriesRemaining: 3500,
      stepsTaken: 50000, waterRemaining: 5,
    },
    Month: {
      workouts: 30, calories: 96000, steps: 300000, water: 120,
      workoutsCompleted: 25, caloriesRemaining: 12000,
      stepsTaken: 250000, waterRemaining: 20,
    },
  };

  const currentStats = stats[selectedTab];

  const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Image source={require('@/assets/images/client1.png')} style={styles.avatar} />
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtext}>{clientName || 'Unknown Name'}</Text>
        </View>
      </View>

      {isClientInDB && (
        <TouchableOpacity onPress={() => router.push('/screen/booking-screen')}>
          <LinearGradient colors={['#4B84C4', '#77C4C6']} start={[0.1, 0.1]} end={[1.0, 1.0]} style={styles.trainingCard}>
            <Text style={styles.cardTitle}>Today's Bookings</Text>
            <Text style={styles.cardSubtitle}>See your upcoming sessions</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {trainerNote && (
        <View style={styles.noteCard}>
          <Text style={styles.sectionTitle}>Trainer’s Note</Text>
          <Text>{trainerNote}</Text>
        </View>
      )}

      <View style={styles.statusBar}>
        {(['Today', 'Week', 'Month'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.statusButton, selectedTab === tab && styles.activeStatusButton]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.statusText, selectedTab === tab && styles.activeStatusText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.activitySection}>
        <View style={styles.stat}>
          <Text>Workouts</Text>
          <ProgressBar progress={currentStats.workoutsCompleted / currentStats.workouts} color="#00BCD4" />
          <Text>{`${currentStats.workoutsCompleted} of ${currentStats.workouts} workouts completed`}</Text>
        </View>
        <View style={styles.stat}>
          <Text>Calories</Text>
          <ProgressBar progress={(currentStats.calories - currentStats.caloriesRemaining) / currentStats.calories} color="#FFC107" />
          <Text>{`${currentStats.caloriesRemaining} calories remaining`}</Text>
        </View>
        <View style={styles.stat}>
          <Text>Steps</Text>
          <ProgressBar progress={currentStats.stepsTaken / currentStats.steps} color="#4CAF50" />
          <Text>{`${currentStats.stepsTaken} of ${currentStats.steps} steps`}</Text>
        </View>
        <View style={styles.stat}>
          <Text>Water</Text>
          <ProgressBar progress={(currentStats.water - currentStats.waterRemaining) / currentStats.water} color="#2196F3" />
          <Text>{`${currentStats.waterRemaining}L remaining`}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Shortcuts</Text>
      <View style={styles.shortcutsContainer}>
        <TouchableOpacity style={styles.shortcut} onPress={() => router.push('/screen/Exercise/ExerciseLibrary')}>
          <Text style={styles.shortcutTitle}>All Exercises</Text>
          <Text style={styles.shortcutSubtitle}>See your exercises</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortcut} onPress={() => router.push('/clientHome/training&nutrition')}>
          <Text style={styles.shortcutTitle}>Training</Text>
          <Text style={styles.shortcutSubtitle}>See Overview</Text>
        </TouchableOpacity>

        {isClientInDB && (
          <>
            <TouchableOpacity style={styles.shortcut} onPress={() => router.push('/screen/Client/clientProgress')}>
              <Text style={styles.shortcutTitle}>Progress</Text>
              <Text style={styles.shortcutSubtitle}>See your results</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortcut} onPress={() => router.push('/chat/client-index')}>
              <Text style={styles.shortcutTitle}>Chat</Text>
              <Text style={styles.shortcutSubtitle}>See your messages</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPressOut={logout}>
        <Text style={styles.shortcutTitle}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    paddingTop: 20,
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 1000,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: '#333',
    marginRight: 150,
  },
  subtext: {
    fontFamily: 'Josefin Sans',
    fontWeight: '400',
    color: '#777',
    marginTop: 5,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginTop: 5,
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  trainingCard: {
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: 'white',
  },
  cardSubtitle: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    fontWeight: '400',
    color: 'white',
    marginTop: 5,
  },
  noteCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeStatusButton: {
    borderBottomColor: '#00BCD4',
  },
  activitySection: {
    marginBottom: 30,
  },
  stat: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#999',
  },
  activeStatusText: {
    color: '#00BCD4',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  shortcutsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shortcut: {
    width: '45%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  shortcutTitle: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  shortcutSubtitle: {
    fontFamily: 'Josefin Sans',
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    padding: 10,
    alignItems: 'center',
    margin: 50,
    borderRadius: 8,
  }
});

export default HomeScreen;
