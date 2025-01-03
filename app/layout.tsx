import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from '@/providers/index'
import "@/styles/globals.css"
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
            <head />
            <body>
                <Providers>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    )
}
