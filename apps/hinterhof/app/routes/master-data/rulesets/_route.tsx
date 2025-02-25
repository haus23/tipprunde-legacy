import { Heading } from '@/components/ui/heading';
import { useRulesets } from '@/utils/state/rulesets';

function RulesetsRoute() {
  const { rulesets } = useRulesets();

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">Regelwerke {rulesets.length}</Heading>
      </header>
    </div>
  );
}

export { RulesetsRoute as Component };
