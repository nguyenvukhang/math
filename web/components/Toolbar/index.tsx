import {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
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
  const pageNumberRef = useRef() as MutableRefObject<HTMLInputElement>

  const numPages = usePDFSlickStore((s) => s.numPages)
  const pageNumber = usePDFSlickStore((s) => s.pageNumber)
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick)

  const [wantedPageNumber, setWantedPageNumber] = useState<number | string>(1)

  useEffect(() => setWantedPageNumber(pageNumber), [pageNumber])

  return (
    <>
      <div
        className={`w-full h-9 flex items-center justify-between bg-slate-50 border-b border-b-slate-300 shadow-sm text-xs select-none sticky top-0 bg-opacity-100 backdrop-blur z-10`}
      >
        <div className="px-1 flex items-center space-x-1">
          <button
            className={`enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent`}
            onClick={() => setIsThumbsbarOpen(!isThumbsbarOpen)}
          >
            {isThumbsbarOpen ? (
              <SidebarExpandIcon className="h-4 w-4" />
            ) : (
              <SidebarCollapseIcon className="h-4 w-4" />
            )}
          </button>

          <Splitter />

          <ZoomSelector {...{ usePDFSlickStore }} />

          <Splitter />

          <button
            disabled={pageNumber <= 1}
            className="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
            onClick={() => pdfSlick?.viewer?.previousPage()}
          >
            <ChevronUpIcon className="h-4 w-4" />
          </button>

          <button
            disabled={!pdfSlick || pageNumber >= numPages}
            className="enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
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
                className="block w-12 text-right rounded-sm border border-slate-300 focus:shadow focus:border-blue-400 focus:ring-0 outline-none text-xs p-1 px-1.5 placeholder:text-gray-300 focus:placeholder:text-gray-400 placeholder:italic"
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

        <div className="text-gray-700">minimath</div>

        <div className="px-1 space-x-1 flex items-center justify-end">
          <FreetextMenu usePDFSlickStore={usePDFSlickStore} />
          <InkMenu usePDFSlickStore={usePDFSlickStore} />
          <Splitter />
          <button
            className={clsx(
              'flex justify-center enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent',
            )}
            onClick={() =>
              window.open('https://github.com/nguyenvukhang/math', '_blank')
            }
          >
            <MarkGithubIcon className="w-4 h-4" />
            <Tooltip position="bottom">
              <p className="whitespace-nowrap">Source</p>
            </Tooltip>
          </button>
          <DocumentInfo usePDFSlickStore={usePDFSlickStore} />
          <Splitter />
          <MoreActionsMenu usePDFSlickStore={usePDFSlickStore} />
        </div>
      </div>
    </>
  )
}

export default Toolbar
