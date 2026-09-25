FROM node:22.19-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev --ignore-scripts && npm cache clean --force
COPY server ./server
COPY src/app/model.ts ./src/app/model.ts
RUN mkdir -p /app/server/data && chown -R node:node /app/server/data
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3001 DATA_FILE=/app/server/data/designflow.sqlite
EXPOSE 3001
CMD ["npm", "run", "server"]
