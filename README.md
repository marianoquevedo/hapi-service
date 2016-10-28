# hapi-service

A RESTful service built with hapi

Live demo: https://hapi-service.herokuapp.com/api

API documentation: https://hapi-service.herokuapp.com/documentation
  
### Features

- Get, create, update and delete an Organization resource. Organizations have the following properties:
  * name
  * description
  * url
  * code
  * type: [employer, insurance, health system]  
  Some conditions:
  - Allow clients to filter results on the GET request method for the following properties: `name` or `code`
  - By default do not return the value of `code` or `url` on the GET request method unless the `code` property has been passed as a parameter
  
- Versioning
- JWT authentication

### Tech stack

  - NodeJS
  - MongoDB
  - Hapi + plugins: 
    - hapi-api-version: *for versioning support*
    - hapi-auth-jwt2: *provides JWT authentication*
    - hapi-mongoose-db-connector: *hapi mongoose plugin*
    - hapi-swagger: *generates swagger documentation based on hapi routes*
  
### Installing, running and testing
```
npm install
npm start
```

The server expects a mongo instance running on port 27017.
You can customize the mongo URL using an environment variable:
```
MONGODB_URI=mongodb://localhost:27017/hapi-service
```

To run the tests:
```
npm test
```

### Versioning

The GET endpoints support versioning. The default version is 2, but you can request version 1 using the header:
```
accept: application/vnd.hapiservice.v1+json
```
**Difference between versions:** version 1 endpoints will always return the `code` and `url` fields, even if the code parameter has not been sent by the client.

### JWT authentication
The endpoints are secured using JWT. To generate a token you need to login first using the endpoint:`/api/account/login`

For now there is only one user that can login to the service:

```
user:admin
password:123
```

### Coding conventions

The code has been written following the Hapi styleguide: http://hapijs.com/styleguide.


