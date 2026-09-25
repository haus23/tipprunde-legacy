import toast from 'react-hot-toast';

export function notify<T>(
  promise: Promise<T>,
  successMsg: string,
  loadingMsg = 'Speichern ...',
) {
  return toast.promise(promise, {
    loading: loadingMsg,
    success: successMsg,
    error: 'Hoppla, das hat nicht geklappt.',
  });
}
