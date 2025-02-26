export async function clearCache(...keys: string[]) {
  const cacheUri = `${import.meta.env.VITE_H23_API_SERVER}/api/cache`;
  const body = { keys };

  await fetch(cacheUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
