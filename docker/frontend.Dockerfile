# Use Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build React app
RUN npm run build

# Install serve to serve build
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Run app
CMD ["serve", "-s", "build", "-l", "3000"]