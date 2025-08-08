# AI Chatbot

Modern ve kullanıcı dostu bir AI chatbot uygulaması. Farklı modlarda çalışabilir ve çoklu dil desteği sunar.

## Özellikler

### 🤖 AI Modları
- **Genel Sohbet**: Genel konular hakkında sohbet
- **Otel Asistanı**: Otel rezervasyonu ve bilgi alma
- **Sağlık Danışmanı**: Genel sağlık bilgileri ve öneriler

### 🌍 Çoklu Dil Desteği
- Türkçe (TR)
- İngilizce (EN)
- Almanca (DE)
- Rusça (RU)

### 💬 Sohbet Yönetimi
- Yeni sohbet oluşturma
- Sohbet geçmişi (localStorage ile kalıcı)
- Sohbet başlığı düzenleme
- Sohbet silme
- Sohbet temizleme
- Sayfa yenilendikten sonra sohbetler korunur

### ✏️ Mesaj Düzenleme Özellikleri
- **Mesaj Düzenleme**: Kullanıcı mesajlarını düzenleme
- **Mesaj Silme**: İstenmeyen mesajları silme
- **Yeniden Yanıt Üretme**: Bot yanıtlarını yeniden üretme
- **Düzenleme Geçmişi**: Düzenlenen mesajları işaretleme

### 🎨 Kullanıcı Arayüzü
- Modern ve temiz tasarım
- Karanlık/Aydınlık tema desteği
- Responsive tasarım (mobil uyumlu)
- Gerçek zamanlı yazma göstergesi

## Kullanım

### Mesaj Düzenleme
1. Herhangi bir mesajın üzerine gelin
2. Sağ üst köşedeki "⋮" butonuna tıklayın
3. "Düzenle" seçeneğini seçin
4. Mesajı düzenleyin ve "Kaydet" butonuna tıklayın

### Mesaj Silme
1. Mesajın üzerine gelin
2. "⋮" butonuna tıklayın
3. "Sil" seçeneğini seçin

### Yeniden Yanıt Üretme
1. Bot yanıtının üzerine gelin
2. "⋮" butonuna tıklayın
3. "Yeniden Yanıtla" seçeneğini seçin

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Production build oluşturun
npm run build
```

## Teknolojiler

- **Frontend**: React 18 + TypeScript
- **Styling**: CSS3 (CSS Variables)
- **State Management**: React Context API
- **Build Tool**: Vite
- **AI Integration**: OpenAI API

## Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── ChatArea.tsx    # Ana sohbet alanı
│   ├── Navbar.tsx      # Navigasyon çubuğu
│   └── Sidebar.tsx     # Yan panel
├── contexts/           # React Context'ler
│   ├── ChatContext.tsx # Sohbet yönetimi
│   ├── LanguageContext.tsx # Dil yönetimi
│   └── SettingsContext.tsx # Ayarlar
├── lib/               # Yardımcı fonksiyonlar
│   ├── getHotelData.ts # Otel veri yönetimi
│   └── getSystemPrompt.ts # Sistem prompt'ları
├── mock/              # Mock veriler
│   └── mockHotels.ts  # Otel verileri
├── prompts/           # AI prompt'ları
│   └── prompt.ts      # Prompt şablonları
└── utils/             # Yardımcı araçlar
    └── fetchChatResponse.ts # API çağrıları
```

## Özellik Detayları

### Mesaj Düzenleme Sistemi
- Kullanıcı mesajları düzenlenebilir
- Düzenlenen mesajlar "(düzenlendi)" etiketi ile işaretlenir
- Orijinal mesaj geçmişi korunur
- Bot yanıtları yeniden üretilebilir

### Otel Asistanı
- Gerçek zamanlı oda müsaitliği kontrolü
- Dinamik fiyatlandırma
- Detaylı otel bilgileri
- Rezervasyon süreci

### Çoklu Dil Desteği
- Tüm arayüz çevirileri
- AI yanıtları seçilen dilde
- Dil değiştirme anında etkili

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
