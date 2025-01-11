import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from '@/providers/index'
import "@/styles/globals.css"
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Metadata } from "next"

export const metadata: Metadata = {
    generator: 'Next.js Baby!',
    applicationName: 'Seleneo',
    title: 'The Free Design Tooling Built for Humans',
    description: 'Create open graph images, thumbnails, and social media posts with Seleneo—an open-source platform for crafting beautiful digital assets.',
    robots: 'index, follow',
    referrer: 'origin-when-cross-origin',
    keywords: ['design', 'tooling', 'open-source', 'digital assets', 'social media', 'images',
        'thumbnails', 'screenshots', 'free design tooling', 'seleneo', 'seleneo design tooling',
        'graphics', 'editing', 'creative', 'visual', 'marketing', 'branding', 'digital tools',
        'image editor', 'social media tools', 'content creation', 'web design', 'UI/UX', 'thumbnail generator',
        'design software', 'media creation', 'asset management', 'social graphics', 'visual content',
        'design platform', 'digital marketing', 'image optimization', 'design resources', 'content tools',
        'digital design', 'online editor', 'web tools', 'creative suite', 'design automation',
        'social assets', 'media toolkit'],
    authors: [{ name: 'Nyumat', url: 'https://github.com/nyumat' }],
    creator: 'Nyumat',
    publisher: 'Nyumat',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://freedesign.fyi'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'The Free Design Tooling Built for Humans',
        description: 'Create open graph images, thumbnails, and social media posts with Seleneo—an open-source platform for crafting beautiful digital assets.',
        url: 'https://freedesign.fyi',
        siteName: 'Seleneo',
        images: [
            {
                url: 'http://freedesign.fyi/api/og?title=Seleneo',
                width: 1800,
                height: 1600,
                alt: 'Seleneo Open Graph Image',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning suppressContentEditableWarning>
            <head>
                <script defer src="https://cloud.umami.is/script.js" data-website-id="706fcc6f-f292-4265-bca3-97e91d28432b"></script>
            </head>
            <body>
                <Providers>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableColorScheme
                        enableSystem
                        disableTransitionOnChange
                        storageKey="--geist-theme"
                    >
                        {children}
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    )
}
