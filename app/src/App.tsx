import { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import InputPanel from './components/ui/InputPanel'
import OutputPanel from './components/ui/OutputPanel'
import UsageIndicator from './components/ui/UsageIndicator'
import LandingPage from './components/ui/LandingPage'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')

  // Load usage count from localStorage on mount
  useEffect(() => {
    const savedUsage = localStorage.getItem('usage_count')
    if (savedUsage) {
      setUsageCount(parseInt(savedUsage, 10))
    }

    // Check for dark mode preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    // Check if user has used the app before
    const hasUsedApp = localStorage.getItem('has_used_app')
    if (hasUsedApp) {
      setShowLanding(false)
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleGetStarted = () => {
    setShowLanding(false)
    localStorage.setItem('has_used_app', 'true')
  }

  const handleSubmit = async () => {
    if (!input.trim()) return

    // Check usage limit (2 requests before login required)
    if (usageCount >= 2) {
      setOutput('Login required to continue. You have reached the limit of 2 free requests.')
      return
    }

    setIsLoading(true)
    
    // Simulate API call - replace this with actual backend call later
    setTimeout(() => {
      setOutput(`Mock AI Response to: "${input}"
      
This is a placeholder response. In the real app, this would be connected to your backend API that calls OpenAI.

Input language detected: ${language === 'en' ? 'English' : 'Spanish'}
Usage count: ${usageCount + 1}/2 requests used.`)
      
      const newUsageCount = usageCount + 1
      setUsageCount(newUsageCount)
      localStorage.setItem('usage_count', newUsageCount.toString())
      setIsLoading(false)
    }, 2000)
  }

  // Show landing page
  if (showLanding) {
    return (
      <Layout 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        language={language}
        setLanguage={setLanguage}
        isLanding={true}
      >
        <LandingPage 
          onGetStarted={handleGetStarted}
          language={language}
        />
      </Layout>
    )
  }

  // Show main app
  return (
    <Layout 
      isDarkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode}
      language={language}
      setLanguage={setLanguage}
    >
      {/* Main content container with vertical stacking */}
      <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
        {/* Input Panel - Top */}
        <div className="w-full">
          <InputPanel
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            language={language}
          />
        </div>

        {/* Output Panel - Bottom */}
        <div className="w-full">
          <OutputPanel
            output={output}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Usage Indicator */}
      <UsageIndicator usageCount={usageCount} maxUsage={2} />
    </Layout>
  )
}

export default App