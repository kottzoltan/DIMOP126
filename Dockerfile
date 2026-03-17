# DIMOP126 - Node + Python (openpyxl) + LibreOffice
FROM node:20-bookworm-slim

# Install Python + LibreOffice
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    libreoffice \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir openpyxl

WORKDIR /app

# package.json + lockfile biztonságos másolása
COPY package*.json ./

# npm install fallback
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]