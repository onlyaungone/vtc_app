import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const WorkoutCompletePage: React.FC = () => {
  const router = useRouter();
  const { workoutData, workoutId, duration } = useLocalSearchParams();

  const [timeTaken, setTimeTaken] = useState<string>('');
  const [hasStored, setHasStored] = useState<boolean>(false);

  const REGION = process.env.EXPO_PUBLIC_AWS_REGION ?? '';
  const ACCESS_KEY = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID ?? '';
  const SECRET_KEY = process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY ?? '';

  const client = new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  const parsedWorkout = (() => {
    try {
      return workoutData ? JSON.parse(workoutData as string) : [];
    } catch (err) {
      console.error('❌ Failed to parse workoutData:', err);
      return [];
    }
  })();

  const updateWorkoutStatus = async () => {
    try {
      const completedAt = new Date().toISOString();

      for (const workout of parsedWorkout) {
        // ✅ Update ExercisesWorkout status
        await client.send(
          new UpdateItemCommand({
            TableName: 'ExercisesWorkout-ycmuiolpezdtdkkxmiwibhh6e4-staging',
            Key: { id: { S: workout.id } },
            UpdateExpression: 'SET #status = :status, completedAt = :completedAt',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
              ':status': { S: 'completed' },
              ':completedAt': { S: completedAt },
            },
          })
        );

        // ✅ Update ExerciseDetails sets
        if (Array.isArray(workout.sets)) {
          for (const set of workout.sets) {
            if (!set.id) {
              console.warn(`⚠️ Skipping set without ID:`, set);
              continue;
            }

            await client.send(
              new UpdateItemCommand({
                TableName: 'ExerciseDetails-ycmuiolpezdtdkkxmiwibhh6e4-staging',
                Key: { id: { S: set.id } },
                UpdateExpression: `
                  SET #set = :setVal, #load = :loadVal, #reps = :repsVal,
                      #variable = :varVal, #rest = :restVal, updatedAt = :updatedAt
                `,
                ExpressionAttributeNames: {
                  '#set': 'set',
                  '#load': 'load',
                  '#reps': 'reps',
                  '#variable': 'variable',
                  '#rest': 'rest',
                },

                ExpressionAttributeValues: {
                  ':setVal': { N: String(set.set || 0) },
                  ':loadVal': { S: String(set.load || '0') },
                  ':repsVal': { S: String(set.reps || '0') },
                  ':varVal': { S: String(set.variable || '0') },
                  ':restVal': { S: String(set.rest || '0') },
                  ':updatedAt': { S: new Date().toISOString() },
                },
              })
            );
          }
        }
      }

      // ✅ Update Workout completion flag
      await client.send(
        new UpdateItemCommand({
          TableName: 'Workout-ycmuiolpezdtdkkxmiwibhh6e4-staging',
          Key: { id: { S: String(workoutId) } },
          UpdateExpression: 'SET isComplete = :isComplete',
          ExpressionAttributeValues: {
            ':isComplete': { BOOL: true },
          },
        })
      );

      console.log('✅ Workout, exercises, and sets marked as completed');
    } catch (err) {
      console.error('❌ Error updating workout details:', err);
      Alert.alert('Error', 'Failed to update workout status and sets.');
    }
  };

  useEffect(() => {
    if (duration) {
      const totalSec = parseInt(duration as string);
      const minutes = Math.floor(totalSec / 60);
      const seconds = totalSec % 60;
      setTimeTaken(`${minutes}m ${seconds}s`);
    }

    console.log('🔍 workoutData received:', workoutData);
    console.log('🔍 parsedWorkout:', parsedWorkout);

    if (!hasStored) {
      updateWorkoutStatus();
      setHasStored(true);
    }
  }, [hasStored]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.congratsText}>Congratulations!</Text>
      <Text style={styles.completeText}>
        You have completed your workout in{' '}
        <Text style={styles.timeText}>{timeTaken}</Text>
      </Text>

      <Image
        source={require('@/assets/images/celebration.png')}
        style={styles.celebrationImage}
      />

      <Text style={styles.questionText}>What do you want to do next?</Text>

      {[
        { icon: 'share-social-outline', label: 'Share on Feed' },
        { icon: 'fitness-outline', label: 'Send to Trainer' },
        { icon: 'stats-chart', label: 'View Workout Stats' },
      ].map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.optionButton}
          onPress={() => router.push('/trainerHome/home-screen')}
        >
          <LinearGradient
            colors={['#4B84C4', '#77C4C6']}
            style={styles.gradientButton}
          >
            <Ionicons name={option.icon as any} size={24} color="white" />
            <Text style={styles.buttonText}>{option.label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}

      <Text style={styles.shareText}>Share your workout on:</Text>
      <View style={styles.socialIcons}>
        <Ionicons name="logo-facebook" size={30} color="#3b5998" />
        <Ionicons name="logo-instagram" size={30} color="#E4405F" />
        <Ionicons name="logo-twitter" size={30} color="#00acee" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  completeText: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeText: {
    color: '#4B84C4',
    fontWeight: 'bold',
  },
  celebrationImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionButton: {
    marginVertical: 10,
    width: '80%',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  shareText: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default WorkoutCompletePage;
