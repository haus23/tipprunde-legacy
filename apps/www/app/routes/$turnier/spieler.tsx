import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$turnier/spieler')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$turnier/spieler"!</div>
}
