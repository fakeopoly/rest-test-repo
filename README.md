# rest-test-repo

Setup with:
```bash
npm i
```

Run dev with:
```bash
npm run start:dev
```

Build and run prod with:
```bash
npm run build
npm run start
```

## Endpoints

The user api allows simple CRUD manipulation of users with the following schema:
```
userId: number # primary key
name: string(maxLength: 100) # name must be unique
age: number(maxValue: 150)
active: bool
email: string(maxLength: 100) | null
```

all endpoints expect `Content-Type: application/json` and emit json data.

Get all users:
```http request
GET http://localhost:9000/api/v1/users
```

Get user from id:
```http request
GET http://localhost:9000/api/v1/users/{userId}
```

Create new User:
```http request
POST http://localhost:9000/api/v1/users

{
	"name": "name",
	"age": 12,
	"active": true,
	"email": "aa@bb.com" # email is not a required field
}
```

Update user with id:
```http request
PUT http://localhost:9000/api/v1/users/{userId}

{
	"name": "name",
	"age": 12,
	"active": true,
	"email": "aa@bb.com" # email is not a required field
}
```

Delete user with id:
```http request
DELETE http://localhost:9000/api/v1/users/{userId}
```
