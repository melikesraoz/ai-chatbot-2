import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface SettingsContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within a SettingsProvider')
  return context
}

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved === 'true') {
      setIsDarkMode(true)
      document.body.classList.add('dark-mode')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev
      document.body.classList.toggle('dark-mode', next)
      localStorage.setItem('darkMode', next ? 'true' : 'false')
      return next
    })
  }

  return (
    <SettingsContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  )
} 