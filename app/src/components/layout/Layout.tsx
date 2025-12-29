import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
  isDarkMode: boolean
  toggleDarkMode: () => void
  onExportPDF: () => Promise<void>
  isFinished: boolean
  showHeader?: boolean
  showFooter?: boolean
  onSignInClick?: () => void
}

export default function Layout({
  children,
  isDarkMode,
  toggleDarkMode,
  onExportPDF,
  isFinished,
  showHeader = true,
  showFooter = true,
  onSignInClick,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {showHeader && (
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onExportPDF={onExportPDF}
          isFinished={isFinished}
          onSignInClick={onSignInClick}
        />
      )}

      <main className="flex-1 flex flex-col">{children}</main>

      {showFooter && <Footer />}
    </div>
  )
}
