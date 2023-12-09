import middy from '@middy/core'
import cors from '@middy/http-cors'
import validator from '@middy/validator'
import httpErrorHandler from '@middy/http-error-handler'
import jsonBodyParser from '@middy/http-json-body-parser'

import { newTodoSchema } from '../../model/todo.mjs'
import { getUserId } from '../../service/auth.mjs'
import { todoService } from '../../service/todo.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('lambda:createTodo')

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
      eventSchema: newTodoSchema
    })
  )
  .handler(async (event) => {
    logger.info('Event: ', event)

    const userId = getUserId(event.headers.Authorization)

    const todo = event.body

    const newTodo = await todoService.createTodo(userId, todo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newTodo
      })
    }
  })

