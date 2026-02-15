import { ITEM_NOT_FOUND } from '../utils/constantans.js';
import { getOrderFromTable } from '../utils/orders-table.js';

export async function getOrder(event) {
  const orderId = event.pathParameters?.id;
  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: 'orderId path parameter is required'
        })
    }
  }

  // const order = orders.find(o => o.orderId === orderId);

  try {
    const order = await getOrderFromTable({
      region: process.env.REGION,
      tableName: process.env.ORDERS_TABLE_NAME,
      orderId
    });

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: order
        })
    }

  } catch (error) {

    if (error.name === ITEM_NOT_FOUND) {
      return {
        statusCode: 404,
        body: JSON.stringify(
          {
            message: 'Order not found'
          })
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error retrieving order',
      })
    }
  }

}

(async () => {
  // For local testing
  const response = await getOrder({ pathParameters: { id: 'order123' } });
  console.log('Response:', response);
})();