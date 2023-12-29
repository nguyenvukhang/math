import { Fragment, useState } from 'react'
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
  MoveToBottomIcon,
  MoveToTopIcon,
  ThreeBarsIcon,
} from '@primer/octicons-react'

type MoreActionsMenuProps = {
  usePDFSlickStore: TUsePDFSlickStore
}

const MoreActionsMenu = ({ usePDFSlickStore }: MoreActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

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

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  const CSS =
    'text-fg1 w-full items-center flex space-x-2 box-border text-left px-2 py-1.5 text-xs disabled:opacity-50'

  return (
    <>
      <Menu as="span">
        <Menu.Button disabled={!pdfSlick} className="group tb-button">
          <span className="sr-only">Open more actions menu</span>
          <ThreeBarsIcon className="w-4 h-4" />
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
          <Menu.Items className="absolute right-2 w-52 z-30 mt-2 origin-top-right divide-y divide-bg2 rounded text-left bg-bg1 shadow-sm border border-bg0">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => pdfSlick?.downloadOrSave()}
                    className={clsx(CSS, { 'bg-bg0': active })}
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
                    className={clsx(CSS, { 'bg-bg0': active })}
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
                    className={clsx(CSS, { 'bg-bg0': active })}
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
                    className={clsx(CSS, { 'bg-bg0': active })}
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
                    className={clsx(CSS, { 'bg-bg0': active })}
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
                    className={clsx(CSS, { 'bg-bg0': active })}
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
                    className={clsx(CSS, { 'bg-bg0': active })}
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
                    className={clsx(CSS, { 'bg-bg0': active })}
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
