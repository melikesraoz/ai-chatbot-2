import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useSettings } from '../contexts/SettingsContext'
import { useChat } from '../contexts/ChatContext'

interface NavbarProps {
  onMenuClick: () => void
  onModelChange: (model: string) => void
  onModeChange: (mode: string) => void
}

export default function Navbar({ 
  onMenuClick, 
  onModelChange, 
  onModeChange 
}: NavbarProps) {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo')
  const [selectedMode, setSelectedMode] = useState('chat')
  const { language, setLanguage, t } = useLanguage()
  const { isDarkMode, toggleDarkMode } = useSettings()
  const { currentChatId, updateChatLanguage } = useChat()

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value
    setSelectedModel(model)//navbar içi state
    onModelChange(model)//app.tsx'e gönderiyoruz
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'tr' | 'en' | 'de' | 'ru'
    setLanguage(newLanguage)
    
    if (currentChatId) {
      updateChatLanguage(currentChatId, newLanguage)
    }
  }

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value
    setSelectedMode(mode)
    onModeChange(mode)
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          ☰
        </button>
      </div>
      
      <div className="navbar-right">
        <div className="navbar-controls">
          <select 
            className="form-select form-select-sm" 
            value={selectedModel}
            onChange={handleModelChange}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
          </select>
          <select 
            className="form-select form-select-sm"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="tr">TR</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="ru">RU</option>
          </select>
          <select 
            className="form-select form-select-sm"
            value={selectedMode}
            onChange={handleModeChange}
          >
            <option value="chat">{t('chat')}</option>
            <option value="hotel">{t('hotel')}</option>
            <option value="medical">{t('medical')}</option>
          </select>
        </div>
        
        <button 
          className="theme-btn" 
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? '☀' : '☾'}
        </button>
      </div>
    </nav>
  )
}
