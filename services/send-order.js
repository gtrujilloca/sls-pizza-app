import { randomUUID } from 'crypto';
import { sendMessageToQueue } from '../utils/send-queue-message.js';

export async function sendOrder(event) {
  let order;

  try {
    order = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid JSON in request body',
        error
      })
    }
  }

  const orderDetail = { orderId: randomUUID(), ...order };

  await sendMessageToQueue({
    queueUrl: process.env.PREPARE_ORDER_QUEUE_URL,
    region: process.env.REGION,
    message: orderDetail
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ message: orderDetail })
  };
}

