import type { Metadata, Viewport } from 'next';
import '@/index.css';

const DESCRIPTION =
  'Portfolio of Janne Keipert, a Software Developer. Browse my open-source projects, GitHub contribution history, and the technologies I work with every day.';

export const metadata: Metadata = {
  metadataBase: new URL('https://jannekeipert.de'),
  title: 'Janne Keipert - Software Developer',
  description: DESCRIPTION,
  authors: [{ name: 'Janne Keipert' }],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: 'https://jannekeipert.de',
    title: 'Janne Keipert - Software Developer',
    description: DESCRIPTION,
    locale: 'en_US',
    siteName: 'Janne Keipert',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Janne Keipert - Software Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Janne Keipert - Software Developer',
    description: DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        alt: 'Janne Keipert - Software Developer',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://jannekeipert.de/#person',
      name: 'Janne Keipert',
      jobTitle: 'Software Developer',
      url: 'https://jannekeipert.de',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://jannekeipert.de/#website',
      url: 'https://jannekeipert.de',
      name: 'Janne Keipert',
      description: DESCRIPTION,
      author: { '@id': 'https://jannekeipert.de/#person' },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://project-manager.jannekeipert.de"
          crossOrigin=""
        />
        <link
          rel="dns-prefetch"
          href="https://project-manager.jannekeipert.de"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
