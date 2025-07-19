FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install CRACO and path-browserify
RUN npm install @craco/craco path-browserify --save-dev

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5001
EXPOSE 3000

CMD ["npm", "start"]
