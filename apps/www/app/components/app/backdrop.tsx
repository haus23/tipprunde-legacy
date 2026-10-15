// The soft gradient at the top, behind the page content.
export function Backdrop() {
  return (
    <div className="absolute inset-0 h-[480px] bg-gradient-to-b from-highlight to-background opacity-60" />
  );
}
