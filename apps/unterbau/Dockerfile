FROM node:22-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy workspace source
COPY . /workspace
WORKDIR /workspace

# Fetch deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Start app
EXPOSE 26515
CMD ["pnpm","start:unterbau"]
