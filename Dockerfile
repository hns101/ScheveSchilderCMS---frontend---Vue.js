# Stage 1: Build the Vue.js application
FROM node:20-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean npm cache and remove any existing lock files to avoid optional dependency issues
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force

# Install all dependencies (including dev dependencies needed for build)
RUN npm install

# Explicitly install the Rollup binary for Alpine Linux
RUN npm install @rollup/rollup-linux-x64-musl --save-optional

# Copy source code
COPY . .

# Build the Vue.js application for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine AS production-stage

# Install wget for health checks
RUN apk add --no-cache wget

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Vue.js application from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]