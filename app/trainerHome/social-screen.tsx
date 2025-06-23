import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView } from 'react-native';

const SocialScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Direct Chats');
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef<FlatList>(null); // Reference to FlatList

  // Sample data for Direct Chats (can be replaced with actual data)
  const directMessages = [
    {
      id: '1',
      name: 'Gretchen Herwitz',
      lastMessage: 'Good Bye...',
      time: 'Feb 02,2024',
      imageUrl: 'https://via.placeholder.com/50', // Placeholder image
    },
    {
      id: '2',
      name: 'Albert Flores',
      lastMessage: 'I am doing Push ups.',
      time: 'Today, 10:25 PM',
      imageUrl: 'https://via.placeholder.com/50', // Placeholder image
      unreadCount: 5,
    },
  ];

  // Sample data for Group Chats (can be replaced with actual data)
  const groupMessages = [
    {
      id: '1',
      name: 'Regular Fitness Tips',
      lastMessage: 'Lorem ipsum is the dummy text.',
      time: 'Feb 02,2024',
      members: '42 Members',
      imageUrl: 'https://via.placeholder.com/50', // Placeholder image for groups
    },
  ];

  // Function to filter and sort messages based on the search query
  const filteredMessages = (activeTab === 'Direct Chats' ? directMessages : groupMessages)
    .filter((message) => message.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.name.toLowerCase().startsWith(searchQuery.toLowerCase())) return -1;
      if (b.name.toLowerCase().startsWith(searchQuery.toLowerCase())) return 1;
      return 0;
    });

  // Scroll the FlatList to top when switching between tabs
  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Function to render each message item
  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.messageItem} accessibilityLabel={`Chat with ${item.name}`} accessibilityHint="Tap to open chat">
      <Image source={{ uri: item.imageUrl }} style={styles.messageAvatar} />
      <View style={styles.messageDetails}>
        <Text style={styles.messageName}>{item.name}</Text>
        <Text style={styles.messageText}>{item.lastMessage}</Text>
      </View>
      <View style={styles.messageTimeContainer}>
        <Text style={styles.messageTime}>{item.time}</Text>
        {item.unreadCount ? (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        ) : null}
        {item.members && <Text style={styles.membersText}>{item.members}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Messages</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Search bar"
          accessibilityHint="Type to search for chats"
        />
      </View>

      {/* Tab Toggle for Direct Chats and Groups */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Direct Chats' ? styles.activeTab : styles.nonactiveTab]}
          onPress={() => handleTabPress('Direct Chats')}
          accessibilityLabel="Direct Chats"
          accessibilityHint="Switch to Direct Chats"
        >
          <Text style={[styles.tabText, activeTab === 'Direct Chats' ? styles.activeTabText : styles.nonactiveTabText]}>
            Direct Chats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Groups' ? styles.activeTab : styles.nonactiveTab]}
          onPress={() => handleTabPress('Groups')}
          accessibilityLabel="Groups"
          accessibilityHint="Switch to Groups"
        >
          <Text style={[styles.tabText, activeTab === 'Groups' ? styles.activeTabText : styles.nonactiveTabText]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef} // Reference to FlatList for scrolling
        data={filteredMessages} // Use the filtered and sorted data
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.messageList, { paddingBottom: 20 }]} // Extra padding for better spacing
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Josefin Sans',
    marginVertical: 10,
    color: '#333',
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
    backgroundColor: '#4B84C4', // Active tab background
  },
  nonactiveTab: {
    backgroundColor: '#FFFFFF', // Non-active tab background
    borderWidth: 1,
    borderColor: '#E0E0E0', // Add a border to non-active tab
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
  },
  activeTabText: {
    color: '#FFFFFF', // Active tab text color
  },
  nonactiveTabText: {
    color: '#777', // Non-active tab text color
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
