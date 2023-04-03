FROM node:18.15.0-bullseye-slim

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm install --global pnpm

WORKDIR /usr/src/app

# Change user
RUN chown -R node /usr/src/app
USER node

# Fetch deps
COPY --chown=node:node pnpm-lock.yaml ./
RUN pnpm fetch --prod

# Copy app
ADD --chown=node:node . ./
RUN pnpm install -r --offline --prod

# Build app
RUN pnpm build

# Start app
EXPOSE 2605
CMD ["node",".output/server/index.mjs"]
