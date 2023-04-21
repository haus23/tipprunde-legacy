import { getChampionships } from '~/lib/query/get-championships';

export default cachedEventHandler(getChampionships, { name: 'championships' });
