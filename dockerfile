# Use node base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# COPY package.json and package-lock.json (if it exists)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application source code
COPY src ./src/
COPY tsconfig.json nodemon.json jest.config.ts ./
COPY .env ./

# Expose the app on port 3000
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
