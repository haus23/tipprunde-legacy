import toast from 'react-hot-toast';

export function notify(promise: Promise<unknown>, successMsg: string) {
  return toast.promise(promise, {
    loading: 'Speichern ...',
    success: successMsg,
    error: 'Hoppla, das hat nicht geklappt.',
  });
}
