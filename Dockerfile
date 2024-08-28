# Step 1: Build the Next.js application
# Use the official Node.js image as a base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Step 2: Create the production image
# Use a lightweight web server (e.g., Nginx, or a node image) to serve the built files
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app ./

# Expose the port the Next.js app will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]

