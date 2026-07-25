import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { RequestStatus } from '../../types';

interface StatusSelectProps {
  value: RequestStatus;
  onChange: (val: RequestStatus) => void;
  className?: string;
}

// Русские названия статусов
const statusLabels: Record<RequestStatus, string> = {
  [RequestStatus.New]: 'Новая',
  [RequestStatus.InProgress]: 'В работе',
  [RequestStatus.Ready]: 'Готово',
  [RequestStatus.Closed]: 'Закрыта',
  [RequestStatus.Rejected]: 'Отклонена',
};

export default function StatusSelect({ value, onChange, className = '' }: StatusSelectProps) {
  const options = Object.values(RequestStatus);

  return (
    <Listbox value={value} onChange={onChange}>
      {/* Убрали w-60. Теперь компонент занимает w-full, подстраиваясь под адаптивную 
        мобильную сетку, но сохраняет возможность кастомизации извне через className 
      */}
      <div className={`relative mt-1 w-full ${className}`}>
        <Listbox.Button
          as="button"
          /* Применили .filter-input. Он автоматически задает h-11, скругления, 
            фоны для light/dark и эффекты фокуса (:focus-within).
            Оставляем flex-выравнивание текста, курсор и правый отступ под иконку.
          */
          className="filter-input relative w-full cursor-pointer text-left flex items-center pr-10 text-gray-900 dark:text-smartfix-lightest"
        >
          <span className="block truncate">{statusLabels[value]}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400 dark:text-smartfix-light/70" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Для выпадающего списка адаптируем цвета под вашу палитру smartfix 
            и гарантируем корректное наложение (z-50)
          */}
          <Listbox.Options
            as="div"
            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-smartfix-darker border border-gray-200 dark:border-white/10 py-1 text-base shadow-lg focus:outline-none sm:text-sm text-gray-900 dark:text-smartfix-lightest z-50"
          >
            {options.map((status) => (
              <Listbox.Option
                key={status}
                as="div"
                value={status}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors ${active
                    ? 'bg-gray-100 dark:bg-smartfix-medium/40 text-gray-900 dark:text-white'
                    : 'text-gray-900 dark:text-smartfix-lightest'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                      {statusLabels[status]}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 dark:text-emerald-400">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}