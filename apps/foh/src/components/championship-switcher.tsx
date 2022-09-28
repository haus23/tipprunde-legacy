import { Fragment, useCallback, useEffect, useState } from 'react';
import { FolderIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { classNames } from 'ui';
import { useMatch, useMatches, useNavigate } from '@tanstack/react-location';
import { LocationGenerics } from '@/app.routes';
import { Championship } from 'lib';

export default function ChampionshipSwitcher() {
  const {
    data: { championships },
  } = useMatch<LocationGenerics>();

  const childRoutePath = useMatches().at(1)?.route.path || '';

  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const [open, setOpen] = useState(false);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'k' && event.ctrlKey) {
      event.preventDefault();
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const filteredChampionships =
    query === ''
      ? []
      : championships?.filter((championship) => {
          return championship.title.toLowerCase().includes(query.toLowerCase());
        }) || [];

  function switchChampionship(championship: Championship) {
    setOpen(false);
    const childPath = childRoutePath !== '/' ? '/' + childRoutePath : '';
    navigate({ to: `/${championship.id + childPath}` });
  }

  return (
    <>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex gap-x-2 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
          <span>Turnier</span>
        </button>
      </div>
      <Transition.Root
        show={open}
        as={Fragment}
        afterLeave={() => setQuery('')}
        appear
      >
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-xl transform rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Combobox onChange={switchChampionship}>
                  <Combobox.Input
                    className="w-full rounded-md border-0 bg-gray-100 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                    placeholder="Turnier"
                    onChange={(event) => setQuery(event.target.value)}
                  />

                  {filteredChampionships.length > 0 && (
                    <Combobox.Options
                      static
                      className="-mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                    >
                      {filteredChampionships.map((championship) => (
                        <Combobox.Option
                          key={championship.id}
                          value={championship}
                          className={({ active }) =>
                            classNames(
                              'cursor-default select-none rounded-md px-4 py-2',
                              active && 'bg-indigo-600 text-white'
                            )
                          }
                        >
                          {championship.title}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}

                  {query !== '' && filteredChampionships.length === 0 && (
                    <div className="py-14 px-4 text-center sm:px-14">
                      <FolderIcon
                        className="mx-auto h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                      <p className="mt-4 text-sm text-gray-900">
                        Kein Turnier passt zu der Suche.
                      </p>
                    </div>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
