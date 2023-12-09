import jsonwebtoken from 'jsonwebtoken'

export function getUserId(authHeader) {
  const split = authHeader.split(' ')
  const jwtToken = split[1]

  const decodedJwt = jsonwebtoken.decode(jwtToken, { complete: true })
  return decodedJwt.payload.sub
}
