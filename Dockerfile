# Use the official Node.js image
FROM node

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install --only=development

# Install Mocha globally
RUN npm install -g mocha

# Install AWS CLI
RUN apt-get update && \
    apt-get install -y curl unzip && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws

# Copy the rest of the application files
COPY . .

# Expose the port
EXPOSE 3040

# Command to run the application
CMD ["npm", "start"]
