import { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import InputPanel from './components/ui/InputPanel'
import OutputPanel from './components/ui/OutputPanel'
import UsageIndicator from './components/ui/UsageIndicator'

function App() {
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

  return (
    <Layout 
      isDarkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode}
      language={language}
      setLanguage={setLanguage}
    >
      <div className="flex flex-1 gap-4 p-4 max-w-7xl mx-auto w-full">
        {/* Input Panel - Left Side */}
        <div className="flex-1 min-w-0">
          <InputPanel
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            language={language}
          />
        </div>

        {/* Output Panel - Right Side */}
        <div className="flex-1 min-w-0">
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