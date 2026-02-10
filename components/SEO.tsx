import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export default function SEO({
  title = 'iseeiape - Smart Money Intelligence',
  description = 'Track whale wallets on Solana and Base. Real-time smart money intelligence, case studies, and trading insights.',
  keywords = 'crypto, solana, base, smart money, whale tracking, trading, defi, nft, meme coins',
  image = 'https://iseeiape.com/og-image.png',
  url = 'https://iseeiape.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Dan (Lizard King)'
}: SEOProps) {
  const fullTitle = title.includes('iseeiape') ? title : `${title} - iseeiape`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="iseeiape" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@iseeicode" />
      <meta name="twitter:creator" content="@iseeicode" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "iseeiape",
            "url": "https://iseeiape.com",
            "description": description,
            "publisher": {
              "@type": "Organization",
              "name": "iseeiape",
              "logo": {
                "@type": "ImageObject",
                "url": "https://iseeiape.com/logo.png"
              }
            }
          })
        }}
      />
    </Head>
  );
}