import type { TUsePDFSlickStore } from '@pdfslick/react'

export type Store<T = {}> = {
  usePDFSlickStore: TUsePDFSlickStore
} & T
