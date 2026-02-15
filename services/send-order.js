import { sendMessageToQueue } from '../utils/send-queue-message.js';

export async function sendOrder(event) {
  console.log(event);

  if (event.Records[0].eventName !== 'MODIFY') {
    return;
  }

  const eventData = event.Records[0].dynamodb;
  console.log('Event data:', JSON.stringify(eventData, null, 2));

  if (!eventData.NewImage) {
    console.log('NewImage not found in event');
    return;
  }

  const orderDetail = eventData.NewImage;

  if (!orderDetail.orderId || !orderDetail.status) {
    console.log('Required fields missing in orderDetail');
    return;
  }

  const order = {
    orderId: orderDetail.orderId.S,
    status: orderDetail.status.S,
    customer: orderDetail.customer ? orderDetail.customer.S : '',
    order: orderDetail.order ? orderDetail.order.S : '',
  }

  console.log('Processed order:', order)

  await sendMessageToQueue({
    queueUrl: process.env.ORDERS_TO_SEND_QUEUE_URL,
    region: process.env.REGION,
    message: order
  })

  return;

  // try {
  //   order = JSON.parse(event.body);
  //   if (order.orderId === undefined) {
  //     throw new Error('orderId is required in the request body');
  //   }
  // } catch (error) {
  //   return {
  //     statusCode: 400,
  //     body: JSON.stringify({
  //       message: 'Invalid JSON in request body',
  //       error
  //     })
  //   }
  // }

  // const orderDetail = { ...order };

  // await sendMessageToQueue({
  //   queueUrl: process.env.ORDERS_TO_SEND_QUEUE_URL,
  //   region: process.env.REGION,
  //   message: orderDetail
  // })

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({ message: orderDetail })
  // };
}

