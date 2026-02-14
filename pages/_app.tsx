import type { AppProps } from 'next/app'
import Script from 'next/script'
import '../styles/globals.css'

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-GSGMFPHPWW'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-') && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}</Script>
        </>
      )}
      <Component {...pageProps} />
    </>
  )
}
