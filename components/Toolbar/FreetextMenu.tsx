import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { AnnotationEditorType, AnnotationEditorParamsType } from 'pdfjs-dist'
import { ChevronDownIcon, TypographyIcon } from '@primer/octicons-react'
import { ColorPicker } from '../ColorPicker'
import { Store } from '../types'
import clsx from 'clsx'

const FreetextMenu = ({ usePDFSlickStore }: Store) => {
  const annotationEditorMode = usePDFSlickStore((s) => s.annotationEditorMode)
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick)
  const isFreetextMode = annotationEditorMode === AnnotationEditorType.FREETEXT

  return (
    <div className="flex items-center rounded-sm outline outline-1 outline-bg1/50">
      <button
        className={clsx('group tb-button', { 'bg-bg1': isFreetextMode })}
        onClick={() => {
          const mode = isFreetextMode
            ? AnnotationEditorType.NONE
            : AnnotationEditorType.FREETEXT
          pdfSlick?.setAnnotationEditorMode(mode)
        }}
      >
        <TypographyIcon className="w-4 h-4" />
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
              editorType={AnnotationEditorType.FREETEXT}
              targetParam={AnnotationEditorParamsType.FREETEXT_COLOR}
            />
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default FreetextMenu
