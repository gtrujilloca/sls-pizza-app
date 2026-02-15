import { sendMessageToQueue } from '../utils/send-queue-message.js';
import { createOrderInTable } from '../utils/orders-table.js';
import { randomUUID } from 'crypto';

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
  const orderDetail = { orderId: randomUUID(), status: 'PENDING', ...order };

  await createOrderInTable({
    region: process.env.REGION,
    tableName: process.env.ORDERS_TABLE_NAME,
    item: orderDetail
  });

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

