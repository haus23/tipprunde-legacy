type AppCardProps = {
  children: React.ReactNode;
};
export default function AppCard({ children }: AppCardProps) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div>{children}</div>
    </div>
  );
}
