'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-wrap-balancer'

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
            <ThemeProvider attribute="class" defaultTheme='dark'>
                <Provider>{children}</Provider>
            </ThemeProvider>
        </QueryClientProvider>

    )
}
