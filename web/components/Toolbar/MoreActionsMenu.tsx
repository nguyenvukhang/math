import {
  ChangeEvent,
  Fragment,
  MutableRefObject,
  useRef,
  useState,
} from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ScrollMode } from '@pdfslick/react'
import type { TUsePDFSlickStore } from '@pdfslick/react'
import { shallow } from 'zustand/shallow'
import clsx from 'clsx'
import DocumentInfoModal from './DocumentInfoModal'
import {
  ArrowBothIcon,
  CheckIcon,
  ContainerIcon,
  DownloadIcon,
  FileIcon,
  InfoIcon,
  KebabHorizontalIcon,
  MoveToBottomIcon,
  MoveToTopIcon,
} from '@primer/octicons-react'

type MoreActionsMenuProps = {
  usePDFSlickStore: TUsePDFSlickStore
}

const MoreActionsMenu = ({ usePDFSlickStore }: MoreActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const openPdfFileRef = useRef() as MutableRefObject<HTMLInputElement>

  const { pdfSlick, pageNumber, numPages, scrollMode } = usePDFSlickStore(
    (s) => ({
      pdfSlick: s.pdfSlick,
      pageNumber: s.pageNumber,
      numPages: s.numPages,
      scrollMode: s.scrollMode,
      spreadMode: s.spreadMode,
    }),
    shallow,
  )

  function handleOpenPdfFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      pdfSlick?.loadDocument(url, { filename: file.name })
    }
  }

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <div className="absolute overflow-hidden w-0 h-0">
        <input
          id="openPdfFileAction"
          ref={openPdfFileRef}
          tabIndex={-1}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleOpenPdfFile}
          className="absolute -top-[10000px]"
        />
      </div>
      <Menu as="span" className="pr-0.5">
        <Menu.Button
          disabled={!pdfSlick}
          className="flex justify-center enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
        >
          <span className="sr-only">Open more actions menu</span>
          <KebabHorizontalIcon className="w-3 h-3 rotate-90" />
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
          <Menu.Items className="absolute right-2 w-52 z-30 mt-2 origin-top-right divide-y divide-slate-200 rounded text-left bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      if (pdfSlick) pdfSlick.filename = 'minimath.pdf'
                      pdfSlick?.downloadOrSave()
                    }}
                    className={clsx(
                      'w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50',
                      {
                        'bg-slate-100 text-gray-900': active,
                        'text-gray-700': !active,
                      },
                    )}
                  >
                    <DownloadIcon className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.triggerPrinting()}
                    className={clsx(
                      'w-full items-center flex space-x-1.5 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50',
                      {
                        'bg-slate-100 text-gray-900': active,
                        'text-gray-700': !active,
                      },
                    )}
                  >
                    <ContainerIcon className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    disabled={pageNumber === 1}
                    onClick={() => pdfSlick?.gotoPage(1)}
                    className={clsx(
                      'w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50',
                      {
                        'bg-slate-100 text-gray-900': active,
                        'text-gray-700': !active,
                      },
                    )}
                  >
                    <MoveToTopIcon className="w-3.5 h-3.5" />
                    <span>Go to First Page</span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    disabled={pageNumber === numPages}
                    onClick={() => pdfSlick?.gotoPage(numPages)}
                    className={clsx(
                      'w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50',
                      {
                        'bg-slate-100 text-gray-900': active,
                        'text-gray-700': !active,
                      },
                    )}
                  >
                    <MoveToBottomIcon className="w-3.5 h-3.5" />
                    <span>Go to Last Page</span>
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.setScrollMode(ScrollMode.PAGE)}
                    className={clsx(
                      'w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50',
                      {
                        'bg-slate-100 text-gray-900': active,
                        'text-gray-700': !active,
                      },
                    )}
                  >
                    <FileIcon className="w-3.5 h-3.5" />
                    <span className="flex-1">Page Scrolling</span>
                    {scrollMode === ScrollMode.PAGE && (
                      <CheckIcon className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.setScrollMode(ScrollMode.VERTICAL)}
                    className={clsx(
                      'w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50',
                      {
                        'bg-slate-100 text-gray-900': active,
                        'text-gray-700': !active,
                      },
                    )}
                  >
                    <ArrowBothIcon className="w-3.5 h-3.5 rotate-90" />
                    <span className="flex-1">Vertical Scrolling</span>
                    {scrollMode === ScrollMode.VERTICAL && (
                      <CheckIcon className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() =>
                      pdfSlick?.setScrollMode(ScrollMode.HORIZONTAL)
                    }
                    className={clsx(
                      'w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50',
                      {
                        'bg-slate-100 text-gray-900': active,
                        'text-gray-700': !active,
                      },
                    )}
                  >
                    <ArrowBothIcon className="w-3.5 h-3.5" />
                    <span className="flex-1">Horizontal Scrolling</span>
                    {scrollMode === ScrollMode.HORIZONTAL && (
                      <CheckIcon className="w-3" />
                    )}
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    disabled={pageNumber === numPages}
                    onClick={openModal}
                    className={clsx(
                      'w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50',
                      {
                        'bg-slate-100 text-gray-900': active,
                        'text-gray-700': !active,
                      },
                    )}
                  >
                    <InfoIcon className="w-3.5 h-3.5" />
                    <span>Document Properties...</span>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <DocumentInfoModal {...{ usePDFSlickStore, isOpen, closeModal }} />
    </>
  )
}

export default MoreActionsMenu
