FROM ghcr.io/pnpm/pnpm:12.5.1

COPY . /workspace
WORKDIR /workspace

RUN pnpm runtime set node "$(pnpm -C apps/unterbau pkg get engines.runtime.version)" -g
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --filter=@haus23/tipprunde-unterbau... --frozen-lockfile
RUN pnpm --filter=@haus23/tipprunde-unterbau exec node --version

EXPOSE 26515
CMD ["pnpm", "--filter=@haus23/tipprunde-unterbau", "start"]
