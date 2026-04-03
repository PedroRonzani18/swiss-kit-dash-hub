FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY . ./
RUN npm run prisma:generate && npm run build
 
FROM node:lts-alpine
WORKDIR /app
RUN apk add --no-cache openssl curl
RUN curl \
  -sS "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem" \
  -o /usr/local/share/aws-rds-ca-bundle.pem
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["entrypoint.sh"]
CMD ["node", "dist/src/main.js"]