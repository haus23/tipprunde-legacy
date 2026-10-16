// The soft gradient at the top, behind the page content.
export function Backdrop() {
  return (
    <div className="absolute inset-0 h-120 bg-linear-to-b from-highlight to-background opacity-60" />
  );
}
