import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './components/layout'
import { ThemeProvider } from './components/theme-provider'
import './index.css'
import Chat from './pages/chat/Chat'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Layout>
        <Chat />
      </Layout>
    </ThemeProvider>
  </StrictMode>
)
