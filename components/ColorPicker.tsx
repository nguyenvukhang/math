import { colorNames, colorStrengths } from './colors'
import colors from 'tailwindcss/colors'
import { Store } from './types'

type Props = Store<{
  editorType: number
  targetParam: number
}>

export const ColorPicker = (p: Props) => {
  const pdfSlick = p.usePDFSlickStore((s) => s.pdfSlick)
  return (
    <div className="flex flex-col space-y-0.5 p-2 bg-bg1 border border-bg0 shadow-sm rounded">
      {colorStrengths.map((s) => (
        <div className="flex space-x-0.5" key={s}>
          {colorNames.map((name) => (
            <button
              key={`${name}-${s}`}
              className="p-2 rounded-full border border-bg1 hover:border-bg0 hover:shadow-sm"
              style={{ backgroundColor: colors[name][s] }}
              onClick={() => {
                pdfSlick?.setAnnotationEditorMode(p.editorType)
                pdfSlick?.setAnnotationEditorParams([
                  { type: p.targetParam, value: colors[name][s] },
                ])
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
