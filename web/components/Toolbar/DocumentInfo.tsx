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

  return (
    <>
      <button className="group tb-button" onClick={() => setIsOpen(true)}>
        <InfoIcon className="w-4 h-4" />
        <Tooltip position="bottom" alignX="right">
          Document Properties
        </Tooltip>
      </button>

      <DocumentInfoModal
        usePDFSlickStore={usePDFSlickStore}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
    </>
  )
}
