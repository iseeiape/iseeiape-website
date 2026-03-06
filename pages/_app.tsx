import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import '../styles/globals.css'

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-GSGMFPHPWW'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Global Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="theme-color" content="#000000" />
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="T8iO7AdN5z_luWy-Xn3QQRa9mz3u2JPZtLrTSYm5_YM" />
        
        {/* Default Open Graph */}
        <meta property="og:site_name" content="iseeiape" />
        <meta property="og:locale" content="en_US" />
        
        {/* Default Twitter */}
        <meta name="twitter:site" content="@iseeiape" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-') && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}} />
        </>
      )}
      <Component {...pageProps} />
    </>
  )
}
