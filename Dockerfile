# DIMOP126 - Node + Python (openpyxl) + LibreOffice
FROM node:20-bookworm-slim

# Install Python, LibreOffice (for soffice --headless)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip \
    libreoffice \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/* \
    && pip3 install --no-cache-dir openpyxl

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
