# Token Service

This is a token service that is backed by DynamoDB.

[V3 of the SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrating-to-v3.html) has broken up the prior monolithic API.

## Infrastructure

All of this _TBD_

- Create the table
- Create secondary indexes
- Delete the table

## Setting up SSL

This [article on how to set up SSL](https://www.hacksparrow.com/webdev/express/https-server-example.html) was my starting point for the `Cert` directory.  The important thing to note is that when prompted for `YOUR name` in the commands below to use `localhost`.

```bash
openssl genrsa -out token-service-key.pem 1024
openssl req -new -key token-service-key.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey token-service-key.pem -out token-service-cert.pem
```

When you use the service, make sure to use `https`!

_For a production application do NOT expose your pem files._

## Starting up the service

`npm run start`

## Methods

These methods were chosen to be a blend of functionality, while also being educational opportunities around REST and DynamoDB operations.

List is proposed operation type on entity (endpoint)

- POST token: stores a TTL, token, query parameters (map), an application ID, feature ID, user ID, and insertion date
- GET token: can be queried by token
- GET token: can be queried by (application ID and user ID)
- GET user: find all entries for a given user ID
- PUT token: update parameters given key
- DELETE token: given key can remove an entry
- DELETE user: given user ID remove all associated entries (use transaction)

### echo

This method echoes back the given parameter in a JSON object.

<https://localhost:8000/echo/something>

## Security

TBD: implement authentication with [OAuth](https://oauth.net/) using [passport](https://www.passportjs.org/)
TBD: or a configurable API key, contemplate access control

## Exercise the service

TBD: create program that will populate the table utilizing faker.js.
This will provide the opportunity to observe how the table and indices grow and perform.

## Resources

- [AWS API Guide for Javascript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html) - [DynamoDB](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html)
- [Express API Reference](http://expressjs.com/en/4x/api.html)
- Generate fake data with [faker.js](https://www.npmjs.com/package/faker)
- [Route separation](https://github.com/expressjs/express/blob/master/examples/route-separation/index.js
)
