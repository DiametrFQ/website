FROM node:22-alpine
WORKDIR /app
COPY . .
EXPOSE 3000
RUN npm ci --omit=dev
RUN npm run build
CMD ["npm", "run", "start"]