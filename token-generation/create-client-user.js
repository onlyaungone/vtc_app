// create-client-user.js
const { StreamChat } = require('stream-chat');


const apiKey = 'd8fk9qgytcdt';
const apiSecret = '75hk28h23yu6wdcfqz55mw73jvc95vdnzr4rk94gpn847fdw4euf6n9u6dyswbb9';
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

const clientId = '54c052b0-5190-4002-80cf-1b2c85c4f7aa'; // use the actual Cognito sub
const clientName = 'Dheeraj Client'; // optional name

async function createUser() {
  try {
    await serverClient.upsertUser({
      id: clientId,
      name: clientName,
    });
    console.log('✅ Client created in Stream Chat');
  } catch (error) {
    console.error('❌ Failed to create client:', error.message);
  }
}

createUser();
