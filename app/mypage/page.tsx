'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Heart, MessageCircle, FileText, Settings, ChevronRight, Building2, User, Plus, Eye } from 'lucide-react'

const tabs = ['내 정보', '내 매물', '찜 목록', '내 게시글'] as const
type Tab = typeof tabs[number]

const MOCK_MY_LISTINGS = [
  { id: '1', type: '월세', deposit: 1000, rent: 55, address: '서울 마포구 합정동', area: 33.5, status: '거래중', views: 234 },
  { id: '2', type: '전세', deposit: 20000, rent: 0, address: '서울 성동구 성수동', area: 59.0, status: '거래완료', views: 89 },
]

const MOCK_BOOKMARKS = [
  { id: '3', type: '월세', deposit: 500, rent: 70, address: '서울 영등포구 여의도동', area: 40, status: '거래중' },
  { id: '4', type: '전세', deposit: 18000, rent: 0, address: '서울 광진구 자양동', area: 49, status: '거래중' },
]

const MOCK_POSTS = [
  { id: '1', title: '방방으로 직거래 성공 후기 공유합니다', category: '후기', views: 876, created_at: '2025-06-12' },
  { id: '2', title: '확정일자 받는 방법 질문드려요', category: 'Q&A', views: 321, created_at: '2025-06-08' },
]

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('내 정보')

  // Mock user data
  const user = {
    email: 'user@example.com',
    nickname: '방구하는김씨',
    role: 'tenant' as const,
    created_at: '2025-03-01',
    avatar: null,
  }

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #16213E)' }}>
        <div className="container-main py-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #E85A24)', color: 'white' }}>
              {user.nickname[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-extrabold text-white">{user.nickname}</h1>
                <span className="badge text-xs px-2 py-0.5"
                  style={{ background: 'rgba(255,107,53,0.25)', color: '#FF8C5A' }}>
                  {user.role === 'tenant' ? '세입자' : '집주인'}
                </span>
              </div>
              <p className="text-sm" style={{ color: '#9CA3AF' }}>{user.email}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                가입일: {user.created_at}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: '내 매물', value: MOCK_MY_LISTINGS.length, icon: Building2 },
              { label: '찜 목록', value: MOCK_BOOKMARKS.length, icon: Heart },
              { label: '작성글', value: MOCK_POSTS.length, icon: FileText },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Icon size={20} className="mx-auto mb-1" style={{ color: '#FF6B35' }} />
                <p className="text-xl font-extrabold text-white">{value}</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab ? '#FF6B35' : 'white',
                color: activeTab === tab ? 'white' : '#6C757D',
                border: `2px solid ${activeTab === tab ? '#FF6B35' : '#E9ECEF'}`,
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === '내 정보' && (
          <div className="card p-6 max-w-lg">
            <h2 className="font-bold text-lg mb-5" style={{ color: '#1A1A2E' }}>프로필 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>닉네임</label>
                <input type="text" className="input-field" defaultValue={user.nickname} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>이메일</label>
                <input type="email" className="input-field" defaultValue={user.email} disabled
                  style={{ background: '#F8F9FA', color: '#ADB5BD' }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>전화번호</label>
                <input type="tel" className="input-field" placeholder="010-0000-0000 (선택)" />
              </div>
              <button className="btn-primary">저장하기</button>
            </div>
          </div>
        )}

        {activeTab === '내 매물' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium" style={{ color: '#6C757D' }}>
                총 <span className="font-bold" style={{ color: '#1A1A2E' }}>{MOCK_MY_LISTINGS.length}</span>개 매물
              </p>
              <Link href="/listings/new" className="btn-primary text-sm px-4 py-2">
                <Plus size={14} /> 매물 등록
              </Link>
            </div>
            {MOCK_MY_LISTINGS.map(listing => (
              <div key={listing.id} className="card p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#F8F9FA' }}>
                  <Home size={24} style={{ color: '#ADB5BD' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs mb-0.5" style={{ color: '#ADB5BD' }}>{listing.address}</p>
                  <p className="font-bold" style={{ color: '#1A1A2E' }}>
                    {listing.type === '전세'
                      ? `전세 ${(listing.deposit / 10000).toFixed(0)}억`
                      : `월세 ${listing.deposit / 100}00만/${listing.rent}만`}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`badge text-xs px-2 py-0.5 ${listing.status === '거래중' ? '' : 'badge-complete'}`}
                      style={listing.status === '거래중' ? { background: 'rgba(40,167,69,0.1)', color: '#28A745' } : {}}>
                      {listing.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#ADB5BD' }}>
                      <Eye size={11} /> {listing.views}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/listings/${listing.id}`} className="btn-ghost text-xs px-3 py-1.5">보기</Link>
                  <button className="btn-ghost text-xs px-3 py-1.5">수정</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === '찜 목록' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_BOOKMARKS.map(listing => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <div className="card overflow-hidden">
                  <div className="h-40 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #E9ECEF, #F8F9FA)' }}>
                    <Home size={32} style={{ color: '#ADB5BD' }} />
                  </div>
                  <div className="p-4">
                    <p className="text-xs mb-1" style={{ color: '#ADB5BD' }}>{listing.address}</p>
                    <p className="font-bold" style={{ color: '#1A1A2E' }}>
                      {listing.type === '전세'
                        ? `전세 ${(listing.deposit / 10000).toFixed(0)}억`
                        : `월세 ${listing.deposit / 100}00만/${listing.rent}만`}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#6C757D' }}>{listing.area}㎡</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === '내 게시글' && (
          <div className="space-y-3">
            {MOCK_POSTS.map(post => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <div className="card p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge text-xs px-2 py-0.5"
                        style={{ background: 'rgba(255,107,53,0.1)', color: '#FF6B35' }}>
                        {post.category}
                      </span>
                      <span className="text-xs" style={{ color: '#ADB5BD' }}>{post.created_at}</span>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>{post.title}</p>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#ADB5BD' }}>
                      <Eye size={11} /> {post.views}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: '#ADB5BD' }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
