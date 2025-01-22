import { ThemeProvider } from './theme-provider'
import { RouterProvider } from 'react-aria-components'
import { useNavigate } from 'react-router';

export function Providers({ children }: { children: React.ReactNode }) {
    const  navigate = useNavigate();
    return (
        <RouterProvider navigate={navigate}>
            <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                {children}
            </ThemeProvider>
        </RouterProvider>
    )
}
