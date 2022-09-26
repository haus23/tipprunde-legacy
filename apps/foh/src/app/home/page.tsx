import { useChampionships } from '@/hooks/use-championships';
import { SplashScreen } from 'ui';

export default function HomePage() {
  const { championships } = useChampionships();

  return (
    <div className="py-10">
      <SplashScreen />
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {championships.state == 'loading'
              ? 'Loading ...'
              : championships.contents.length === 0
              ? 'No Championship'
              : championships.contents[0].title}
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-8 sm:px-0">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
          </div>
          {/* /End replace */}
        </div>
      </main>
    </div>
  );
}
