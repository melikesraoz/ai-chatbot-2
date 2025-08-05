import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import { LanguageProvider } from './contexts/LanguageContext'
import { ChatProvider } from './contexts/ChatContext'
import { SettingsProvider } from './contexts/SettingsContext'


export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo')
  const [selectedMode, setSelectedMode] = useState('chat')

  return (
    <SettingsProvider>
      <LanguageProvider>
        <ChatProvider>
          <div className="app-container">
            <Sidebar 
              isOpen={sidebarOpen} 
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
              <Navbar 
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                onModelChange={setSelectedModel}
                onModeChange={setSelectedMode}
              />
              <ChatArea 
                selectedModel={selectedModel}
                selectedMode={selectedMode}
              />
            </div>
          </div>
        </ChatProvider>
      </LanguageProvider>
    </SettingsProvider>
  )
}
