import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getUserId } from '../../service/auth.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { todoService } from '../../service/todo.mjs'

const logger = createLogger('lambda:generateUploadUrl')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Event: ', event)
    const todoId = event.pathParameters.todoId

    const userId = getUserId(event.headers.Authorization)

    const uploadUrl = await todoService.getUploadUrl(userId, todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })
