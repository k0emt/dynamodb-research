/*
- POST /token/# stores a TTL, token, query parameters (map), 
    an application ID, feature ID, user ID, and insertion date
- GET /token/# can be queried by token
- GET /token/?appId=#&userId=# can be queried by (application ID and user ID)
- PUT /token/token body with full replace parameters given key
- PATCH /token/# body with update parameters given key
- DELETE /token/# given key can remove an entry
*/
