# Step 1: Specify the base image
FROM node:16-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the back-end code into the container
COPY . .

# Step 5: Expose the port the back end listens on (adjust if necessary)
EXPOSE 3000

# Step 6: Define the command to start the back-end app
CMD ["npm", "start"]
