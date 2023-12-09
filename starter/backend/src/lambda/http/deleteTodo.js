import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getUserId } from '../../service/auth.mjs'
import { todoService } from '../../service/todo.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('lambda:deleteTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Event: ', event)

    const userId = getUserId(event.headers.Authorization)

    const todoId = event.pathParameters.todoId

    await todoService.deleteTodo(userId, todoId)

    return {
      statusCode: 200
    }
  })
