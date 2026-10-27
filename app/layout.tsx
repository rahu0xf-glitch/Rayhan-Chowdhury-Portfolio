import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const appUrl = process.env.APP_URL || 'https://rayhanchowdhury.portfolio.local';

export const viewport: Viewport = {
  themeColor: '#d80006',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Rayhan Chowdhury — Multidisciplinary Technology Portfolio',
  description:
    'Explore the personal portfolio of Rayhan Chowdhury across Cybersecurity, AI, Software Engineering, Data Science, and Creative Media.',
  keywords: [
    'Rayhan Chowdhury',
    'Technology Portfolio',
    'Cybersecurity',
    'Artificial Intelligence',
    'Software Engineering',
    'MERN Stack',
    'Data Science',
    'Creative Media',
  ],
  authors: [{ name: 'Rayhan Chowdhury' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Rayhan Chowdhury — Multidisciplinary Technology Portfolio',
    description:
      'Explore the personal portfolio of Rayhan Chowdhury across Cybersecurity, AI, Software Engineering, Data Science, and Creative Media.',
    url: '/',
    siteName: 'Rayhan Chowdhury Portfolio',
    type: 'website',
    images: [
      {
        url: '/assets/aistudio/IMG-20261027-WA0019_53031013.jpg',
        width: 1600,
        height: 900,
        alt: 'Rayhan Chowdhury — Technology Beyond Boundaries',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rayhan Chowdhury — Multidisciplinary Technology Portfolio',
    description:
      'Explore the personal portfolio of Rayhan Chowdhury across Cybersecurity, AI, Software Engineering, Data Science, and Creative Media.',
    images: ['/assets/aistudio/IMG-20261027-WA0019_53031013.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Rayhan Chowdhury',
      description:
        'Multidisciplinary technologist exploring Cybersecurity, Artificial Intelligence, Software Engineering, Data Science, and Digital Creativity.',
      image: `${appUrl}/assets/aistudio/IMG-20261027-WA0019_53031013.jpg`,
      knowsAbout: [
        'Cybersecurity',
        'Artificial Intelligence',
        'Data Science',
        'Software Engineering',
        'MERN Stack Development',
        'Computer Technology',
        'Creative Media',
      ],
    },
  };

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-white/30 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
