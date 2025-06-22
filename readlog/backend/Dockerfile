FROM node:20-alpine3.18
# if you want you can specify the env variable here ENV PORT=8000
RUN addgroup app && adduser -S -G app app
USER app
WORKDIR /app
COPY package*.json /app
USER root
RUN chown -R app:app /app
USER app
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]