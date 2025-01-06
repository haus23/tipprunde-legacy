import { type LoaderFunctionArgs, redirect } from 'react-router';

export function redirectLegacyRoute({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.search;
  const redirectPath = url.pathname.slice(6);

  return redirect(redirectPath + search);
}
