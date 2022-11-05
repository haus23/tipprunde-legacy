import { Popover } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { usePopper } from 'react-popper';

type InfoPopoverProps = {
  text: string;
};

export default function InfoPopover({ text }: InfoPopoverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top-end',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
      {
        name: 'arrow',
      },
    ],
  });

  return (
    <div>
      <Popover className="relative">
        <Popover.Button ref={setReferenceElement}>
          <InformationCircleIcon className="w-5 h-5 text-blue-500" />
        </Popover.Button>

        <Popover.Panel
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="px-6 py-2 z-10 text-sm font-light text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
            {text}
          </div>
          <div data-popper-arrow>X</div>
        </Popover.Panel>
      </Popover>
    </div>
  );
}
