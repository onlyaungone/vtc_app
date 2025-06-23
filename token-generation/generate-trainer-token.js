const { StreamChat } = require('stream-chat');

const apiKey = 'd8fk9qgytcdt';
const apiSecret = '75hk28h23yu6wdcfqz55mw73jvc95vdnzr4rk94gpn847fdw4euf6n9u6dyswbb9';
const serverClient = StreamChat.getInstance(
    'd8fk9qgytcdt',
    '75hk28h23yu6wdcfqz55mw73jvc95vdnzr4rk94gpn847fdw4euf6n9u6dyswbb9'
  );
const trainerId = 'd87adeef-7b04-4a03-b47f-8b9629c69cc1'; // ✅ match exactly
const token = serverClient.createToken(trainerId);

console.log('Trainer Token:', token);
