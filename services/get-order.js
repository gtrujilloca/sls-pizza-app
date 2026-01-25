import orders from '../orders.json' with { type: 'json' };

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

  const order = orders.find(o => o.orderId === orderId);

  if (!order) {
    return {
      statusCode: 404,
      body: JSON.stringify(
        {
          message: 'Order not found'
        })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: order
      })
  }
}

(async () => {
  // For local testing
  const response = await getOrder({ pathParameters: { id: 'order123' } });
  console.log('Response:', response);
})();