const AWS = require('aws-sdk');
const { StreamChat } = require('stream-chat');

AWS.config.update({ region: process.env.REGION });

/**
 * Retrieves the value of a secret from the AWS Systems Manager Parameter Store.
 * @param {string} secretName The name of the secret environment variable.
 * @returns {Promise<string>} The secret value.
 */
async function getSecret(secretName) {
    const ssm = new AWS.SSM();
    const parameters = await ssm.getParameters({
        Names: [secretName].map(name => process.env[name]),
        WithDecryption: true,
    }).promise();

    if (!parameters.Parameters.length) {
        throw new Error(`Secret ${secretName} not found`);
    }

    return parameters.Parameters[0].Value;
}

/**
 * Generates a Stream Chat token for the provided user ID.
 * @param {string} userId The user ID for which to generate the token.
 * @returns {Promise<string>} The generated Stream Chat token.
 */

async function generateStreamChatToken(userId) {
    const apiKey = process.env.STREAM_CHAT_API_KEY;
    const apiSecret = await getSecret('STREAM_CHAT_API_SECRET');

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    return serverClient.createToken(userId);
}

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    try {
        const userId = event.userId; // Adjust based on how you're receiving the user ID
        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "User ID is required" }),
            };
        }

        const token = await generateStreamChatToken(userId);

        return {
            statusCode: 200,
            body: JSON.stringify({ token }),
        };
    } catch (error) {
        console.error(`Error generating Stream Chat token: ${error.message}`);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
