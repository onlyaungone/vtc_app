import { useEffect, useState } from 'react';
import { Chat, OverlayProvider } from 'stream-chat-react-native';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import chatClient from './chatClient';
import { View, Text } from 'react-native';

// Dummy tokens – replace with your actual per-user tokens
const TOKENS: Record<string, string> = {
  'd87adeef-7b04-4a03-b47f-8b9629c69cc1': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDg3YWRlZWYtN2IwNC00YTAzLWI0N2YtOGI5NjI5YzY5Y2MxIn0.0lTuxVtm6oBMKOWgbDkThR6LyqWm47S2DJD3Ba0vOV4',
  '54c052b0-5190-4002-80cf-1b2c85c4f7aa': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTRjMDUyYjAtNTE5MC00MDAyLTgwY2YtMWIyYzg1YzRmN2FhIn0.rnU_f_OURzJ_O9t-fafii8AQW9kywiqRJE732nuxTrU',
};

export const ChatWrapper = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      if (chatClient.userID) {
        console.log('🟡 Already connected to Stream as', chatClient.userID);
        setIsReady(true);
        return;
      }

      try {
        console.log("🔄 Connecting to Stream...");
        const { username } = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        const role = attributes['custom:role']; // Assuming you store role in Cognito

        console.log("👤 Logged-in user:", username);
        console.log("🎭 Role:", role);

        const token = TOKENS[username];

        if (!token) throw new Error(`No token found for user: ${username}`);

        await chatClient.connectUser(
          {
            id: username,
            name: `${role} ${username}`,
          },
          token
        );

        console.log("✅ Connected to Stream!");
        setIsReady(true);
      } catch (e) {
        const err = e as Error;
        console.error("❌ Error in ChatWrapper:", err.message);
        setError(err.message);
      }
    };

    connect();

    return () => {
      if (chatClient.userID) {
        chatClient.disconnectUser();
      }
    };
  }, []);

  if (error) return <Text>Chat error: {error}</Text>;
  if (!isReady) return <Text>Connecting to chat...</Text>;

  return (
    <OverlayProvider>
      <Chat client={chatClient}>{children}</Chat>
    </OverlayProvider>
  );
};
