# Base image
FROM node

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port that the React app runs on
EXPOSE 5173

# Start the React app
CMD ["npm", "run", "dev"]
