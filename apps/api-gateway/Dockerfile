FROM node:20-alpine AS base
WORKDIR /repo/apps/api-gateway

# Copy package files
COPY apps/api-gateway/package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY apps/api-gateway/src ./src
COPY apps/api-gateway/prisma ./prisma
COPY apps/api-gateway/.eslintrc.json .
COPY apps/api-gateway/.env.example .

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "run", "dev"]