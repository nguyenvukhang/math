import clsx from 'clsx'
import { PDFSlick } from '@pdfslick/react'
import type { TPDFDocumentOutline } from '@pdfslick/react'
import { DotFillIcon, TriangleRightIcon } from '@primer/octicons-react'
import { Store } from '../types'

const OutlineItems = (p: {
  outline: TPDFDocumentOutline | null
  pdfSlick: PDFSlick | null
  level?: number
}) => {
  const { outline, pdfSlick, level } = p
  return (
    <ul className="w-full text-xs">
      {(outline ?? []).map((item, ix) => (
        <li key={`${item.title}-${ix}`} className="relative p-1 py-px">
          <input
            id={`${item.title}-${ix}`}
            type="checkbox"
            defaultChecked={false}
            className="peer hidden"
          />
          <div className="flex items-center flex-row peer-checked:[&>label]:rotate-90">
            {item.items?.length > 0 ? (
              <label
                htmlFor={`${item.title}-${ix}`}
                className="flex justify-center items-center cursor-pointer rounded hover:bg-bg1 w-4 h-4"
              >
                <TriangleRightIcon className="w-4 h-4" />
              </label>
            ) : (
              <div className="flex justify-center items-center w-4 h-4">
                <DotFillIcon className="w-2 h-2 fill-gray-400" />
              </div>
            )}
            <button
              className="pl-1 truncate flex-1 rounded text-left p-[1px] hover:bg-bg1"
              onClick={() => {
                // TODO: the ability to navigate back across links starts here
                pdfSlick?.linkService?.goToDestination(item.dest)
              }}
            >
              {item.title}
            </button>
          </div>
          <div className="hidden peer-checked:block pl-1">
            {item.items?.length === 0 ? null : (
              <OutlineItems
                outline={item.items}
                pdfSlick={pdfSlick}
                level={level + 1}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

const Outline = ({ usePDFSlickStore, show }: Store<{ show: boolean }>) => {
  const documentOutline = usePDFSlickStore((s) => s.documentOutline)
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick)

  return (
    <div
      className={clsx('bg-bg2 overflow-auto absolute inset-0', { invisible: !show })}
    >
      <div className="p-2 pl-0.5 text-fg0 text-sm">
        <OutlineItems outline={documentOutline} pdfSlick={pdfSlick} />
      </div>
    </div>
  )
}

export default Outline
