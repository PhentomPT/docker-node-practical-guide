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
version: '3.4'

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
In this example we will have an API that we can call and it will return a simple ``Welcome to Docker!`` message

- Create a file named ``Dockerfile`` with the above correspondent contents
- Run the ``$ docker build -t docker-presentation .`` command to build an image
- Run the ``$ docker run -p 8081:3000 docker-presentation`` command to start the application

Access the ✨[API Link](http://localhost:8081)✨, wonderful! we can run a Nodejs app in our machine without having node or any of its dependencies and we can be sure that the app will run the same on any other place!

- Note that if you try to step out of the terminal in a windows environment the container is still running, to really stop the container you have to ``$ docker container stop ID`` or add the flag ``-it`` to the run command

### Multiverse API
The above method is good when we have a single application, but what if we have multiple apps that need to talk to each other?! it becomes a litle hard to manage...

Lets take a look at a better approach!

In the next example we will include a database, a web interface to view its records and change the code we previously had to be able to insert a user in it every time the ``/add-user`` route is called.

- Create a ``docker-compose.yaml`` with the above correspondent contents
- Update the ``index.js`` file with the code below. I know its not the best code you ever saw but it works for the example 😄
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
    switch (req.url) {
      case '/add-user':
        DB.sync().then(() => User.create({
            username: 'janedoe',
            birthday: new Date(1980, 6, 20)
        })).then(object => {
            res.write('User inserted in DB!')
            res.end()
        });
        break;
      case '/':
        res.write('Welcome to Docker!')
        res.end()
        break;
      default:
        res.write('404 - Whale not found...')
        res.end()
        break;
    }
})
const port = 3000

server.listen(port, () => {
    console.log(`Backend service is running in ${port}`)
})
```
- Run 
```shell
$ docker-compose up --build
```

When accessing the [API add user link](http://localhost:8081/add-user) a new user should be inserted.

You can view the information via the [DB Manager](http://localhost:8082) with the above login information.

| System | Username | Password |
| --- | --- | --- |
| PostgreSQL | postgres | root |

As you can see it's easier to manage multiple apps and tools locally with this approach 🐳

### Multiverse Multienv API
Our example app is working fine and with as many dependencies as needed but...

Everytime i change the code i have to stop the docker service and build it again 😢, fear not there is a solution, let's check it out!

We will make an 2 docker-composer files and add targets to the Dockerfile

- In the docker file change the first line to look something like this ``FROM node:10-alpine AS prod``, with this we are making a target that we can use in the docker-compose

- Rename the ``docker-compose.yaml`` to ``prod-compose.yaml``

- On the ``build: .`` line change it to use the prod target we just created in the Dockerfile
```yaml
    build: 
      context: .
      target: prod
```

- Everyting should be working the same, but the command to start it up should now be the following

```shell
$ docker-compose -f prod-compose.yaml up --build
```
Lets make the **development** part now!

- In the Dockerfile make a copy of the content and paste it below the existing one

- Rename the target from ``prod`` to ``dev`` on the copied content

- Change the ``CMD`` command to ``CMD [ "npm", "run", "dev" ]``

- Make a copy of the ``prod-compose.yaml`` and name it ``dev-compose.yaml``

- In the ``dev-compose.yaml`` change the target from ``prod`` to ``dev``

- Add a ``volume`` property to the ``api`` service like soo, this will create a bind from our project to the docker container
```yaml
    volumes:
      - '.:/app'
```

- Everyting should be working correctly for the **development** environment and the command to start it up should now be the following 🤞

```shell
$ docker-compose -f dev-compose.yaml up --build
```

- If you now change the ``index.js`` welcome ``Welcome to Docker!`` for example the changes will made without the need to restart the docker service 🎉🎉
```javascript
res.write(`Hi to Docker!`)
```

