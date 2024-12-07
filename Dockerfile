# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the React app using nginx
FROM nginx:alpine

# Copy the build output from the previous stage to nginx's public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default nginx port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
