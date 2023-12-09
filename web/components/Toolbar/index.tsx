import { useEffect, useRef, useState } from 'react'
import type { TUsePDFSlickStore } from '@pdfslick/react'
import ZoomSelector from './ZoomSelector'
import InkMenu from './InkMenu'
import FreetextMenu from './FreetextMenu'
import DocumentInfo from './DocumentInfo'
import MoreActionsMenu from './MoreActionsMenu'
import Splitter from './Splitter'
import Tooltip from '../Tooltip'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MarkGithubIcon,
  SidebarCollapseIcon,
  SidebarExpandIcon,
} from '@primer/octicons-react'

type TToolbarProps = {
  usePDFSlickStore: TUsePDFSlickStore
  isThumbsbarOpen: boolean
  setIsThumbsbarOpen: (s: boolean) => void
}

const Toolbar = ({
  usePDFSlickStore,
  isThumbsbarOpen,
  setIsThumbsbarOpen,
}: TToolbarProps) => {
  const pageNumberRef = useRef<HTMLInputElement>()
  const numPages = usePDFSlickStore((s) => s.numPages)
  const pageNumber = usePDFSlickStore((s) => s.pageNumber)
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick)

  const [wantedPageNumber, setWantedPageNumber] = useState<number | string>(1)

  useEffect(() => setWantedPageNumber(pageNumber), [pageNumber])

  return (
    <div className="h-9 flex items-center justify-between bg-bg2 border-b border-b-bg0 shadow-sm text-xs text-fg0 select-none z-20">
      <div className="px-1 flex items-center space-x-1">
        <button
          className="hover:bg-bg1 p-1 rounded-sm group relative"
          onClick={() => setIsThumbsbarOpen(!isThumbsbarOpen)}
        >
          {isThumbsbarOpen ? (
            <SidebarExpandIcon className="h-4 w-4" />
          ) : (
            <SidebarCollapseIcon className="h-4 w-4" />
          )}
        </button>

        <Splitter />

        <ZoomSelector usePDFSlickStore={usePDFSlickStore} />

        <Splitter />

        <button
          disabled={pageNumber <= 1}
          className="group tb-button"
          onClick={() => pdfSlick?.viewer?.previousPage()}
        >
          <ChevronUpIcon className="h-4 w-4" />
        </button>

        <button
          disabled={!pdfSlick || pageNumber >= numPages}
          className="group tb-button"
          onClick={() => pdfSlick?.viewer?.nextPage()}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </button>

        <div className="hidden sm:flex items-center text-center space-x-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const newPageNumber = parseInt(wantedPageNumber + '')
              if (
                Number.isInteger(newPageNumber) &&
                newPageNumber > 0 &&
                newPageNumber <= numPages
              ) {
                pdfSlick?.linkService.goToPage(newPageNumber)
              } else {
                setWantedPageNumber(pageNumber)
              }
            }}
          >
            <input
              ref={pageNumberRef}
              type="text"
              value={wantedPageNumber}
              className="block w-12 text-right rounded-sm border bg-bg1 border-bg1 focus:shadow outline-none text-xs p-1 px-1.5"
              onFocus={() => pageNumberRef.current.select()}
              onChange={(e) => setWantedPageNumber(e.currentTarget.value)}
              onKeyDown={(e) => {
                switch (e.key) {
                  case 'Down': // IE/Edge specific value
                  case 'ArrowDown':
                    pdfSlick?.linkService.goToPage(
                      Math.max(1, (pageNumber ?? 0) - 1),
                    )
                    break
                  case 'Up': // IE/Edge specific value
                  case 'ArrowUp':
                    pdfSlick?.linkService.goToPage(
                      Math.min(numPages ?? 0, (pageNumber ?? 0) + 1),
                    )
                    break
                  default:
                    return
                }
              }}
            />
          </form>
          <span> of {numPages}</span>
        </div>
      </div>

      <div className="text-fg0">minimath</div>

      <div className="px-1 space-x-1 flex items-center justify-end">
        <FreetextMenu usePDFSlickStore={usePDFSlickStore} />
        <InkMenu usePDFSlickStore={usePDFSlickStore} />
        <Splitter />
        <button
          className="group tb-button"
          onClick={() =>
            window.open('https://github.com/nguyenvukhang/math', '_blank')
          }
        >
          <MarkGithubIcon className="w-4 h-4" />
          <Tooltip position="bottom">Source</Tooltip>
        </button>
        <DocumentInfo usePDFSlickStore={usePDFSlickStore} />
        <Splitter />
        <MoreActionsMenu usePDFSlickStore={usePDFSlickStore} />
      </div>
    </div>
  )
}

export default Toolbar
