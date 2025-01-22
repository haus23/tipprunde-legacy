import { Link, buttonStyles } from '#/components/ui';

export default function DashboardRoute() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link
        className={(renderProps) =>
          buttonStyles({ ...renderProps, intent: 'primary' })
        }
        href="/logout"
      >
        Log Out
      </Link>
    </div>
  );
}
