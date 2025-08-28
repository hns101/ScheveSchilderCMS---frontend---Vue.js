# Stage 1: Build the Vue.js application
FROM node:20-alpine AS build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vue.js application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS production-stage

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Vue.js application from the build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
