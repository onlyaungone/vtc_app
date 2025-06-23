import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter , Stack} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const router = useRouter();

const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

type Day = {
  day: number;
  dateKey: string;
  appointments: any[];
};

const generateDaysArray = (month: number, year: number, appointments: Record<string, any[]>): Day[] => {
  const days: Day[] = [];
  const totalDays = daysInMonth(month, year);

  for (let i = 1; i <= totalDays; i++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      day: i,
      dateKey,
      appointments: appointments[dateKey] || [], // Check if appointments exist for this day
    });
  }

  return days;
};

export default function CustomCalendar() {
  const today = new Date();

  // Set initial month and year to current date
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Sample appointment data for multiple months
  const appointments: Record<string, { time: string; client: string }[]> = {
    '2025-05-15': [{ time: '10:00 AM', client: 'John' }],
    '2025-05-20': [{ time: '3:00 PM', client: 'Sarah' }],
    '2025-05-25': [{ time: '1:00 PM', client: 'Michael' }],
    '2025-05-02': [{ time: '12:00 PM', client: 'Alice' }],
    '2025-05-01': [{ time: '11:00 AM', client: 'Bob' }],
  };

  // Generate days for the selected month and year
  const days = generateDaysArray(currentMonth, currentYear, appointments);

  const onPreviousMonth = () => {
    if (currentMonth === 0) {
      // Move to previous year if current month is January
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const onNextMonth = () => {
    if (currentMonth === 11) {
      // Move to next year if current month is December
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderDay = ({ item }) => {
    const isSelected = selectedDate === item.dateKey;

    return (
      <TouchableOpacity
        style={[styles.dayContainer, isSelected && styles.selectedDay]}
        onPress={() => setSelectedDate(item.dateKey)}
      >
        <Text style={styles.dayText}>{item.day}</Text>
        {item.appointments.length > 0 && (
          <Text style={styles.appointmentIndicator}>•</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderAppointments = () => {
    if (!selectedDate || !appointments[selectedDate]) {
      return <Text style={styles.noAppointmentsText}>No appointments for this day.</Text>;
    }

    return appointments[selectedDate].map((appointment, index) => (
      <View key={index} style={styles.appointmentContainer}>
        <Text style={styles.appointmentText}>{appointment.time}</Text>
        <Text style={styles.clientText}>{appointment.client}</Text>
      </View>
    ));
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
      {/* Header with Month and Year */}
      <View style={styles.monthHeader}>
      <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.circleBackground}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </View>
        </TouchableOpacity>


      <TouchableOpacity onPress={onPreviousMonth}>
          <Text style={styles.navButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.header}>
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
        </Text>
        <TouchableOpacity onPress={onNextMonth}>
          <Text style={styles.navButton}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Days */}
      <FlatList
        data={days}
        numColumns={7} // 7 columns for 7 days of the week
        renderItem={renderDay}
        keyExtractor={(item) => item.day.toString()}
        contentContainerStyle={styles.calendarGrid}
      />

      {/* Appointments Section */}
      <View style={styles.appointmentSection}>
        <Text style={styles.appointmentHeader}>Appointments</Text>
        {renderAppointments()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendarGrid: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#3777F3',
  },
  dayText: {
    fontSize: 16,
  },
  appointmentIndicator: {
    fontSize: 12,
    color: '#FF0000',
  },
  appointmentSection: {
    marginTop: 20,
  },
  appointmentHeader: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noAppointmentsText: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#A0A0A0',
  },
  appointmentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F7',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  appointmentText: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
  },
  clientText: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#555',
  },
  circleBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});