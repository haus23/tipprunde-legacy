import { Card, CardTitle } from '#/components/card';

// Card for the table views (matches, tips, results, extra points). The header
// with title, description, main action and an optional toolbar row (round
// navigator, player selection) stays visible while the table scrolls; on
// mobile it sticks below the app bar.

type DataCardProps = {
  action?: React.ReactNode;
  children: React.ReactNode;
  description?: React.ReactNode;
  title: string;
  toolbar?: React.ReactNode;
};

export default function DataCard({
  action,
  children,
  description,
  title,
  toolbar,
}: DataCardProps) {
  return (
    <Card>
      <div className="sticky top-(--app-bar-height) z-10 border-border border-b bg-card md:top-0">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <CardTitle>{title}</CardTitle>
            {description && (
              <p className="mt-1 text-muted-foreground text-sm">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        {toolbar && (
          <div className="border-border border-t px-4 py-3 sm:px-6">
            {toolbar}
          </div>
        )}
      </div>
      {children}
    </Card>
  );
}
