import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchMatchingTrainersForClient } from '../utils/matchFetcher';
import chatClient from '../lib/chatClient';
import { ChatWrapper } from '../lib/ChatWrapper';

type ChannelPreview = {
  trainerId: string;
  lastMessage?: string;
  lastMessageAt?: string;
};

function ClientChatListContent() {
  const router = useRouter();
  const [channels, setChannels] = useState<ChannelPreview[]>([]);

  useEffect(() => {
    const loadTrainerChannels = async () => {
      try {
        const { username } = await getCurrentUser();

        const matchedTrainerIds = await fetchMatchingTrainersForClient(username);

        const previews: ChannelPreview[] = [];

        for (const trainerId of matchedTrainerIds) {
          const channel = chatClient.channel('messaging', {
            members: [username, trainerId],
          });

          await channel.watch();
          const lastMessage = channel.state.messages.at(-1);

          previews.push({
            trainerId,
            lastMessage: lastMessage?.text,
            lastMessageAt: lastMessage?.created_at?.toLocaleString(),
          });
        }

        setChannels(previews);
      } catch (err) {
        console.error("❌ Error loading trainer chat list:", err);
      }
    };

    loadTrainerChannels();
  }, []);

  const startChat = async (trainerId: string) => {
    const clientId = chatClient.user?.id;
    if (!clientId) return;

    const channel = chatClient.channel('messaging', {
      members: [clientId, trainerId],
    });

    await channel.watch();
    console.log("✅ Channel ready:", channel.cid);
    console.log("📦 Starting chat with trainer:", trainerId);
    router.push({
      pathname: '../chat/client-room',
      params: { cid: channel.cid },
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Your Trainer Chats</Text>

      <FlatList
        data={channels}
        keyExtractor={(item) => item.trainerId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => startChat(item.trainerId)}
            style={{
              marginTop: 15,
              padding: 15,
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>🏋️‍♂️ {item.trainerId}</Text>
            {item.lastMessage && (
              <Text style={{ fontSize: 13, color: 'gray', marginTop: 4 }}>
                {item.lastMessage} • {item.lastMessageAt}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default function ClientChatList() {
  return (
    <ChatWrapper>
      <ClientChatListContent />
    </ChatWrapper>
  );
}
