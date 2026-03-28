# Use a node base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies (use package-lock.json if available)
# Pointing to the backend subdirectory
COPY backend/package*.json ./
RUN npm install

# Bundle app source (from backend subdirectory)
COPY backend/ .

# Expose port
EXPOSE 3000

# Start command
CMD [ "npm", "start" ]
