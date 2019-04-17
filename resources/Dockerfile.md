## Stand alone & Multiverse API

### Dockerfile
```dockerfile
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

## Multiverse Multienv API

### Dockerfile
```dockerfile
# Base image to be used in this project
FROM node:10-alpine AS prod

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

# Development target
FROM node:10-alpine AS dev
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 8081:3000
CMD [ "npm", "run", "dev" ]
```