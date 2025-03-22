/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ChampionshipImport } from './routes/$championship'
import { Route as SpielerRouteImport } from './routes/spieler_/route'
import { Route as SpieleRouteImport } from './routes/spiele_/route'
import { Route as IndexImport } from './routes/index'
import { Route as ChampionshipIndexImport } from './routes/$championship/index'
import { Route as ChampionshipSpielerImport } from './routes/$championship/spieler'
import { Route as ChampionshipSpieleImport } from './routes/$championship/spiele'

// Create/Update Routes

const ChampionshipRoute = ChampionshipImport.update({
  id: '/$championship',
  path: '/$championship',
  getParentRoute: () => rootRoute,
} as any)

const SpielerRouteRoute = SpielerRouteImport.update({
  id: '/spieler_',
  path: '/spieler',
  getParentRoute: () => rootRoute,
} as any)

const SpieleRouteRoute = SpieleRouteImport.update({
  id: '/spiele_',
  path: '/spiele',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ChampionshipIndexRoute = ChampionshipIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => ChampionshipRoute,
} as any)

const ChampionshipSpielerRoute = ChampionshipSpielerImport.update({
  id: '/spieler',
  path: '/spieler',
  getParentRoute: () => ChampionshipRoute,
} as any)

const ChampionshipSpieleRoute = ChampionshipSpieleImport.update({
  id: '/spiele',
  path: '/spiele',
  getParentRoute: () => ChampionshipRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/spiele_': {
      id: '/spiele_'
      path: '/spiele'
      fullPath: '/spiele'
      preLoaderRoute: typeof SpieleRouteImport
      parentRoute: typeof rootRoute
    }
    '/spieler_': {
      id: '/spieler_'
      path: '/spieler'
      fullPath: '/spieler'
      preLoaderRoute: typeof SpielerRouteImport
      parentRoute: typeof rootRoute
    }
    '/$championship': {
      id: '/$championship'
      path: '/$championship'
      fullPath: '/$championship'
      preLoaderRoute: typeof ChampionshipImport
      parentRoute: typeof rootRoute
    }
    '/$championship/spiele': {
      id: '/$championship/spiele'
      path: '/spiele'
      fullPath: '/$championship/spiele'
      preLoaderRoute: typeof ChampionshipSpieleImport
      parentRoute: typeof ChampionshipImport
    }
    '/$championship/spieler': {
      id: '/$championship/spieler'
      path: '/spieler'
      fullPath: '/$championship/spieler'
      preLoaderRoute: typeof ChampionshipSpielerImport
      parentRoute: typeof ChampionshipImport
    }
    '/$championship/': {
      id: '/$championship/'
      path: '/'
      fullPath: '/$championship/'
      preLoaderRoute: typeof ChampionshipIndexImport
      parentRoute: typeof ChampionshipImport
    }
  }
}

// Create and export the route tree

interface ChampionshipRouteChildren {
  ChampionshipSpieleRoute: typeof ChampionshipSpieleRoute
  ChampionshipSpielerRoute: typeof ChampionshipSpielerRoute
  ChampionshipIndexRoute: typeof ChampionshipIndexRoute
}

const ChampionshipRouteChildren: ChampionshipRouteChildren = {
  ChampionshipSpieleRoute: ChampionshipSpieleRoute,
  ChampionshipSpielerRoute: ChampionshipSpielerRoute,
  ChampionshipIndexRoute: ChampionshipIndexRoute,
}

const ChampionshipRouteWithChildren = ChampionshipRoute._addFileChildren(
  ChampionshipRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/spiele': typeof SpieleRouteRoute
  '/spieler': typeof SpielerRouteRoute
  '/$championship': typeof ChampionshipRouteWithChildren
  '/$championship/spiele': typeof ChampionshipSpieleRoute
  '/$championship/spieler': typeof ChampionshipSpielerRoute
  '/$championship/': typeof ChampionshipIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/spiele': typeof SpieleRouteRoute
  '/spieler': typeof SpielerRouteRoute
  '/$championship/spiele': typeof ChampionshipSpieleRoute
  '/$championship/spieler': typeof ChampionshipSpielerRoute
  '/$championship': typeof ChampionshipIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/spiele_': typeof SpieleRouteRoute
  '/spieler_': typeof SpielerRouteRoute
  '/$championship': typeof ChampionshipRouteWithChildren
  '/$championship/spiele': typeof ChampionshipSpieleRoute
  '/$championship/spieler': typeof ChampionshipSpielerRoute
  '/$championship/': typeof ChampionshipIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/spiele'
    | '/spieler'
    | '/$championship'
    | '/$championship/spiele'
    | '/$championship/spieler'
    | '/$championship/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/spiele'
    | '/spieler'
    | '/$championship/spiele'
    | '/$championship/spieler'
    | '/$championship'
  id:
    | '__root__'
    | '/'
    | '/spiele_'
    | '/spieler_'
    | '/$championship'
    | '/$championship/spiele'
    | '/$championship/spieler'
    | '/$championship/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  SpieleRouteRoute: typeof SpieleRouteRoute
  SpielerRouteRoute: typeof SpielerRouteRoute
  ChampionshipRoute: typeof ChampionshipRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  SpieleRouteRoute: SpieleRouteRoute,
  SpielerRouteRoute: SpielerRouteRoute,
  ChampionshipRoute: ChampionshipRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/spiele_",
        "/spieler_",
        "/$championship"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/spiele_": {
      "filePath": "spiele_/route.tsx"
    },
    "/spieler_": {
      "filePath": "spieler_/route.tsx"
    },
    "/$championship": {
      "filePath": "$championship.tsx",
      "children": [
        "/$championship/spiele",
        "/$championship/spieler",
        "/$championship/"
      ]
    },
    "/$championship/spiele": {
      "filePath": "$championship/spiele.tsx",
      "parent": "/$championship"
    },
    "/$championship/spieler": {
      "filePath": "$championship/spieler.tsx",
      "parent": "/$championship"
    },
    "/$championship/": {
      "filePath": "$championship/index.tsx",
      "parent": "/$championship"
    }
  }
}
ROUTE_MANIFEST_END */
