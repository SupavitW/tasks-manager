# Use node base image
FROM node

# Set working directory
WORKDIR /src

# COPY package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the app on port 3000
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]
