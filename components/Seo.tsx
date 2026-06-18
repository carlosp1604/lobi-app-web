import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonicalUrl: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
  noIndex?: boolean
  jsonLd?: Record<string, unknown>
}

export const Seo = ({
  title,
  description,
  canonicalUrl,
  ogImage = process.env.NEXT_PUBLIC_APP_IMAGE_URL,
  ogType = 'website',
  noIndex = false,
  jsonLd,
}: SEOProps) => {
  const siteName = process.env.NEXT_PUBLIC_APP_NAME
  const fullTitle = `${title} | ${siteName}`

  const formatUrl = (url: string) => (url.endsWith('/') ? url : `${url}/`)
  const formattedCanonical = formatUrl(canonicalUrl)

  return (
    <Head>
      <title>{ fullTitle }</title>
      <meta name="description" content={ description } />

      { noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      ) }

      <link rel="canonical" href={ formattedCanonical } />

      <meta property="og:title" content={ fullTitle } />
      <meta property="og:description" content={ description } />
      <meta property="og:url" content={ formattedCanonical } />
      <meta property="og:type" content={ ogType } />
      <meta property="og:image" content={ ogImage } />
      <meta property="og:site_name" content={ siteName } />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ fullTitle } />
      <meta name="twitter:description" content={ description } />
      <meta name="twitter:image" content={ ogImage } />

      { jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={ { __html: JSON.stringify(jsonLd) } }
        />
      ) }
    </Head>
  )
}
