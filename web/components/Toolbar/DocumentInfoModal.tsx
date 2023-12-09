import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Store } from '../types'

function formatBytes(bytes: number, decimals: number) {
  if (bytes == 0) return '0 Bytes'
  var k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const Entry = ({ title, text, altText = 'N/A' }) => {
  return (
    <div className="grid grid-cols-3 gap-4 px-6 py-1 my-0.5">
      <dt className="text-sm font-medium text-fg2">{title}</dt>
      <dd className="text-sm text-fg1 col-span-2">
        {text ? text : <span className="text-xs text-fg2">{altText}</span>}
      </dd>
    </div>
  )
}

export default function DocumentInfoModal({
  usePDFSlickStore,
  isOpen,
  closeModal,
}: Store<{
  isOpen: boolean
  closeModal: () => void
}>) {
  const filename = usePDFSlickStore((s) => s.filename)
  const filesize = usePDFSlickStore((s) => s.filesize)
  const title = usePDFSlickStore((s) => s.title)
  const subject = usePDFSlickStore((s) => s.subject)
  const creator = usePDFSlickStore((s) => s.creator)
  const keywords = usePDFSlickStore((s) => s.keywords)
  const creationDate = usePDFSlickStore((s) => s.creationDate)
  const modificationDate = usePDFSlickStore((s) => s.modificationDate)
  const author = usePDFSlickStore((s) => s.author)
  const producer = usePDFSlickStore((s) => s.producer)
  const version = usePDFSlickStore((s) => s.version)
  const numPages = usePDFSlickStore((s) => s.numPages)
  const pageSize = usePDFSlickStore((s) => s.pageSize)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-10" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-sm border border-bg2 bg-bg1 py-6 text-left align-middle shadow-sm transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-fg1 px-6 pb-4"
                >
                  Document Properties
                </Dialog.Title>
                <dl className="">
                  <Entry title="File name" text={filename} />
                  <Entry
                    title="File size"
                    text={filesize ? formatBytes(filesize, 2) : undefined}
                  />
                  <Entry title="Title" text={title} />
                  <Entry title="Author" text={author} />
                  <Entry title="Subject" text={subject} />
                  <Entry title="Keywords" text={keywords} />
                  <Entry
                    title="Creation date"
                    text={
                      creationDate
                        ? new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'long',
                            timeStyle: 'medium',
                          }).format(creationDate)
                        : undefined
                    }
                  />
                  <Entry
                    title="Modification date"
                    text={
                      modificationDate
                        ? new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'long',
                            timeStyle: 'medium',
                          }).format(creationDate)
                        : undefined
                    }
                  />

                  <Entry title="Creator" text={creator} />
                  <Entry title="PDF producer" text={producer} />
                  <Entry title="PDF version" text={version} />
                  <Entry title="Page count" text={numPages} />
                  <Entry
                    title="Page size"
                    text={
                      pageSize ? (
                        <>
                          {pageSize.width} x {pageSize.height} {pageSize.unit} (
                          {pageSize.name ? pageSize.name + ', ' : ''}
                          {pageSize.orientation})
                        </>
                      ) : undefined
                    }
                  />
                </dl>
                <div className="mt-4 px-6 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded border border-transparent bg-bg0 px-4 py-2 text-sm font-medium text-fg1 hover:shadow-md"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
