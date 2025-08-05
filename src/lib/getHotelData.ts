// src/lib/getHotelData.ts

import { mockHotels } from '../mock/mockHotels'
import type { Hotel, Room } from '../mock/mockHotels'

export function getHotelById(hotelId: string): Hotel | undefined {
  return mockHotels.find(hotel => hotel.id === hotelId)
}

export function getDefaultHotel(): Hotel {
  return mockHotels[0] // Sunrise Hotel as default
}

export function getAllHotels(): Hotel[] {
  return mockHotels
}

export function formatAllHotelsList(): string {
  return mockHotels.map(hotel => 
    `• ${hotel.name} (${hotel.location}) - ${hotel.description}`
  ).join('\n')
}

export function getAvailableRooms(hotelId: string): Room[] {
  const hotel = getHotelById(hotelId)
  if (!hotel) return []
  
  return hotel.rooms.filter(room => room.availableCount > 0)
}

export function getRoomByType(hotelId: string, roomType: string): Room | undefined {
  const hotel = getHotelById(hotelId)
  if (!hotel) return undefined
  
  return hotel.rooms.find(room => 
    room.type.toLowerCase().includes(roomType.toLowerCase())
  )
}

export function getRoomsByCapacity(hotelId: string, capacity: number): Room[] {
  const hotel = getHotelById(hotelId)
  if (!hotel) return []
  
  return hotel.rooms.filter(room => room.capacity >= capacity)
}

export function getRoomsByPriceRange(hotelId: string, minPrice: number, maxPrice: number): Room[] {
  const hotel = getHotelById(hotelId)
  if (!hotel) return []
  
  return hotel.rooms.filter(room => 
    room.pricePerNight >= minPrice && room.pricePerNight <= maxPrice
  )
}

export function hasAmenity(hotelId: string, amenity: string): boolean {
  const hotel = getHotelById(hotelId)
  if (!hotel) return false
  
  return hotel.amenities.some(a => 
    a.toLowerCase().includes(amenity.toLowerCase())
  )
}

export function getActivities(hotelId: string): string[] {
  const hotel = getHotelById(hotelId)
  if (!hotel) return []
  
  return hotel.activities
}

export function formatHotelInfo(hotel: Hotel): string {
  return `
${hotel.name} - ${hotel.location}
${hotel.description}

Check-in: ${hotel.checkIn} | Check-out: ${hotel.checkOut}

Oda Seçenekleri:
${hotel.rooms.map(room => 
  `• ${room.type} (${room.capacity} kişilik): ${room.pricePerNight}₺/gece
   ${room.description}
   İçerir: ${room.includes.join(', ')}
   Müsait: ${room.availableCount} adet`
).join('\n\n')}

Özellikler: ${hotel.amenities.join(', ')}

Aktiviteler: ${hotel.activities.join(', ')}

İletişim: ${hotel.contact.phone} | ${hotel.contact.email}
Adres: ${hotel.contact.address}
`.trim()
}

export function formatAllHotelsInfo(): string {
  return mockHotels.map(hotel => formatHotelInfo(hotel)).join('\n\n' + '='.repeat(50) + '\n\n')
} 