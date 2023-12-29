import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import type { TUsePDFSlickStore } from '@pdfslick/react'
import { ChevronDownIcon, DashIcon, PlusIcon } from '@primer/octicons-react'

const presets = new Map([
  ['auto', 'Auto'],
  ['page-actual', 'Actual Size'],
  ['page-fit', 'Page Fit'],
  ['page-width', 'Page Width'],
])

const zoomVals = new Map([
  [0.5, '50%'],
  [0.75, '75%'],
  [1, '100%'],
  [1.25, '125%'],
  [1.5, '150%'],
  [2, '200%'],
])

type ZoomSelectorProps = {
  usePDFSlickStore: TUsePDFSlickStore
}

const ZoomSelector = ({ usePDFSlickStore }: ZoomSelectorProps) => {
  const scale = usePDFSlickStore((s) => s.scale)
  const scaleValue = usePDFSlickStore((s) => s.scaleValue)
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick)

  return (
    <div className="flex items-center space-x-1">
      <button
        disabled={!pdfSlick || scale <= 0.25}
        className="group tb-button"
        onClick={() => pdfSlick?.viewer?.decreaseScale()}
      >
        <DashIcon className="h-4 w-4 fill-current" />
      </button>

      <Menu as="div" className="text-xs relative hidden sm:block">
        <Menu.Button
          disabled={!pdfSlick}
          className="text-left w-32 bg-bg1 py-1 rounded-sm focus:shadow outline-none border border-transparent"
        >
          <span className="sr-only">Open zoom options</span>
          <div className="flex px-1">
            <span
              className={`flex-1 px-1 ${
                pdfSlick ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {scaleValue && presets.has(scaleValue)
                ? presets.get(scaleValue)
                : `${~~(scale * 100)}%`}
            </span>

            <div className="w-4 h-4">
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 left-0 z-30 mt-2 w-full origin-top-right divide-y divide-bg2 rounded text-left bg-bg1 shadow-lg">
            <div className="py-1">
              {Array.from(presets.entries()).map(([value, label]) => (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      onClick={() => (pdfSlick!.currentScaleValue = value)}
                      className={`block w-full box-border text-left px-2 py-1.5 text-xs ${
                        active ? 'bg-bg2 text-fg0' : 'text-fg3'
                      }`}
                    >
                      {label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>

            <div className="py-1">
              {Array.from(zoomVals.entries()).map(([value, label]) => (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      onClick={() => (pdfSlick!.currentScale = value)}
                      className={`block w-full box-border text-left px-2 py-1.5 text-xs ${
                        active ? 'bg-bg2 text-fg0' : 'text-fg3'
                      }`}
                    >
                      {label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <button
        disabled={!pdfSlick || scale >= 5}
        className="group tb-button"
        onClick={() => pdfSlick?.viewer?.increaseScale()}
      >
        <PlusIcon className="h-4 w-4 fill-current" />
      </button>
    </div>
  )
}

export default ZoomSelector
