import LogoImage from '#/assets/logo.svg?no-inline';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        role="img"
        aria-label="Haus 23 Logo"
        className="h-full w-full fill-current"
      >
        <use href={`${LogoImage}#logo`} />
      </svg>
    </div>
  );
}
