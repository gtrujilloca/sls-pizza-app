import { sendMessageToQueue } from '../utils/send-queue-message.js';


export async function createOrder(event) {

  let order;

  try {
    order = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: 'Invalid JSON in request body'
        })
    }
  }
  const orderDetail = { orderId: Date.now(), ...order };

  await sendMessageToQueue({
    queueUrl: process.env.PENDING_ORDER_QUEUE_URL,
    region: process.env.REGION,
    message: orderDetail
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: orderDetail
      })
  }
}

