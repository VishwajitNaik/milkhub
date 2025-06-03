# Build Stage
FROM node:20.18.0 AS builder

WORKDIR /app

COPY package*.json ./
COPY package-lock*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage (Run Next.js with Node)
FROM node:20.18.0 AS production

WORKDIR /app

COPY --from=builder /app . 

EXPOSE 3000

CMD ["npm", "run", "start"]
