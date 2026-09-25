import toast from 'react-hot-toast';

export function notify<T>(promise: Promise<T>, successMsg: string) {
  return toast.promise(promise, {
    loading: 'Speichern ...',
    success: successMsg,
    error: 'Hoppla, das hat nicht geklappt.',
  });
}
