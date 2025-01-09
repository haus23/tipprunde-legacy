import { toast } from 'react-hot-toast';

export async function clearCache(key: string, topic: string) {
  const cacheUri = `${import.meta.env.VITE_H23_API_SERVER}/api/clear-cache`;
  const body = { key };

  await fetch(cacheUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  toast.success(`API-Cache für ${topic} invalidiert.`);
}
