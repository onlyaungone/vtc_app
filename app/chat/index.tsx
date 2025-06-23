import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchMatchingClientsForTrainer } from '../utils/matchFetcher'; // ✅ import the match fetcher
import chatClient from '../lib/chatClient';
import { ChatWrapper } from '../lib/ChatWrapper'; // ✅ wrap this screen only

type ChannelPreview = {
  clientId: string;
  lastMessage?: string;
  lastMessageAt?: string;
};

function ChatListContent() {
  const router = useRouter();
  const [channels, setChannels] = useState<ChannelPreview[]>([]);

  useEffect(() => {
    const loadClientChannels = async () => {
      try {
        const { username } = await getCurrentUser();
        console.log("✅ Logged-in trainer:", username);
  
        const matchedClientIds = await fetchMatchingClientsForTrainer(username);
        console.log("📦 Matched clients:", matchedClientIds);
  
        const previews: ChannelPreview[] = [];
  
        for (const clientId of matchedClientIds) {
          const channel = chatClient.channel('messaging', {
            members: [username, clientId],
          });
  
          await channel.watch();
          const lastMessage = channel.state.messages.at(-1);
  
          previews.push({
            clientId,
            lastMessage: lastMessage?.text,
            lastMessageAt: lastMessage?.created_at?.toLocaleString(),
          });
        }
  
        console.log("✅ Channels ready:", previews);
        setChannels(previews);
      } catch (err) {
        const error = err as Error;
        console.error("❌ Error loading chat list:", error.message);
      }
    };
  
    loadClientChannels();
  }, []);
  

  const startChat = async (clientId: string) => {
    const trainerId = chatClient.user?.id;

    if (!trainerId) {
      console.error("Trainer ID is undefined. User not connected to Stream yet.");
      return;
    }

    const channel = chatClient.channel('messaging', {
      members: [trainerId, clientId],
    });

    await channel.watch();

    router.push({
      pathname: './chat/room',
      params: { cid: channel.cid },
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Chat Clients</Text>
  
      {channels.length === 0 ? (
        <Text style={{ marginTop: 20 }}>No matched clients or chat history yet.</Text>
      ) : (
        <FlatList
          data={channels}
          keyExtractor={(item) => item.clientId}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => startChat(item.clientId)}
              style={{
                marginTop: 15,
                padding: 15,
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 16 }}>👤 {item.clientId}</Text>
              {item.lastMessage && (
                <Text style={{ fontSize: 13, color: 'gray', marginTop: 4 }}>
                  {item.lastMessage} • {item.lastMessageAt}
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
  
}

// ✅ Wrap the whole screen in ChatWrapper so chatClient connects before rendering
export default function ChatList() {
  return (
    <ChatWrapper>
      <ChatListContent />
    </ChatWrapper>
  );
}
