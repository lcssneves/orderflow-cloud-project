# Use a node base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies (use package-lock.json if available)
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD [ "npm", "start" ]
