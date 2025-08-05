import React, { useState, useRef, useEffect } from 'react'
import { fetchChatResponse } from '../utils/fetchChatResponse'
import { useLanguage } from '../contexts/LanguageContext'
import { useChat } from '../contexts/ChatContext'
import { getSystemPrompt } from '../lib/getSystemPrompt'

interface Message {
  id: string
  sender: 'user' | 'bot'
  message: string
  timestamp: string
}

interface ChatAreaProps {
  selectedModel: string
  selectedMode: string
}

export default function ChatArea({ 
  selectedModel, 
  selectedMode
}: ChatAreaProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { t } = useLanguage()
  const { currentChat, currentChatId, addMessageToChat } = useChat()
  
 
  const chatLanguage = currentChat?.language || 'tr'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading && currentChatId) {
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }

      addMessageToChat(currentChatId, userMessage)
      const userInput = message.trim()
      setMessage('')
      setIsLoading(true)

      try {
        const systemPrompt = getSystemPrompt(selectedMode, chatLanguage)
        
       
        const conversationHistory = currentChat?.messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.message
        })) || []

        const apiMessages = [
          {
            role: 'system' as const,
            content: systemPrompt
          },
          ...conversationHistory,
          {
            role: 'user' as const,
            content: userInput
          }
        ]

        const response = await fetchChatResponse(apiMessages, selectedModel)
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          message: response,
          timestamp: new Date().toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }

        addMessageToChat(currentChatId, botMessage)
      } catch (error) {
        console.error('Mesaj gönderme hatası:', error)
        
        let errorMessage = t('error_message')
        if (error instanceof Error) {
          errorMessage = error.message
        }
        
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          message: `Error: ${errorMessage}`,
          timestamp: new Date().toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }
        addMessageToChat(currentChatId, errorMsg)
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!currentChatId) {
    return (
      <div className="chat-container">
        <div className="chat-messages">
          <div className="welcome-message">
            <h1>{t('welcome_title')}</h1>
            <p>{t('welcome_subtitle')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {currentChat?.messages.length === 0 ? (
          <div className="welcome-message">
            <h1>{t('welcome_title')}</h1>
            <p>{t('welcome_subtitle')}</p>
          </div>
        ) : (
          <div className="messages-list">
            {currentChat?.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <div className="message-text">{msg.message}</div>
                  <div className="message-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="loading-indicator">
                    <span>{t('typing')}</span>
                    <div className="dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <div className="input-field-container">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('input_placeholder')}
                className="chat-input"
                disabled={isLoading}
              />
            </div>
            
            <div className="input-actions">
              <button 
                type="submit" 
                className="send-btn" 
                disabled={!message.trim() || isLoading}
                title={t('send')}
              >
                →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
