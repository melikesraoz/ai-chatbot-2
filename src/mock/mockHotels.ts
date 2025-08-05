// src/mock/mockHotels.ts

export interface Room {
  type: string
  pricePerNight: number
  bed: string
  capacity: number
  availableCount: number
  description: string
  includes: string[]
  image: string
}

export interface HotelContact {
  phone: string
  email: string
  address: string
}

export interface Hotel {
  id: string
  name: string
  location: string
  description: string
  checkIn: string
  checkOut: string
  amenities: string[]
  activities: string[]
  rooms: Room[]
  contact: HotelContact
}

export const mockHotels: Hotel[] = [
  {
    id: "sunrise-hotel",
    name: "Sunrise Hotel",
    location: "Antalya, Türkiye",
    description: "Denize sıfır, aile dostu bir otel. Spa, açık havuz ve restoran hizmetleriyle rahat bir tatil sunar.",
    checkIn: "14:00",
    checkOut: "12:00",
    amenities: [
      "Ücretsiz Wi-Fi", 
      "Açık havuz", 
      "Otopark", 
      "Spa", 
      "Havaalanı servisi", 
      "Evcil hayvan kabul edilir",
      "Restoran",
      "Bar",
      "Fitness merkezi",
      "Çocuk oyun alanı",
      "24 saat resepsiyon",
      "Klima"
    ],
    activities: [
      "Gün batımı tekne turu", 
      "Yoga seansı", 
      "Su sporları", 
      "Çocuk kulübü",
      "Masa tenisi",
      "Bisiklet kiralama",
      "Dalış turları",
      "Şehir turları"
    ],
    rooms: [
      {
        type: "Standart Oda",
        pricePerNight: 1800,
        bed: "1 çift kişilik yatak",
        capacity: 2,
        availableCount: 5,
        description: "Deniz manzaralı, klima, minibar, balkonlu.",
        includes: ["Kahvaltı", "Temizlik servisi", "TV", "Klima", "Minibar"],
        image: "https://example.com/standard.jpg"
      },
      {
        type: "Deluxe Oda",
        pricePerNight: 2400,
        bed: "1 büyük çift kişilik yatak",
        capacity: 3,
        availableCount: 2,
        description: "Jakuzili banyo, geniş balkon, ücretsiz minibar.",
        includes: ["Kahvaltı", "Spa indirimi", "TV", "Klima", "Jakuzi", "Balkon"],
        image: "https://example.com/deluxe.jpg"
      },
      {
        type: "Aile Odası",
        pricePerNight: 3200,
        bed: "1 çift + 2 tek kişilik yatak",
        capacity: 4,
        availableCount: 1,
        description: "İki ayrı oda, çocuklar için güvenli alan.",
        includes: ["Kahvaltı", "Akşam yemeği", "Mini buzdolabı", "Çocuk yatağı", "TV"],
        image: "https://example.com/family.jpg"
      },
      {
        type: "Suit Oda",
        pricePerNight: 4500,
        bed: "1 çift kişilik yatak + oturma alanı",
        capacity: 2,
        availableCount: 1,
        description: "Lüks suit, deniz manzaralı, özel teras.",
        includes: ["Kahvaltı", "Akşam yemeği", "Spa ücretsiz", "Özel teras", "Butler servisi"],
        image: "https://example.com/suite.jpg"
      }
    ],
    contact: {
      phone: "+90 555 123 4567",
      email: "info@sunrisehotel.com",
      address: "Liman Mah. Sahil Cad. No:12, Antalya"
    }
  },
  {
    id: "mountain-lodge",
    name: "Mountain Lodge",
    location: "Bolu, Türkiye",
    description: "Doğanın kalbinde, dağ manzaralı huzurlu bir kaçamak. Doğa yürüyüşü ve kamp aktiviteleri.",
    checkIn: "15:00",
    checkOut: "11:00",
    amenities: [
      "Ücretsiz Wi-Fi",
      "Restoran",
      "Bar",
      "Şömine",
      "Doğa yürüyüşü parkurları",
      "Kamp alanı",
      "Otopark",
      "Evcil hayvan kabul edilir"
    ],
    activities: [
      "Doğa yürüyüşü",
      "Kamp",
      "Fotoğrafçılık",
      "Bisiklet turları",
      "Kuş gözlemi",
      "Yıldız gözlemi"
    ],
    rooms: [
      {
        type: "Ahşap Kulübe",
        pricePerNight: 1200,
        bed: "1 çift kişilik yatak",
        capacity: 2,
        availableCount: 3,
        description: "Doğal ahşap kulübe, şömine, dağ manzaralı.",
        includes: ["Kahvaltı", "Şömine", "TV", "Klima"],
        image: "https://example.com/cabin.jpg"
      },
      {
        type: "Aile Kulübesi",
        pricePerNight: 1800,
        bed: "1 çift + 2 tek kişilik yatak",
        capacity: 4,
        availableCount: 2,
        description: "Geniş aile kulübesi, iki yatak odalı.",
        includes: ["Kahvaltı", "Akşam yemeği", "Şömine", "TV"],
        image: "https://example.com/family-cabin.jpg"
      }
    ],
    contact: {
      phone: "+90 555 987 6543",
      email: "info@mountainlodge.com",
      address: "Yedigöller Milli Parkı, Bolu"
    }
  }
] 