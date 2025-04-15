import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$turnier/spiele')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$turnier/spiele"!</div>
}
