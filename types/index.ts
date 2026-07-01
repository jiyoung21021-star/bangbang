// 매물 타입
export type ListingType = '전세' | '월세'

export type ListingStatus = '거래중' | '거래완료'

export interface Listing {
  id: string
  user_id: string
  type: ListingType
  deposit: number
  monthly_rent: number
  address: string
  address_detail: string
  area: number
  floor: number
  total_floor: number
  rooms: number
  bathrooms: number
  description: string
  status: ListingStatus
  has_elevator: boolean
  has_parking: boolean
  has_balcony: boolean
  heating_type: string
  move_in_date: string
  created_at: string
  profiles?: Profile
  listing_images?: ListingImage[]
  bookmarks?: Bookmark[]
}

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  order_index: number
  created_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  listing_id: string
  created_at: string
}

// 사용자 프로필
export interface Profile {
  id: string
  email: string
  nickname: string
  avatar_url: string | null
  role: 'landlord' | 'tenant'
  phone: string | null
  created_at: string
}

// 커뮤니티
export type PostCategory = '자유' | '정보' | 'Q&A' | '후기'

export interface CommunityPost {
  id: string
  user_id: string
  category: PostCategory
  title: string
  content: string
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
  profiles?: Profile
  comments?: Comment[]
  likes?: Like[]
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles?: Profile
}

export interface Like {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

// 채팅
export interface ChatRoom {
  id: string
  listing_id: string
  landlord_id: string
  tenant_id: string
  created_at: string
  last_message?: string
  last_message_at?: string
  listings?: Listing
  landlord?: Profile
  tenant?: Profile
}

export interface ChatMessage {
  id: string
  room_id: string
  sender_id: string
  content: string
  image_url: string | null
  created_at: string
  profiles?: Profile
}
