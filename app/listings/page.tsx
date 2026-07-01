'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, Home, MapPin, Maximize2, ChevronDown, Heart, Grid, List } from 'lucide-react'

type ListingType = '전체' | '전세' | '월세'
type SortType = '최신순' | '가격낮은순' | '가격높은순' | '면적넓은순'

const MOCK_LISTINGS = [
  { id: '1', type: '월세', deposit: 1000, rent: 55, address: '서울 마포구 합정동', address_detail: '101동 3층', area: 33.5, floor: 3, total_floor: 15, rooms: 2, status: '거래중', has_parking: true, has_elevator: true, description: '신축 아파트, 깨끗하고 조용한 주거환경', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80' },
  { id: '2', type: '전세', deposit: 25000, rent: 0, address: '서울 성동구 성수동', address_detail: '성수2가 2동', area: 59.3, floor: 7, total_floor: 20, rooms: 3, status: '거래중', has_parking: true, has_elevator: true, description: '성수동 핫플 가까운 신축 오피스텔', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80' },
  { id: '3', type: '월세', deposit: 500, rent: 70, address: '서울 영등포구 여의도동', address_detail: '여의나루 인근', area: 40.0, floor: 12, total_floor: 25, rooms: 2, status: '거래중', has_parking: false, has_elevator: true, description: '한강뷰 투룸, 채광 최고', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=400&q=80' },
  { id: '4', type: '전세', deposit: 18000, rent: 0, address: '서울 광진구 자양동', address_detail: '건대 인근', area: 49.0, floor: 2, total_floor: 5, rooms: 2, status: '거래중', has_parking: true, has_elevator: false, description: '건대입구역 도보 5분, 편리한 교통', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80' },
  { id: '5', type: '월세', deposit: 2000, rent: 80, address: '서울 서대문구 신촌동', address_detail: '신촌역 인근', area: 25.0, floor: 4, total_floor: 6, rooms: 1, status: '거래중', has_parking: false, has_elevator: false, description: '신촌역 도보 3분 원룸', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80' },
  { id: '6', type: '전세', deposit: 30000, rent: 0, address: '서울 강남구 역삼동', address_detail: '강남역 인근', area: 84.0, floor: 15, total_floor: 30, rooms: 4, status: '거래완료', has_parking: true, has_elevator: true, description: '강남 고급 아파트, 넓은 거실', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
  { id: '7', type: '월세', deposit: 3000, rent: 120, address: '서울 용산구 이태원동', address_detail: '이태원역 5분', area: 55.0, floor: 8, total_floor: 18, rooms: 3, status: '거래중', has_parking: true, has_elevator: true, description: '루프탑 있는 감각적인 쓰리룸', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
  { id: '8', type: '전세', deposit: 22000, rent: 0, address: '서울 마포구 연남동', address_detail: '홍대 인근', area: 52.0, floor: 3, total_floor: 7, rooms: 3, status: '거래중', has_parking: false, has_elevator: false, description: '연남동 감성 빌라, 전세 직거래', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80' },
]

export default function ListingsPage() {
  const [type, setType] = useState<ListingType>('전체')
  const [sort, setSort] = useState<SortType>('최신순')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [depositRange, setDepositRange] = useState<[number, number]>([0, 50000])

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = MOCK_LISTINGS.filter(l => {
    if (type !== '전체' && l.type !== type) return false
    if (searchQuery && !l.address.includes(searchQuery)) return false
    return true
  })

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E9ECEF' }}>
        <div className="container-main py-6">
          <h1 className="text-2xl font-extrabold mb-4" style={{ color: '#1A1A2E' }}>
            매물 검색
          </h1>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="지역, 동네, 도로명 주소 검색"
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="btn-ghost flex items-center gap-2"
              style={{ color: showFilter ? '#FF6B35' : undefined, borderColor: showFilter ? '#FF6B35' : undefined }}
            >
              <SlidersHorizontal size={16} />
              상세 필터
            </button>
            <Link href="/listings/new" className="btn-primary whitespace-nowrap">
              + 매물 등록
            </Link>
          </div>

          {/* Type Tabs */}
          <div className="flex gap-2 mt-4">
            {(['전체', '전세', '월세'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: type === t ? '#FF6B35' : 'transparent',
                  color: type === t ? 'white' : '#6C757D',
                  border: `2px solid ${type === t ? '#FF6B35' : '#E9ECEF'}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main py-6">
        {/* Result Count & Sort */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-medium" style={{ color: '#6C757D' }}>
            총 <span className="font-bold" style={{ color: '#1A1A2E' }}>{filtered.length}</span>개 매물
          </p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortType)}
                className="appearance-none pr-8 pl-3 py-1.5 rounded-lg text-sm border cursor-pointer outline-none"
                style={{ borderColor: '#E9ECEF', color: '#6C757D' }}
              >
                {['최신순', '가격낮은순', '가격높은순', '면적넓은순'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#ADB5BD' }} />
            </div>
            <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: '#E9ECEF' }}>
              <button onClick={() => setViewMode('grid')} className="p-2 transition-colors"
                style={{ background: viewMode === 'grid' ? '#FF6B35' : 'white', color: viewMode === 'grid' ? 'white' : '#6C757D' }}>
                <Grid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className="p-2 transition-colors"
                style={{ background: viewMode === 'list' ? '#FF6B35' : 'white', color: viewMode === 'list' ? 'white' : '#6C757D' }}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Listing Grid */}
        <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filtered.map(listing => (
            <div key={listing.id} className="card overflow-hidden group" style={{ position: 'relative' }}>
              {/* Bookmark */}
              <button
                onClick={() => toggleBookmark(listing.id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.9)' }}
              >
                <Heart size={16}
                  fill={bookmarks.has(listing.id) ? '#FF6B35' : 'none'}
                  style={{ color: bookmarks.has(listing.id) ? '#FF6B35' : '#6C757D' }} />
              </button>

              <Link href={`/listings/${listing.id}`}>
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'hidden sm:block sm:w-48 sm:h-full' : 'h-44'} overflow-hidden`}>
                  <img
                    src={listing.image}
                    alt={`${listing.address} 매물 이미지`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Shadow overlay to make badges read well */}
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`badge ${listing.type === '전세' ? 'badge-jeonse' : 'badge-wolse'}`}>
                      {listing.type}
                    </span>
                    {listing.status === '거래완료' && (
                      <span className="badge badge-complete">거래완료</span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start gap-1 mb-1">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#ADB5BD' }} />
                    <p className="text-xs line-clamp-1" style={{ color: '#ADB5BD' }}>{listing.address}</p>
                  </div>

                  <p className="font-extrabold text-base mb-2" style={{ color: '#1A1A2E' }}>
                    {listing.type === '전세'
                      ? `전세 ${(listing.deposit / 10000).toFixed(0)}억`
                      : `월세 ${listing.deposit / 10000 >= 1 ? (listing.deposit / 10000).toFixed(1) + '억' : (listing.deposit / 100) + '00만'}/${listing.rent}만`}
                  </p>

                  <div className="flex items-center gap-3 text-xs" style={{ color: '#6C757D' }}>
                    <span className="flex items-center gap-1">
                      <Maximize2 size={11} /> {listing.area}㎡
                    </span>
                    <span>{listing.floor}층/{listing.total_floor}층</span>
                    <span>{listing.rooms}룸</span>
                  </div>

                  <p className="text-xs mt-2 line-clamp-2" style={{ color: '#ADB5BD' }}>
                    {listing.description}
                  </p>

                  <div className="flex gap-2 mt-3">
                    {listing.has_parking && (
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: '#F8F9FA', color: '#6C757D' }}>주차가능</span>
                    )}
                    {listing.has_elevator && (
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: '#F8F9FA', color: '#6C757D' }}>엘리베이터</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Home size={48} className="mx-auto mb-4" style={{ color: '#ADB5BD' }} />
            <p className="text-lg font-bold mb-2" style={{ color: '#6C757D' }}>검색 결과가 없습니다</p>
            <p className="text-sm" style={{ color: '#ADB5BD' }}>다른 지역이나 조건으로 검색해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
