import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { getCurrentUser } from 'aws-amplify/auth';

// ✅ Define your table name here
const TABLE_NAME = 'Bookings-ycmuiolpezdtdkkxmiwibhh6e4-staging';

// ✅ Use direct credentials like in home.tsx
const client = new DynamoDBClient({
  region: process.env.EXPO_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

const BookingScreen = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const user = await getCurrentUser();
      console.log("Current user:", user.username);

      // For now, let's simplify filter (remove date filtering)
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'clientID = :cid',
        ExpressionAttributeValues: {
          ':cid': { S: user.username },
        }
      });

      const response = await client.send(command);
      console.log("Fetched bookings:", response.Items);
      setBookings(response.Items || []);
    } catch (err) {
      console.error("Booking fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Today's Bookings</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : bookings.length === 0 ? (
        <Text>No bookings found.</Text>
      ) : (
        bookings.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text>Time: {item.sessionID?.S || 'N/A'}</Text>
            <Text>Trainer: {item.trainerName?.S || 'N/A'}</Text>
            <Text>Type: {item.sessionType?.S || 'N/A'}</Text>
            <Text>Notes: {item.notes?.S || 'N/A'}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default BookingScreen;
