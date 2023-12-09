import { JwksClient } from 'jwks-rsa'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

/*const certificate = `-----BEGIN CERTIFICATE-----
MIIC+TCCAeGgAwIBAgIJELFBaXKrNhQAMA0GCSqGSIb3DQEBCwUAMBoxGDAWBgNV
BAMTD2R1eWhiLmF1dGgwLmNvbTAeFw0xNzExMjYxNDAzMDZaFw0zMTA4MDUxNDAz
MDZaMBoxGDAWBgNVBAMTD2R1eWhiLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEB
BQADggEPADCCAQoCggEBAKJ4F0174Rrtt/aKMbL9N7G3i9S8cVh9uj5VK20dsNNJ
0g4WdZIxlKlflCIQupDU4NFCf5BnY4fKScP5zJ2yT+K69VMeufBNgjVHKR8R5Qb1
Ix/d64J3amDGUMgkipL9tAe2FzyMCiAaYG9kIrMKXNCL/511HbgRF2wscisitD/D
wnlIzMR4NtiEHpqWLX7eGHwL4u/nwAVUvTQ0U1+WmsmrZvjJ7km119FZeItUYEVl
gcRoAa5B1ywZ/fdcHskVuwjl4Eta0q18HDwpdpQNKCHC/yZaSzLtewpKXMVMJFFe
udSrs7vfYoyI5gJPo6aYILfH+8hUHYuwQN34P+dRzIkCAwEAAaNCMEAwDwYDVR0T
AQH/BAUwAwEB/zAdBgNVHQ4EFgQUYYDv7ONKUTDX9i/Bivn6X1MdHRQwDgYDVR0P
AQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAhCRgQxkiitl/P2sHxGuplUYSy
5zbxK/Rco+62gHgbXaHhuzWInz4dQc4afmBSzdmQmJumMWJESQLytFHZv2t2OC0J
1WlNL9FrBnlrjVMcySR1ZTQwvQNl2B1vGTKUOCoRhstMtNCyGc3NefWuZKJFEWEd
mcFkV/K6hTv6WYE5pvpJt/MiBJ2y8uAtQEzGciTd18uPfPiSQFkNJcavksLXKQDa
nhN+Kg4ulCkoD1hSJIvCgvSnmGuP/IQHl+K7MChPHyyvk+4RyUVZYQNev9SRI8DB
W8QVaqsSdNhQlu5/khnXJJCrdyM2ssQrxraJaqo9YkJx5JyWeSU9wJHtpb2z
-----END CERTIFICATE-----`*/

const client = new JwksClient({
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: 600000, // Defaults to 10m
  jwksUri: 'https://duyhb.auth0.com/.well-known/jwks.json'
});

export async function handler(event) {
  try {
    logger.info('Event: ', event)
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)

  const kid = 'QzgxMDQyQkVGNjQxOTJEOThDNDY1QThERUNFRDk4QjY0MTQxNDdFQg';
  const key = await client.getSigningKey(kid);
  const signingKey = key.getPublicKey();

  console.log(`signingKey ${signingKey}`)
  return jsonwebtoken.verify(token, signingKey, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
