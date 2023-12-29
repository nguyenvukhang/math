import { useEffect, useState } from 'react'
import { usePDFSlick } from '@pdfslick/react'
import Toolbar from './Toolbar'
import Thumbsbar from './Thumbsbar'

export default function PDFViewerApp({ pdfFilePath }) {
  const [isThumbsbarOpen, setIsThumbsbarOpen] = useState(false)
  const { isDocumentLoaded, viewerRef, usePDFSlickStore, PDFSlickViewer } =
    usePDFSlick(pdfFilePath)

  useEffect(() => {
    if (isDocumentLoaded) setIsThumbsbarOpen(true)
  }, [isDocumentLoaded])

  return (
    <div className="absolute inset-0 bg-bg1 flex flex-col pdfSlick">
      <Toolbar
        usePDFSlickStore={usePDFSlickStore}
        setIsThumbsbarOpen={setIsThumbsbarOpen}
        isThumbsbarOpen={isThumbsbarOpen}
      />
      <div className="flex-1 flex">
        <Thumbsbar
          usePDFSlickStore={usePDFSlickStore}
          isThumbsbarOpen={isThumbsbarOpen}
        />
        <div className="flex-1 relative h-full">
          <PDFSlickViewer
            viewerRef={viewerRef}
            usePDFSlickStore={usePDFSlickStore}
          />
        </div>
      </div>
    </div>
  )
}
