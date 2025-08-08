import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
  isDarkMode: boolean
  toggleDarkMode: () => void
  language: string
  setLanguage: (lang: string) => void
  isLanding?: boolean
}

export default function Layout({ 
  children, 
  isDarkMode, 
  toggleDarkMode, 
  language, 
  setLanguage,
  isLanding = false
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      {!isLanding && (
        <Header 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          language={language}
          setLanguage={setLanguage}
        />
      )}
      
      <main className={`flex-1 flex flex-col ${isLanding ? '' : 'pt-0'}`}>
        {children}
      </main>
      
      {!isLanding && <Footer />}
    </div>
  )
}