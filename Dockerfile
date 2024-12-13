FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve package globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the app using serve
CMD ["serve", "-s", "dist", "-p", "3000"]