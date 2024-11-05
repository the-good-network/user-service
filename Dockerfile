# Use the official Node.js 18 Alpine image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application source code to the container
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

# Use npm start to run the application as specified in package.json
CMD ["npm", "start"]