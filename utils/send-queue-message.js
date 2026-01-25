import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';


export async function sendMessageToQueue({
  queueUrl,
  region,
  message,
}) {
  const sqsClient = new SQSClient({ region });

  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message)
  }

  try {
    const command = new SendMessageCommand(params);
    const data = await sqsClient.send(command);
    console.log(`Message sent successfully: ${data.MessageId}`);

    return data;
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    throw error;
  }
}