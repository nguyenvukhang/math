import Script from 'next/script'
import '../styles.css'
import '@pdfslick/react/dist/pdf_viewer.css'

const GOOGLE_ANALYTICS_JS = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YLMYNMR5FM');
`

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-YLMYNMR5FM" />
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: GOOGLE_ANALYTICS_JS,
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
