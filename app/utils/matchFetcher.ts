import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const REGION = 'ap-southeast-2';
const MATCHING_TABLE_NAME = 'Match-ycmuiolpezdtdkkxmiwibhh6e4-staging';

const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function fetchMatchingClientsForTrainer(trainerId: string): Promise<string[]> {
  const command = new ScanCommand({
    TableName: MATCHING_TABLE_NAME,
    FilterExpression: 'personaltrainerID = :tid AND #status = :s',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':tid': { S: trainerId },
      ':s': { S: 'Approved' },
    },
  });

  const response = await ddbClient.send(command);
  return (
    response.Items?.map((item) => item.onlineclientID?.S)
      .filter((id): id is string => typeof id === 'string') || []
  );
}

export async function fetchMatchingTrainersForClient(clientId: string): Promise<string[]> {
  const command = new ScanCommand({
    TableName: MATCHING_TABLE_NAME,
    FilterExpression: 'onlineclientID = :cid AND #status = :s',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':cid': { S: clientId },
      ':s': { S: 'Approved' },
    },
  });

  const response = await ddbClient.send(command);
  return (
    response.Items?.map((item) => item.personaltrainerID?.S)
      .filter((id): id is string => typeof id === 'string') || []
  );
}
