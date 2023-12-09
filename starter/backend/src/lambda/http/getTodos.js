import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { todoService } from '../../service/todo.mjs'
import { getUserId } from '../../service/auth.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('lambda:getTodos')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event.headers.Authorization)

    logger.info('Event: ', event)
    logger.info('Userid: ', userId)

    const items = await todoService.getTodos(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })
