import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import AWSXRay from 'aws-xray-sdk-core'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocument,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb'

import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('service:db')

const todosTable = process.env.TODOS_TABLE

class Database {
  constructor() {
    const patchedDynamoDBClient = AWSXRay.captureAWSv3Client(new DynamoDB())
    this.client = DynamoDBDocument.from(patchedDynamoDBClient)
  }

  async getTodos(userId) {
    const command = new QueryCommand({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ConsistentRead: true
    })

    const response = await this.client.send(command)
    logger.info(`Get todo : ${response}`)

    return response.Items
  }

  async newTodo(userId, data) {
    const newItem = {
      todoId: uuidv4(),
      userId: userId,
      createdAt: moment().toISOString(),
      done: false,
      ...data
    }
  
    const command = new PutCommand({
      TableName: todosTable,
      Item: newItem
    })
  
    const response = await this.client.send(command)
    logger.info(`New todo : ${JSON.stringify(response)}`)
  
    return newItem
  }

  async updateTodoDone(userId, todoId, done) {
    const command = new UpdateCommand({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set done = :done',
      ExpressionAttributeValues: {
        ':done': done
      },
      ReturnValues: 'ALL_NEW'
    })
  
    const response = await this.client.send(command)
    logger.info(`Update todo done : ${response}`)
  }

  async updateTodoAttachment(userId, todoId, attachmentUrl) {
    const command = new UpdateCommand({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: 'ALL_NEW'
    })
  
    const response = await this.client.send(command)
    logger.info(`Update attachment : ${response}`)
  }

  async deleteTodo(userId, todoId) {
    const command = new DeleteCommand({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })
  
    const response = await this.client.send(command)
    logger.info(`Delete todo : ${response}`)
  }
}

export const db = new Database();

