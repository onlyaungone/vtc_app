import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import {getUrl} from "aws-amplify/storage";
import { useAuth } from '@/context/AuthContext';

const HomeScreen = () => {
  const [greeting, setGreeting] = useState('');
  const [selectedTab, setSelectedTab] = useState<'Today' | 'Week' | 'Month'>('Today');
  const router = useRouter();
  const { logout } = useAuth();

  const [trainerName, setTrainerName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [totalClients, setTotalClients] = useState(0);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [todaySessions, setTodaySessions] = useState<string[]>([]);
  const [weekSessions, setWeekSessions] = useState<string[]>([]);
  const [monthSessions, setMonthSessions] = useState<string[]>([]);

  const REGION = process.env.EXPO_PUBLIC_AWS_REGION!;
  const KEY = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!;
  const SECRET = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!;

  const client = new DynamoDBClient({
    region: REGION,
    credentials: { accessKeyId: KEY, secretAccessKey: SECRET },
  });

  const TRAINER_TABLE = 'PersonalTrainer-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const INPERSON_CLIENT_TABLE = 'InPersonClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const ONLINE_CLIENT_TABLE = 'OnlineClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const INPERSON_PROGRAM_TABLE = 'ProgramsInPersonClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const ONLINE_PROGRAM_TABLE = 'ProgramsOnlineClient-ycmuiolpezdtdkkxmiwibhh6e4-staging';
  const BOOKINGS_TABLE = 'Bookings-ycmuiolpezdtdkkxmiwibhh6e4-staging';

  async function fetchData() {
    const user = await getCurrentUser();
    const userSub = user.userId;

    const trainerData = await client.send(new ScanCommand({ TableName: TRAINER_TABLE }));
    const trainer = trainerData.Items?.find(item => item.sub?.S === userSub);
    if (trainer) {
      setTrainerName(trainer.name?.S || '');
      if (trainer.image?.S) {
        const result = await getUrl({ path: trainer.image.S });
        setProfileImage(result.url.toString());
      }
    }

    // Fetch clients
    const inPersonClientsData = await client.send(new ScanCommand({ TableName: INPERSON_CLIENT_TABLE }));
    const inPersonClients = inPersonClientsData.Items?.filter(i => i.trainerSub?.S === userSub) || [];

    const onlineClientsData = await client.send(new ScanCommand({ TableName: ONLINE_CLIENT_TABLE }));
    const onlineClients = onlineClientsData.Items?.filter(i => i.trainerSub?.S === userSub) || [];

    setTotalClients(inPersonClients.length + onlineClients.length);

    // Fetch programs
    const inPersonProgramsData = await client.send(new ScanCommand({ TableName: INPERSON_PROGRAM_TABLE }));
    const inPersonPrograms = inPersonProgramsData.Items?.filter(i => i.trainerSub?.S === userSub) || [];

    const onlineProgramsData = await client.send(new ScanCommand({ TableName: ONLINE_PROGRAM_TABLE }));
    const onlinePrograms = onlineProgramsData.Items?.filter(i => i.trainerSub?.S === userSub) || [];

    setTotalPrograms(inPersonPrograms.length + onlinePrograms.length);

    // Fetch bookings and categorize
    const bookingsData = await client.send(new ScanCommand({ TableName: BOOKINGS_TABLE }));
    const trainerBookings = bookingsData.Items?.filter(i => i.trainerSub?.S === userSub) || [];

    const now = new Date();
    const todayStr = now.toDateString();
    const oneWeekLater = new Date(now);
    oneWeekLater.setDate(now.getDate() + 7);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const todayList: string[] = [];
    const weekList: string[] = [];
    const monthList: string[] = [];

    trainerBookings.forEach(b => {
      const date = new Date(b.dateTime?.S || '');
      const client = b.clientName?.S || 'Client';
      const session = `${client} - ${date.toLocaleDateString()} @ ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      if (date > now) {
        if (date.toDateString() === todayStr) todayList.push(session);
        if (date <= oneWeekLater) weekList.push(session);
        if (date <= endOfMonth) monthList.push(session);
      }
    });

    setTodaySessions(todayList);
    setWeekSessions(weekList);
    setMonthSessions(monthList);
  }

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/sign-in');
  }

  const getSessionMessage = () => {
    if (selectedTab === 'Today') return todaySessions[0] || 'No sessions today';
    if (selectedTab === 'Week') return weekSessions.length > 0 ? `${weekSessions.length} sessions this week` : 'No sessions this week';
    if (selectedTab === 'Month') return monthSessions.length > 0 ? `${monthSessions.length} sessions this month` : 'No sessions this month';
    return '';
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, headerTitle: '', headerBackVisible: false, headerTransparent: true, headerTintColor: '#D9D9D9' }} />

      <View style={styles.header}>
        {profileImage
          ? <Image source={{ uri: profileImage }} style={styles.avatar} />
          : <Image source={require('@/assets/images/profile.png')} style={styles.avatar} />
        }
        <View>
          <Text style={styles.greeting}>{greeting}, {trainerName}</Text>
          <Text style={styles.subtext}>Trainer</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.push('../screen/calanderBooking')}>
        <LinearGradient colors={['#4B84C4', '#77C4C6']} start={[0.1, 0.1]} end={[1.0, 1.0]} style={styles.trainingCard}>
          <Text style={styles.cardTitle}>{selectedTab}'s Bookings</Text>
          <Text style={styles.cardSubtitle}>{getSessionMessage()}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.statusBar}>
        {(['Today', 'Week', 'Month'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.statusButton, selectedTab === tab && styles.activeStatusButton]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.statusText, selectedTab === tab && styles.activeStatusText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Shortcuts</Text>
      <View style={styles.shortcutsContainer}>
        <TouchableOpacity style={styles.shortcut} onPress={() => router.push('/screen/Client/clientScreen')}>
          <Text style={styles.shortcutTitle}>Your Clients</Text>
          <Text style={styles.shortcutSubtitle}>See your clients</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcut} onPress={() => router.push('/screen/training-screen')}>
          <Text style={styles.shortcutTitle}>Training</Text>
          <Text style={styles.shortcutSubtitle}>See Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcut} onPress={() => router.push('/screen/Client/clientScreen')}>
          <Text style={styles.shortcutTitle}>Progress</Text>
          <Text style={styles.shortcutSubtitle}>See client results</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcut} onPress={() => router.push('../chat')}>
          <Text style={styles.shortcutTitle}>Chat</Text>
          <Text style={styles.shortcutSubtitle}>Chat with Client</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    padding: 10
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
    marginRight: 100
  },
  subtext: {
    fontFamily: 'Josefin Sans',
    fontWeight: '400',
    color: '#777',
    marginTop: 5,
  },
  trainingCard: {
    padding: 30,
    borderRadius: 20,
    marginBottom: 30,
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

});

export default HomeScreen;
