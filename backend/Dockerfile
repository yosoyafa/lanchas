# Use Node 20 with Debian
FROM node:20-bookworm

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of the code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
