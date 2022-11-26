import { useRanking } from "@/hooks/use-ranking";
import { useParams } from "react-router-dom";

export default function MatchesPage() {
  const { matchId, championshipId } = useParams();
  const { players, rounds, matches, tips } = useRanking();

  const lastMatch = [...matches].reverse().find(m => m.result !== '') || matches[0];
  const match = matchId ? matches.find(m => m.id === matchId) || lastMatch : lastMatch;

  return (
    <div className="mx-auto max-w-5xl mt-6 sm:px-6 lg:px-8">
    <header className="flex justify-center text-center sm:text-left sm:justify-start">
      <h1 className="text-xl font-semibold leading-tight tracking-tight flex items-center gap-x-4">
        <span>Tipps für</span>
        <div>
          {match.hometeam.name} - {match.awayteam.name}
        </div>
      </h1>
    </header>
    <div className="mt-6">

    </div>
  </div>
  );
}
