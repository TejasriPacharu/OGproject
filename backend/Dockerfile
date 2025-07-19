FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add --no-cache g++ make python3

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create necessary temp directories
RUN mkdir -p ./services/codes ./services/inputs ./services/outputs

# Expose port
EXPOSE 5001

# Start server
CMD ["npm", "run", "dev"]
