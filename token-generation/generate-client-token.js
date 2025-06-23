const { StreamChat } = require('stream-chat');

const apiKey = 'd8fk9qgytcdt';
const apiSecret = '75hk28h23yu6wdcfqz55mw73jvc95vdnzr4rk94gpn847fdw4euf6n9u6dyswbb9';

const client = StreamChat.getInstance(apiKey, apiSecret);
const token = client.createToken('54c052b0-5190-4002-80cf-1b2c85c4f7aa');

console.log('Client Token:', token);
