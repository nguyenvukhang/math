import dynamic from 'next/dynamic'

const PDFViewerApp = dynamic(() => import('../components/PDFViewerApp'), {
  loading: () => <div>loading...</div>,
  ssr: false,
})
const USE_LOCAL = true

export default function Home() {
  return <PDFViewerApp pdfFilePath={USE_LOCAL ? '/minimath.pdf' : '/api/pdf'} />
}
