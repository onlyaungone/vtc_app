import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNutrition } from '@/context/NutritionContext';
import {fetchUserAttributes} from "aws-amplify/auth";

export default function NutritionScreen() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { updated } = useLocalSearchParams();
  const router = useRouter();
  const { nutritionData, updateNutritionItem } = useNutrition();

  useEffect(() => {
    if (updated) {
      try {
        const updatedItem = JSON.parse(updated as string);
        const fixedItem = {
          ...updatedItem,
          image: typeof updatedItem.image === 'string'
            ? { uri: updatedItem.image }
            : updatedItem.image,
        };
        updateNutritionItem(fixedItem);
      } catch (e) {
        console.warn('Failed to parse updated item', e);
      }
    }
  }, [updated]);

  const filteredNutrition = nutritionData
    .filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const searchTermLower = searchTerm.toLowerCase();
      return a.title.toLowerCase().indexOf(searchTermLower) - b.title.toLowerCase().indexOf(searchTermLower);
    });

  const handleBack = async () => {
    const attributes = await fetchUserAttributes();
    const userRole = attributes['custom:role']
    console.log('Role: ' + userRole);

    if (userRole === "Client") {
      router.push('/clientHome/training&nutrition');
    } else if (userRole === "PT") {
      router.push('/trainerHome/training&nutrition-screen')
    }
  }

  const handleCreatePost = () => {
    router.push('/screen/Nutrition/nutrition_create');
  };

  const handleNutritionPress = (item: any) => {
    router.push({
      pathname: '/screen/Nutrition/nutrition_detail',
      params: {
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        image: item.image?.uri || '',
      },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Nutrition',
          headerTransparent: true,
          headerBackVisible: false,
          headerTintColor: '#4B84C4',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack}>
                <Ionicons name="arrow-back-circle-outline" size={28} color="#4B84C4" />
                <Text>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Search nutrition knowledge..."
        placeholderTextColor="#A0A0A0"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <ScrollView style={styles.scrollView}>
        {filteredNutrition.length > 0 ? (
          filteredNutrition.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.nutritionContainer}
              onPress={() => handleNutritionPress(item)}
            >
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
                onError={() => console.warn(`Image failed for ${item.title}`)}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>No nutrition knowledge found</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}>
          <Text style={styles.buttonText}>Create Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingTop: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 15,
    fontFamily: 'Josefin Sans',
    fontSize: 16,
    marginBottom: 20,
    marginTop: 25,
  },
  scrollView: {
    flex: 1,
  },
  nutritionContainer: {
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#eee',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: 'bold',
    color: '#00796B',
  },
  subtitle: {
    fontFamily: 'Josefin Sans',
    fontSize: 14,
    color: '#555',
  },
  noResultsText: {
    textAlign: 'center',
    fontFamily: 'Josefin Sans',
    fontSize: 16,
    color: '#A0A0A0',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
  },
});
