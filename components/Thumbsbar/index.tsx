import { MutableRefObject, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import Outline from './Outline'
import { Store } from '../types'

export default function Thumbsbar({
  usePDFSlickStore,
  isThumbsbarOpen,
}: Store<{ isThumbsbarOpen: boolean }>) {
  const containerRef = useRef() as MutableRefObject<HTMLDivElement>
  const resizerRef = useRef() as MutableRefObject<HTMLDivElement>
  const [isResizing, setIsResizing] = useState(false)
  const [width, setWidth] = useState(233)

  useEffect(() => {
    let newWidth = 0
    const dragResize = drag<HTMLDivElement, unknown>()
      .on('start', () => {
        newWidth = containerRef.current.clientWidth
        setIsResizing(true)
      })
      .on('drag', (e) => {
        newWidth += e.dx
        const width = Math.min(620, Math.max(233, newWidth))
        setWidth(width)
      })
      .on('end', () => setIsResizing(false))
    select(resizerRef.current).call(dragResize)
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className={clsx(
          'h-full flex relative border-r border-bg0 shadow-sm z-10',
          {
            visible: isThumbsbarOpen,
            'invisible border-r-0 overflow-hidden': !isThumbsbarOpen,
            'transition-all': !isResizing,
          },
        )}
        style={{
          width: `${isThumbsbarOpen ? width : 0}px`,
        }}
      >
        <div
          className={clsx('flex-1 relative', {
            'translate-x-0 visible opacity-100': isThumbsbarOpen,
            'transition-[visibility,opacity] delay-150 duration-300 ease-out':
              isThumbsbarOpen,
            '-translate-x-full invisible opacity-0': !isThumbsbarOpen,
          })}
        >
          <Outline show usePDFSlickStore={usePDFSlickStore} />
        </div>
      </div>
      <div ref={resizerRef} className="hover:cursor-col-resize relative w-0">
        {isThumbsbarOpen && (
          <div
            className={clsx(
              'absolute -left-px top-0 h-full z-10 w-1 transition-all duration-150 ease-in hover:delay-150 hover:duration-150',
              {
                'bg-blue-400': isResizing,
                'bg-transparent hover:bg-blue-400': !isResizing,
              },
            )}
          />
        )}
      </div>
    </>
  )
}
