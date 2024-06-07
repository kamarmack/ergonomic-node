# Use official Node LTS (Node 20)
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy the entire repo
COPY . .

# Install dependencies
RUN npm install
