# Use the official Node.js image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install --only=development

# Install Mocha globally
RUN npm install -g mocha

# Copy the rest of the application files
COPY . .

# Expose the port
EXPOSE 3040

# Command to run the application
CMD ["npm", "start"]
