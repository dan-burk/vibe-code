import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
  isDarkMode: boolean
  toggleDarkMode: () => void
  language: string
  setLanguage: (lang: string) => void
}

export default function Layout({ 
  children, 
  isDarkMode, 
  toggleDarkMode, 
  language, 
  setLanguage 
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}