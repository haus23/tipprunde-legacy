/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TurnierImport } from './routes/$turnier'
import { Route as SpielerRouteImport } from './routes/spieler_/route'
import { Route as SpieleRouteImport } from './routes/spiele_/route'
import { Route as TurnierIndexImport } from './routes/$turnier/index'

// Create/Update Routes

const TurnierRoute = TurnierImport.update({
  id: '/$turnier',
  path: '/$turnier',
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

const TurnierIndexRoute = TurnierIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => TurnierRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
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
    '/$turnier': {
      id: '/$turnier'
      path: '/$turnier'
      fullPath: '/$turnier'
      preLoaderRoute: typeof TurnierImport
      parentRoute: typeof rootRoute
    }
    '/$turnier/': {
      id: '/$turnier/'
      path: '/'
      fullPath: '/$turnier/'
      preLoaderRoute: typeof TurnierIndexImport
      parentRoute: typeof TurnierImport
    }
  }
}

// Create and export the route tree

interface TurnierRouteChildren {
  TurnierIndexRoute: typeof TurnierIndexRoute
}

const TurnierRouteChildren: TurnierRouteChildren = {
  TurnierIndexRoute: TurnierIndexRoute,
}

const TurnierRouteWithChildren =
  TurnierRoute._addFileChildren(TurnierRouteChildren)

export interface FileRoutesByFullPath {
  '/spiele': typeof SpieleRouteRoute
  '/spieler': typeof SpielerRouteRoute
  '/$turnier': typeof TurnierRouteWithChildren
  '/$turnier/': typeof TurnierIndexRoute
}

export interface FileRoutesByTo {
  '/spiele': typeof SpieleRouteRoute
  '/spieler': typeof SpielerRouteRoute
  '/$turnier': typeof TurnierIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/spiele_': typeof SpieleRouteRoute
  '/spieler_': typeof SpielerRouteRoute
  '/$turnier': typeof TurnierRouteWithChildren
  '/$turnier/': typeof TurnierIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/spiele' | '/spieler' | '/$turnier' | '/$turnier/'
  fileRoutesByTo: FileRoutesByTo
  to: '/spiele' | '/spieler' | '/$turnier'
  id: '__root__' | '/spiele_' | '/spieler_' | '/$turnier' | '/$turnier/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  SpieleRouteRoute: typeof SpieleRouteRoute
  SpielerRouteRoute: typeof SpielerRouteRoute
  TurnierRoute: typeof TurnierRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  SpieleRouteRoute: SpieleRouteRoute,
  SpielerRouteRoute: SpielerRouteRoute,
  TurnierRoute: TurnierRouteWithChildren,
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
        "/spiele_",
        "/spieler_",
        "/$turnier"
      ]
    },
    "/spiele_": {
      "filePath": "spiele_/route.tsx"
    },
    "/spieler_": {
      "filePath": "spieler_/route.tsx"
    },
    "/$turnier": {
      "filePath": "$turnier.tsx",
      "children": [
        "/$turnier/"
      ]
    },
    "/$turnier/": {
      "filePath": "$turnier/index.tsx",
      "parent": "/$turnier"
    }
  }
}
ROUTE_MANIFEST_END */
