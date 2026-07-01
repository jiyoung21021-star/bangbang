'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PenLine, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Category = '자유' | '정보' | 'Q&A' | '후기'

const categoryDesc: Record<Category, string> = {
  '자유': '부동산 관련 자유로운 이야기',
  '정보': '유용한 부동산 정보 공유',
  'Q&A': '궁금한 점을 질문해보세요',
  '후기': '직거래 또는 계약 경험 공유',
}

export default function WritePage() {
  const router = useRouter()
  const [category, setCategory] = useState<Category>('자유')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Supabase에 저장
    await new Promise(r => setTimeout(r, 800))
    alert('게시글이 등록되었습니다!')
    router.push('/community')
    setLoading(false)
  }

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      <div className="container-main py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/community" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ChevronLeft size={20} style={{ color: '#6C757D' }} />
          </Link>
          <h1 className="text-xl font-extrabold" style={{ color: '#1A1A2E' }}>글쓰기</h1>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>카테고리</label>
              <div className="grid grid-cols-4 gap-2">
                {(['자유', '정보', 'Q&A', '후기'] as const).map(cat => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)}
                    className="py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: category === cat ? '#FF6B35' : '#F8F9FA',
                      color: category === cat ? 'white' : '#6C757D',
                      border: `2px solid ${category === cat ? '#FF6B35' : 'transparent'}`,
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: '#ADB5BD' }}>{categoryDesc[category]}</p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>제목</label>
              <input type="text" className="input-field" placeholder="제목을 입력하세요 (5자 이상)"
                value={title} onChange={e => setTitle(e.target.value)} minLength={5} required />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>내용</label>
              <textarea className="input-field" rows={12}
                placeholder="내용을 자세히 작성해 주세요.&#10;&#10;허위 정보나 광고성 게시글은 삭제될 수 있습니다."
                value={content} onChange={e => setContent(e.target.value)} minLength={20} required />
              <p className="text-xs mt-1" style={{ color: '#ADB5BD' }}>{content.length}자</p>
            </div>

            <div className="flex gap-3">
              <Link href="/community" className="btn-ghost flex-1 justify-center">취소</Link>
              <button type="submit" disabled={loading || title.length < 5 || content.length < 20}
                className="btn-primary flex-1 justify-center"
                style={{ opacity: loading || title.length < 5 || content.length < 20 ? 0.6 : 1 }}>
                <PenLine size={15} />
                {loading ? '등록 중...' : '게시글 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
