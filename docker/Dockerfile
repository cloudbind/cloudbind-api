FROM node:18

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development"]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . .

EXPOSE 5000

CMD ["node", "./src/index.js"]

# docker build -t <name> .
# docker image ls
# docker image rm <tag>