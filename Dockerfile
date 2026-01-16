# ---------- Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# 1️⃣ Copy package files
COPY package*.json ./
RUN npm install

# 2️⃣ Copy AWS RDS cert EXPLICITLY (IMPORTANT)
COPY global-bundle.pem ./global-bundle.pem

# 3️⃣ Copy rest of the source
COPY . .

# 4️⃣ Build Next.js
RUN npm run build


# ---------- Runner ----------
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# 🔐 Copy AWS RDS CA bundle from builder (NOW EXISTS)
COPY --from=builder /app/global-bundle.pem ./global-bundle.pem

# App files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/package.json ./

EXPOSE 8080
ENV PORT=8080

CMD ["npm", "run", "start"]
