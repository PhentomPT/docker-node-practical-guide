## Requirements 🔨
- [Docker](https://docker.com)

## Resources 📜
### The Dockerfile 
```Dockerfile
# Base image to be used in this project
FROM node:10-alpine

# Copying the content from the project root folder to the system work directory
COPY . /app

# Setting the work directory for the current process
WORKDIR /app

# Command/s to run before the project initializes
RUN npm install

# Poxying the external port 8081 to the internal port 3000
EXPOSE 8081:3000

# The start up command for the project
CMD [ "npm", "start" ]
```

### The docker-compose.yaml
```yaml
# The version of the docker compose that will be used
version: '3'

# Services to declare
services: 
  # API web server based on a existing docker build
  api:
    build: .
    ports: 
      - '8081:3000'
    depends_on: 
      - db
  # A DB service to create base on a image
  db:
    image: postgres:9.4.21-alpine
    environment: 
      POSTGRES_PASSWORD: root
  # A DB admin web interface based on a image just to check data
  adminer:
    image: adminer
    ports:
      - '8082:8080'
```

## Tutorial 📘
### Stand alone API
- Create a file named ``Dockerfile`` with the above correspondent contents
- Run the ``$ docker build -t docker-presentation .`` command to build an image
- Run the ``$ docker run -p 8081:3000 docker-presentation`` command to start the application

[API Link](http://localhost:8081)

- Note that if you try to step out of the terminal the container is still running, to really stop the container you have to ``$ docker container stop ID`` or add the flag ``-it`` to the run command

### Multiverse API

The above method is good when we have a single application, but if you have services or applications that need to talk to each other it becomes a litle hard to manage.

Lets take a look at a better approach

- Create a ``docker-compose.yaml`` with the above correspondent contents
- Update the ``index.js`` file with 
```javascript
const http = require('http')
const Sequelize = require('sequelize')
const DB = new Sequelize('postgres', 'postgres', 'root', {
    host: 'db',
    dialect: 'postgres'
})

class User extends Sequelize.Model {}
User.init({
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
}, { sequelize: DB, modelName: 'user' });
  
const server = http.createServer((req, res) => {
    DB.sync().then(() => User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20)
    })).then(object => {
        res.write('User inserted in DB!')
        res.end()
    });
})
const port = 3000

server.listen(port, () => {
    console.log(`Backend service is running in ${port}`)
})
```
- Every time the API is called a user will be inserted in the database
- Run 
```
$ docker-compose build
$ docker-compose up
```

[API Link](http://localhost:8081)

[DB Manager](http://localhost:8082)

| System | Username | Password |
| --- | --- | --- |
| PostgreSQL | postgres | root |
