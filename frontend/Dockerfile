FROM node:18-alpine AS build

WORKDIR /usr/src/frontend

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage using nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /usr/src/frontend/build /usr/share/nginx/html

# Configure nginx to handle client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
