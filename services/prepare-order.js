import { updateOrderStatusInTable } from '../utils/orders-table.js';

export async function prepareOrder(event) {
  console.log(event);

  const messageBody = JSON.parse(event.Records[0].body);

  await updateOrderStatusInTable({
    region: process.env.REGION,
    tableName: process.env.ORDERS_TABLE_NAME,
    orderId: messageBody.orderId,
    status: 'READY'
  })
  return;
}