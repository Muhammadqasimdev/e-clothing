FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache git curl

# Set working directory
WORKDIR /app

# Install global dependencies
RUN npm install -g nx

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Expose ports
EXPOSE 3000 4200

# Default command
CMD ["yarn", "start:all"]
