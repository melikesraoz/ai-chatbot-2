import { medicalPrompt, generalPrompt, fallbackPrompt, getHotelPromptWithData } from '../prompts/prompt'

export function getSystemPrompt(chatMode: string, language?: string): string {
  let prompt = ''
  
  if (chatMode === 'hotel') {
    prompt = getHotelPromptWithData(language)
  } else if (chatMode === 'medical') {
    prompt = medicalPrompt
  } else if (chatMode === 'chat') {
    prompt = generalPrompt
  } else {
    prompt = fallbackPrompt
  }
  
  if (language && prompt.includes('{{LANG}}')) {
    const languageMap: { [key: string]: string } = {
      'tr': 'Turkish',
      'en': 'English', 
      'de': 'German',
      'ru': 'Russian'
    }
    const langName = languageMap[language] || 'English'
    prompt = prompt.replace('{{LANG}}', langName)
  }
  
  return prompt
}
