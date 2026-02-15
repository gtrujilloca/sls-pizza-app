import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ITEM_NOT_FOUND } from "./constantans.js";

export async function createOrderInTable({
  region,
  tableName,
  item,
}) {

  const client = new DynamoDBClient({ region });
  const docClient = DynamoDBDocumentClient.from(client);

  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    const command = new PutCommand(params);
    const response = await docClient.send(command);
    console.log('Item saved successfully: ', response);
    return response;
  } catch (error) {
    console.error("Error saving item: ", error);
    return error;
  }
}

export async function updateOrderStatusInTable({
  region,
  tableName,
  orderId,
  status = 'PENDING' | 'READY' | 'DELIVERED'
}) {
  const client = new DynamoDBClient({ region });
  const docClient = DynamoDBDocumentClient.from(client);

  const params = {
    TableName: tableName,
    Key: { orderId },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': status
    },
    ReturnValues: "ALL_NEW",
  }

  try {
    const command = new UpdateCommand(params);
    const response = await docClient.send(command);
    console.log('Item updated successfully: ', response);
    return response.Attributes;
  } catch (error) {
    console.error("Error updating item: ", error);
    return error;
  }
}

export async function getOrderFromTable({
  region,
  tableName,
  orderId
}) {
  const client = new DynamoDBClient({ region });
  const docClient = DynamoDBDocumentClient.from(client);

  const params = {
    TableName: tableName,
    Key: { orderId },
  }

  try {
    const command = new GetCommand(params);
    const response = await docClient.send(command);
    if (!response.Item) {
      console.log('Order not found');
      const error = new Error('Order not found');
      error.name = ITEM_NOT_FOUND;
      throw error;
    }
    console.log('Item retrieved successfully: ', response);
    return response.Item;
  } catch (error) {
    console.error("Error retrieving item: ", error);
    throw error;
  }
}