'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-wrap-balancer'
import { Toaster } from 'sonner'

type ProviderProps = {
    children: React.ReactNode
}

export function Providers({ children }: ProviderProps) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                retry: 2,
            },
        },
    })

    return (

        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <ThemeProvider attribute="class" defaultTheme='dark'>
                    <Provider>{children}</Provider>
                </ThemeProvider>
            </SessionProvider>
            <Toaster richColors closeButton visibleToasts={1} pauseWhenPageIsHidden />
        </QueryClientProvider>

    )
}
