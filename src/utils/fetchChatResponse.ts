export async function fetchChatResponse(
    messages: { role: 'user' | 'system' | 'assistant'; content: string }[],
    model = 'gpt-3.5-turbo'
  ) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    
    if (!apiKey || apiKey === 'api-keyin') {
      throw new Error('OpenAI API anahtarı bulunamadı. Lütfen .env dosyasında VITE_OPENAI_API_KEY değerini ayarlayın.')
    }
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7//yaratıcılık seviye
        })
      })
    
      if (!response.ok) {
        const err = await response.json()
        console.error('API Error:', err)
        
        
        if (response.status === 401) {
          throw new Error('API anahtarı geçersiz. Lütfen doğru API anahtarını kullanın.')
        } else if (response.status === 429) {
          throw new Error('API istek limiti aşıldı. Lütfen biraz bekleyip tekrar deneyin.')
        } else if (response.status === 400) {
          throw new Error('Geçersiz istek. Lütfen mesajınızı kontrol edin.')
        } else {
          throw new Error(err?.error?.message || 'OpenAI API hatası oluştu.')
        }
      }
    
      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error('Beklenmeyen bir hata oluştu.')
      }
    }
  }
  