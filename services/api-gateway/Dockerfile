FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy API Gateway source
COPY services/api-gateway ./services/api-gateway

# Install dependencies
RUN npm ci --only=production

# Build the application
RUN npm run build --workspace=@taskcore/shared
RUN npm run build --workspace=@taskcore/api-gateway

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start", "--workspace=@taskcore/api-gateway"]