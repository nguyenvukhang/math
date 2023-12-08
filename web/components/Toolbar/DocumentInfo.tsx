import { useState } from 'react'
import type { TUsePDFSlickStore } from '@pdfslick/react'
import DocumentInfoModal from './DocumentInfoModal'
import Tooltip from '../Tooltip'
import { InfoIcon } from '@primer/octicons-react'

type DocumentInfoProps = {
  usePDFSlickStore: TUsePDFSlickStore
}

export default function DocumentInfo({ usePDFSlickStore }: DocumentInfoProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <button
        className="flex justify-center enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
        onClick={openModal}
      >
        <InfoIcon className="w-4 h-4" />
        <Tooltip position="bottom" alignX="right">
          <p className="whitespace-nowrap">Document Properties</p>
        </Tooltip>
      </button>

      <DocumentInfoModal {...{ usePDFSlickStore, isOpen, closeModal }} />
    </>
  )
}
