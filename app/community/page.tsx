'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, PenLine, ThumbsUp, MessageCircle, Eye, ChevronRight, TrendingUp, Star, Flame } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

type Category = '전체' | '자유' | '정보' | 'Q&A' | '후기'

const MOCK_POSTS = [
  { id: '1', category: '정보', title: '전세사기 당할 뻔 했는데 이걸로 막았습니다 (필독)', content: '안녕하세요. 제가 최근에 전세 계약하면서 위기를 넘긴 경험을 공유합니다...', views: 2840, likes: 187, comments: 43, author: '익명의집구슬', created_at: '2025-06-14T10:00:00Z', isPinned: true },
  { id: '2', category: 'Q&A', title: '확정일자랑 전입신고 순서가 어떻게 되나요?', content: '처음 혼자 집 계약하는데 확정일자와 전입신고 중 어떤 걸 먼저 해야 하는지...', views: 1290, likes: 98, comments: 31, author: '사회초년생김씨', created_at: '2025-06-13T15:30:00Z', isPinned: false },
  { id: '3', category: '후기', title: '방방으로 직거래 성공! 수수료 130만원 절약했어요', content: '3개월 동안 찾던 집을 방방에서 드디어 찾았습니다. 집주인분도 친절하시고...', views: 876, likes: 134, comments: 28, author: '직거래성공러', created_at: '2025-06-12T09:00:00Z', isPinned: false },
  { id: '4', category: '자유', title: '서울 월세 시세 어떻게 생각하세요? 너무 오른거 아닌가요', content: '요즘 서울 월세가 정말 많이 올랐는데 다들 어떻게 생각하시나요...', views: 654, likes: 76, comments: 52, author: '월세족', created_at: '2025-06-11T18:00:00Z', isPinned: false },
  { id: '5', category: '정보', title: '등기부등본 보는 법 완전 정복 (초보자용)', content: '등기부등본에서 을구와 갑구가 뭔지부터 헷갈리시죠? 오늘 한번에 정리해드릴게요...', views: 1543, likes: 221, comments: 37, author: '부동산고수', created_at: '2025-06-10T12:00:00Z', isPinned: false },
  { id: '6', category: 'Q&A', title: '집주인이 전세 보증금 반환을 미루면 어떻게 해야 하나요?', content: '계약 만료 후 2주가 지났는데 집주인이 보증금을 돌려주지 않고 있어요...', views: 987, likes: 143, comments: 61, author: '걱정많은세입자', created_at: '2025-06-09T20:00:00Z', isPinned: false },
]

const categoryColors: Record<string, { bg: string; color: string }> = {
  '자유': { bg: 'rgba(108,117,125,0.1)', color: '#6C757D' },
  '정보': { bg: 'rgba(23,162,184,0.1)', color: '#17A2B8' },
  'Q&A': { bg: 'rgba(255,107,53,0.1)', color: '#FF6B35' },
  '후기': { bg: 'rgba(40,167,69,0.1)', color: '#28A745' },
}

export default function CommunityPage() {
  const [category, setCategory] = useState<Category>('전체')
  const [search, setSearch] = useState('')

  const filtered = MOCK_POSTS.filter(p => {
    if (category !== '전체' && p.category !== category) return false
    if (search && !p.title.includes(search) && !p.content.includes(search)) return false
    return true
  })

  const hot = MOCK_POSTS.slice(0, 3)

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E9ECEF' }}>
        <div className="container-main py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E' }}>커뮤니티</h1>
              <p className="text-sm mt-1" style={{ color: '#6C757D' }}>
                부동산 정보를 나누고 경험을 공유해요
              </p>
            </div>
            <Link href="/community/write" className="btn-primary">
              <PenLine size={15} />
              글쓰기
            </Link>
          </div>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="궁금한 내용을 검색해보세요" className="input-field pl-10" />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {(['전체', '자유', '정보', 'Q&A', '후기'] as const).map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className="px-4 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  background: category === cat ? '#FF6B35' : 'transparent',
                  color: category === cat ? 'white' : '#6C757D',
                  border: `2px solid ${category === cat ? '#FF6B35' : '#E9ECEF'}`,
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts List */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.map(post => {
              const cat = categoryColors[post.category]
              const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })
              return (
                <Link key={post.id} href={`/community/${post.id}`}>
                  <div className="card p-5 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="badge text-xs px-2 py-0.5" style={{ background: cat.bg, color: cat.color }}>
                            {post.category}
                          </span>
                          {post.isPinned && (
                            <span className="badge text-xs px-2 py-0.5"
                              style={{ background: 'rgba(255,193,7,0.1)', color: '#FFC107' }}>
                              📌 공지
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold mb-1 line-clamp-1" style={{ color: '#1A1A2E' }}>
                          {post.title}
                        </h3>
                        <p className="text-sm line-clamp-2 mb-3" style={{ color: '#6C757D' }}>
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs" style={{ color: '#ADB5BD' }}>
                          <span>{post.author}</span>
                          <span>{timeAgo}</span>
                          <span className="flex items-center gap-1">
                            <Eye size={11} /> {post.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={11} /> {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={11} /> {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Hot Posts */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={18} style={{ color: '#FF6B35' }} />
                <h3 className="font-bold" style={{ color: '#1A1A2E' }}>인기글</h3>
              </div>
              <div className="space-y-3">
                {hot.map((post, i) => (
                  <Link key={post.id} href={`/community/${post.id}`}
                    className="flex items-start gap-3 group">
                    <span className="text-lg font-extrabold flex-shrink-0"
                      style={{ color: i === 0 ? '#FF6B35' : '#ADB5BD' }}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium line-clamp-2 group-hover:text-orange-500 transition-colors"
                        style={{ color: '#1A1A2E' }}>
                        {post.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#ADB5BD' }}>
                        👍 {post.likes} · 💬 {post.comments}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Guide Links */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star size={18} style={{ color: '#FF6B35' }} />
                <h3 className="font-bold" style={{ color: '#1A1A2E' }}>필독 가이드</h3>
              </div>
              <div className="space-y-2">
                {[
                  '전세사기 유형 TOP 5',
                  '계약 전 체크리스트 20',
                  '등기부등본 보는 법',
                  '확정일자 받는 방법',
                ].map(item => (
                  <Link key={item} href="/guide"
                    className="flex items-center justify-between py-2 border-b group transition-colors"
                    style={{ borderColor: '#F1F3F5' }}>
                    <span className="text-sm group-hover:text-orange-500 transition-colors"
                      style={{ color: '#6C757D' }}>
                      {item}
                    </span>
                    <ChevronRight size={14} style={{ color: '#ADB5BD' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
