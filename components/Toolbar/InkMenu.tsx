import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { AnnotationEditorType, AnnotationEditorParamsType } from 'pdfjs-dist'
import { ChevronDownIcon, PencilIcon } from '@primer/octicons-react'
import { ColorPicker } from '../ColorPicker'
import { Store } from '../types'
import clsx from 'clsx'

const InkMenu = ({ usePDFSlickStore }: Store) => {
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick)
  const annotationEditorMode = usePDFSlickStore((s) => s.annotationEditorMode)
  const isInkMode = annotationEditorMode === AnnotationEditorType.INK

  return (
    <div className="flex items-center rounded-sm outline outline-1 outline-bg1/50">
      <button
        className={clsx('group tb-button', { 'bg-bg1': isInkMode })}
        onClick={() => {
          const mode = isInkMode
            ? AnnotationEditorType.NONE
            : AnnotationEditorType.INK
          pdfSlick?.setAnnotationEditorMode(mode)
        }}
      >
        <PencilIcon className="w-4 h-4" />
      </button>

      <Menu as="div" className="text-xs relative">
        <Menu.Button disabled={!pdfSlick} className="h-6 w-4 hover:bg-bg1">
          <ChevronDownIcon className="w-3 h-3" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-30 mt-1 origin-top-right rounded-sm text-left divide-y divide-bg2 shadow-lg">
            <ColorPicker
              usePDFSlickStore={usePDFSlickStore}
              editorType={AnnotationEditorType.INK}
              targetParam={AnnotationEditorParamsType.INK_COLOR}
            />
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default InkMenu
