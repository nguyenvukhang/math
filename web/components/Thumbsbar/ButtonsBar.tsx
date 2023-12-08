import clsx from 'clsx'
import Tooltip from '../Tooltip'
import type { TUsePDFSlickStore } from '@pdfslick/react'
import { QuoteIcon, VersionsIcon } from '@primer/octicons-react'

type ButtonsBarProps = {
  usePDFSlickStore: TUsePDFSlickStore
  isThumbsbarOpen: boolean
  tab: 'thumbnails' | 'outline'
  setTab: (s: 'thumbnails' | 'outline') => void
}

const ButtonsBar = ({
  usePDFSlickStore,
  isThumbsbarOpen,
  tab,
  setTab,
}: ButtonsBarProps) => {
  const documentOutline = usePDFSlickStore((s) => s.documentOutline)

  return (
    <div
      className={clsx(
        'bg-slate-100/70 z-10 flex flex-col p-1 py-2 space-y-2 items-center border-r border-r-slate-300 shadow-sm transition-all [box-shadow:1px_0_2px_0_rgb(0_0_0_/_0.05)]',
        {
          'translate-x-0 visible opacity-100': isThumbsbarOpen,
          '-translate-x-full invisible opacity-0': !isThumbsbarOpen,
        },
      )}
    >
      <button
        className={clsx(
          'enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent group',
          'flex flex-row',
          {
            'enabled:bg-blue-100 enabled:text-black border-blue-200':
              tab === 'thumbnails',
          },
        )}
        onClick={() => setTab('thumbnails')}
      >
        <VersionsIcon className="h-4 w-4" />
        <Tooltip>
          <p className="whitespace-nowrap">Page Thumbnails</p>
        </Tooltip>
      </button>
      <button
        disabled={!documentOutline}
        className={clsx(
          'enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent',
          'flex flex-row',
          {
            'enabled:bg-blue-100 enabled:text-black border-blue-200':
              tab === 'outline',
          },
        )}
        onClick={() => setTab('outline')}
      >
        <QuoteIcon className="h-4 w-4" />
        <Tooltip>
          <p className="whitespace-nowrap">Document Outline</p>
        </Tooltip>
      </button>
    </div>
  )
}

export default ButtonsBar
