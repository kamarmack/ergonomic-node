# Use official Node LTS (Node 18)
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy the entire repo
COPY . .

# Install dependencies
RUN npm install
