import jsonwebtoken from 'jsonwebtoken';
import { createLogger } from './logger.mjs'

const logger = createLogger('service:auth')

export function getUserId(authHeader) {
  const split = authHeader.split(' ')
  const jwtToken = split[1]
  logger.info(`jwtToken: ${jwtToken}`)

  const decodedJwt = jsonwebtoken.decode(jwtToken, { complete: true })
  logger.info(`decodedJwt: ${decodedJwt}`)

  return decodedJwt.payload.sub
}