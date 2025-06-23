import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Channel as StreamChannel } from 'stream-chat';
import { Channel, MessageList, MessageInput } from 'stream-chat-react-native';
import chatClient from '../lib/chatClient';
import { ChatWrapper } from '../lib/ChatWrapper';

export default function ClientChatRoom() {
  const { cid } = useLocalSearchParams();
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  useEffect(() => {
    const loadChannel = async () => {
      if (!cid || typeof cid !== 'string') return;

      const [type, id] = cid.split(':');
      const ch = chatClient.channel(type, id);
      await ch.watch();
      setChannel(ch);
    };

    loadChannel();
  }, [cid]);

  if (!channel) return null;

  return (
    <ChatWrapper>
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </ChatWrapper>
  );
}
