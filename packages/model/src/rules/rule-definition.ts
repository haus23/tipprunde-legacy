export type RuleDefinition<Id extends string = string> = {
  id: Id;
  name: string;
  description: string;
};
