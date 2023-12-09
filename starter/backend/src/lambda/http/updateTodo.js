import middy from '@middy/core'
import cors from '@middy/http-cors'
import validator from '@middy/validator'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'

import { getUserId } from '../../service/auth.mjs'
import { todoService } from '../../service/todo.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { updateTodoSchema } from '../../model/todo.mjs'

const logger = createLogger('lambda:updateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .use(jsonBodyParser())
  .use(
    validator({
      eventSchema: updateTodoSchema
    })
  )
  .handler(async (event) => {
    logger.info('Event: ', event)

    const userId = getUserId(event.headers.Authorization)

    const todoId = event.pathParameters.todoId

    const { done } = event.body

    await todoService.updateTodo(userId, todoId, done)

    return {
      statusCode: 200
    }
  })
