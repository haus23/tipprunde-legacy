import { Button, Form } from '#/components/ui';
import { signOut } from '#/lib/firebase/auth';

export default function DashboardRoute() {
  async function handleLogout(ev: React.FormEvent) {
    ev.preventDefault();
    await signOut();
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Form action="/logout" onSubmit={handleLogout}>
        <Button type="submit">Log Out</Button>
      </Form>
    </div>
  );
}
