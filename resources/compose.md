## Multiverse API

### docker-compose.yaml
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

## Multiverse Multienv API

### prod-compose.yaml
```yaml
# The version of the docker compose that will be used
version: '3.4'

# Services to declare
services: 
  # API web server based on a existing docker build
  api:
    build: 
      context: .
      target: prod
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

### dev-compose.yaml
```yaml
# The version of the docker compose that will be used
version: '3.4'

# Services to declare
services: 
  # API web server based on a existing docker build
  api:
    build: 
      context: .
      target: dev
    volumes:
      - '.:/app'
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