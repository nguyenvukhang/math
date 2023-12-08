import { FC } from 'react'
import clsx from 'clsx'
import { PDFSlick } from '@pdfslick/react'
import type { TPDFDocumentOutline, TUsePDFSlickStore } from '@pdfslick/react'
import { DotFillIcon, TriangleRightIcon } from '@primer/octicons-react'

type OutlineProps = {
  usePDFSlickStore: TUsePDFSlickStore
  show: boolean
}

const renderOutlineItems: FC<{
  outline: TPDFDocumentOutline | null
  pdfSlick: PDFSlick | null
  level?: number
}> = ({ outline, pdfSlick, level = 0 }) => {
  return (
    <ul className="w-full text-xs">
      {(outline ?? []).map((item, ix) => (
        <li key={`${item.title}-${ix}`} className="relative p-1 py-px">
          <input
            id={`${item.title}-${ix}`}
            type="checkbox"
            defaultChecked={false}
            className="peer absolute -top-[10000px] -left-[10000px]"
          />
          <div className="flex items-center flex-row peer-checked:[&>label]:rotate-90">
            {item.items?.length > 0 ? (
              <label
                htmlFor={`${item.title}-${ix}`}
                className="flex justify-center items-center cursor-pointer hover:text-slate-900 rounded hover:bg-slate-200 w-4 h-4"
              >
                <TriangleRightIcon className="w-4 h-4" />
              </label>
            ) : (
              <div className="flex justify-center items-center w-4 h-4">
                <DotFillIcon className="w-2 h-2 fill-gray-400" />
              </div>
            )}
            <button
              className="truncate flex-1 rounded text-left hover:text-slate-900 p-[1px] hover:bg-slate-200"
              onClick={() => {
                // TODO: the ability to navigate back across links starts here
                pdfSlick?.linkService?.goToDestination(item.dest)
              }}
            >
              {item.title}
            </button>
          </div>
          <div className="hidden peer-checked:block pl-1">
            {item.items?.length > 0 &&
              renderOutlineItems({
                outline: item.items,
                pdfSlick,
                level: level + 1,
              })}
          </div>
        </li>
      ))}
    </ul>
  )
}

const Outline = ({ usePDFSlickStore, show }: OutlineProps) => {
  const documentOutline = usePDFSlickStore((s) => s.documentOutline)
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick)

  return (
    <div
      className={clsx('overflow-auto absolute inset-0', { invisible: !show })}
    >
      <div className="p-2 pl-0.5 text-slate-700 text-sm">
        {renderOutlineItems({ outline: documentOutline, pdfSlick })}
      </div>
    </div>
  )
}

export default Outline
