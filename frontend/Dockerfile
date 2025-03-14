# Stage 1: Build the front-end application
FROM node:18-alpine AS build
WORKDIR /app

# Copy only package.json and package-lock.json first for caching
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . . 

# Ensure the build runs correctly and check if dist/ exists
RUN npm run build && ls -la /app/dist

# Stage 2: Serve the built app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
