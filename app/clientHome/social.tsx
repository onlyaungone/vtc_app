import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SocialScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Direct Chats');
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Messages',
      headerBackTitleVisible: false, // Hides the blue clientHome text
      headerTintColor: '#000',
      headerTitleStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Josefin Sans',
      },
    });
  }, [navigation]);

  const directMessages = [
    {
      id: '1',
      name: 'Gretchen Herwitz',
      lastMessage: 'Good Bye...',
      time: 'Feb 02,2024',
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: '2',
      name: 'Albert Flores',
      lastMessage: 'I am doing Push ups.',
      time: 'Today, 10:25 PM',
      imageUrl: 'https://via.placeholder.com/50',
      unreadCount: 5,
    },
  ];

  const groupMessages = [
    {
      id: '1',
      name: 'Regular Fitness Tips',
      lastMessage: 'Lorem ipsum is the dummy text.',
      time: 'Feb 02,2024',
      members: '42 Members',
      imageUrl: 'https://via.placeholder.com/50',
    },
  ];

  const filteredMessages = (activeTab === 'Direct Chats' ? directMessages : groupMessages)
    .filter((message) => message.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.name.toLowerCase().startsWith(searchQuery.toLowerCase())) return -1;
      if (b.name.toLowerCase().startsWith(searchQuery.toLowerCase())) return 1;
      return 0;
    });

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.messageItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.messageAvatar} />
      <View style={styles.messageDetails}>
        <Text style={styles.messageName}>{item.name}</Text>
        <Text style={styles.messageText}>{item.lastMessage}</Text>
      </View>
      <View style={styles.messageTimeContainer}>
        <Text style={styles.messageTime}>{item.time}</Text>
        {item.unreadCount && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
        {item.members && <Text style={styles.membersText}>{item.members}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Direct Chats' ? styles.activeTab : styles.nonactiveTab]}
          onPress={() => handleTabPress('Direct Chats')}
        >
          <Text style={[styles.tabText, activeTab === 'Direct Chats' ? styles.activeTabText : styles.nonactiveTabText]}>
            Direct Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Groups' ? styles.activeTab : styles.nonactiveTab]}
          onPress={() => handleTabPress('Groups')}
        >
          <Text style={[styles.tabText, activeTab === 'Groups' ? styles.activeTabText : styles.nonactiveTabText]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.messageList, { paddingBottom: 20 }]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#777',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4B84C4',
  },
  nonactiveTab: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  nonactiveTabText: {
    color: '#777',
  },
  messageList: {
    paddingVertical: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageDetails: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
    color: '#333',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Josefin Sans',
    color: '#777',
  },
  messageTimeContainer: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: '#777',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 5,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  membersText: {
    fontSize: 12,
    color: '#4B84C4',
    marginTop: 5,
  },
});

export default SocialScreen;
