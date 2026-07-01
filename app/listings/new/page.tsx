'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, ChevronRight, Info, Home } from 'lucide-react'

type Step = 1 | 2 | 3

export default function NewListingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [type, setType] = useState<'전세' | '월세'>('월세')
  const [images, setImages] = useState<File[]>([])
  const [form, setForm] = useState({
    deposit: '',
    monthly_rent: '',
    address: '',
    address_detail: '',
    area: '',
    floor: '',
    total_floor: '',
    rooms: '2',
    bathrooms: '1',
    description: '',
    move_in_date: '',
    has_elevator: false,
    has_parking: false,
    has_balcony: false,
    heating_type: '개별난방',
  })

  const updateForm = (key: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const steps = [
    { num: 1, label: '기본 정보' },
    { num: 2, label: '상세 정보' },
    { num: 3, label: '사진 등록' },
  ]

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      <div className="container-main py-8 max-w-2xl">
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#1A1A2E' }}>매물 등록</h1>
        <p className="text-sm mb-8" style={{ color: '#6C757D' }}>
          중개수수료 없이 직접 매물을 등록하세요
        </p>

        {/* Step Indicator */}
        <div className="flex items-center mb-8">
          {steps.map(({ num, label }, i) => (
            <div key={num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                  style={{
                    background: step >= num ? '#FF6B35' : '#E9ECEF',
                    color: step >= num ? 'white' : '#ADB5BD',
                  }}>
                  {num}
                </div>
                <span className="text-xs mt-1 font-medium"
                  style={{ color: step >= num ? '#FF6B35' : '#ADB5BD' }}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-5"
                  style={{ background: step > num ? '#FF6B35' : '#E9ECEF' }} />
              )}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>
                  거래 유형 *
                </label>
                <div className="flex gap-3">
                  {(['전세', '월세'] as const).map(t => (
                    <button key={t} onClick={() => setType(t)}
                      className="flex-1 py-3 rounded-xl font-bold transition-all"
                      style={{
                        background: type === t ? '#FF6B35' : 'white',
                        color: type === t ? 'white' : '#6C757D',
                        border: `2px solid ${type === t ? '#FF6B35' : '#E9ECEF'}`,
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>
                  보증금 (만원) *
                </label>
                <input type="number" className="input-field" placeholder="예: 10000"
                  value={form.deposit} onChange={e => updateForm('deposit', e.target.value)} />
                {form.deposit && (
                  <p className="text-xs mt-1" style={{ color: '#FF6B35' }}>
                    = {Number(form.deposit) >= 10000
                      ? `${(Number(form.deposit) / 10000).toFixed(1)}억`
                      : `${Number(form.deposit).toLocaleString()}만`}원
                  </p>
                )}
              </div>

              {type === '월세' && (
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>
                    월 임대료 (만원) *
                  </label>
                  <input type="number" className="input-field" placeholder="예: 60"
                    value={form.monthly_rent} onChange={e => updateForm('monthly_rent', e.target.value)} />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>
                  주소 *
                </label>
                <input type="text" className="input-field mb-2" placeholder="도로명 주소 검색"
                  value={form.address} onChange={e => updateForm('address', e.target.value)} />
                <input type="text" className="input-field" placeholder="상세 주소 (동, 호수)"
                  value={form.address_detail} onChange={e => updateForm('address_detail', e.target.value)} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>면적(㎡) *</label>
                  <input type="number" className="input-field" placeholder="33.5"
                    value={form.area} onChange={e => updateForm('area', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>층수 *</label>
                  <input type="number" className="input-field" placeholder="3"
                    value={form.floor} onChange={e => updateForm('floor', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>전체층수</label>
                  <input type="number" className="input-field" placeholder="15"
                    value={form.total_floor} onChange={e => updateForm('total_floor', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Detail Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>방 수</label>
                  <select className="input-field" value={form.rooms} onChange={e => updateForm('rooms', e.target.value)}>
                    {['1', '2', '3', '4', '5+'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>욕실 수</label>
                  <select className="input-field" value={form.bathrooms} onChange={e => updateForm('bathrooms', e.target.value)}>
                    {['1', '2', '3+'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>입주 가능일</label>
                <input type="date" className="input-field"
                  value={form.move_in_date} onChange={e => updateForm('move_in_date', e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#1A1A2E' }}>옵션 및 시설</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'has_elevator', label: '엘리베이터' },
                    { key: 'has_parking', label: '주차장' },
                    { key: 'has_balcony', label: '발코니' },
                  ].map(({ key, label }) => (
                    <button key={key}
                      onClick={() => updateForm(key as keyof typeof form, !form[key as keyof typeof form])}
                      className="py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: form[key as keyof typeof form] ? 'rgba(255,107,53,0.1)' : '#F8F9FA',
                        color: form[key as keyof typeof form] ? '#FF6B35' : '#6C757D',
                        border: `2px solid ${form[key as keyof typeof form] ? '#FF6B35' : 'transparent'}`,
                      }}>
                      {form[key as keyof typeof form] ? '✓ ' : ''}{label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>
                  매물 설명 *
                </label>
                <textarea
                  className="input-field"
                  rows={6}
                  placeholder="매물의 장점, 주변 환경, 특이사항 등을 자유롭게 작성해 주세요.&#10;(예: 남향, 햇빛 잘 들어옴, 지하철역 도보 5분...)"
                  value={form.description}
                  onChange={e => updateForm('description', e.target.value)}
                />
                <p className="text-xs mt-1" style={{ color: '#ADB5BD' }}>{form.description.length} / 2000자</p>
              </div>

              <div className="p-4 rounded-xl flex gap-3"
                style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.15)' }}>
                <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#FF6B35' }} />
                <p className="text-xs leading-relaxed" style={{ color: '#6C757D' }}>
                  허위 매물 등록 시 계정이 정지됩니다. 등기부등본과 실제 내용이 일치하는 정보만 등록해 주세요.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A2E' }}>
                  매물 사진 (최대 10장)
                </label>
                <p className="text-xs mb-4" style={{ color: '#ADB5BD' }}>
                  첫 번째 사진이 대표 이미지로 사용됩니다. 깔끔한 사진일수록 연락이 많이 와요!
                </p>
                <label className="block w-full h-40 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all hover:border-orange-400"
                  style={{ borderColor: '#E9ECEF' }}>
                  <Upload size={32} className="mb-2" style={{ color: '#ADB5BD' }} />
                  <p className="text-sm font-medium" style={{ color: '#6C757D' }}>사진을 클릭하거나 드래그하여 업로드</p>
                  <p className="text-xs mt-1" style={{ color: '#ADB5BD' }}>JPG, PNG, WEBP (최대 10MB)</p>
                  <input type="file" multiple accept="image/*" className="hidden"
                    onChange={e => {
                      if (e.target.files) {
                        setImages(prev => [...prev, ...Array.from(e.target.files!)])
                      }
                    }} />
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {images.map((file, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden"
                        style={{ background: '#F8F9FA' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Home size={24} style={{ color: '#ADB5BD' }} />
                        </div>
                        {i === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 text-center text-xs py-1"
                            style={{ background: 'rgba(255,107,53,0.9)', color: 'white' }}>
                            대표
                          </div>
                        )}
                        <button
                          onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(0,0,0,0.5)' }}>
                          <X size={10} color="white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl" style={{ background: '#F8F9FA' }}>
                <p className="text-sm font-bold mb-3" style={{ color: '#1A1A2E' }}>등록 정보 확인</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: '#6C757D' }}>거래유형</span>
                    <span className="font-semibold">{type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#6C757D' }}>보증금</span>
                    <span className="font-semibold">{Number(form.deposit).toLocaleString()}만원</span>
                  </div>
                  {type === '월세' && (
                    <div className="flex justify-between">
                      <span style={{ color: '#6C757D' }}>월세</span>
                      <span className="font-semibold">{Number(form.monthly_rent).toLocaleString()}만원</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: '#6C757D' }}>주소</span>
                    <span className="font-semibold text-right max-w-48">{form.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#6C757D' }}>면적</span>
                    <span className="font-semibold">{form.area}㎡ ({form.floor}층)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep(s => (s - 1) as Step)} className="btn-ghost flex-1 justify-center">
                이전
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => (s + 1) as Step)} className="btn-primary flex-1 justify-center">
                다음 <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => alert('매물 등록 완료! (Supabase 연동 후 실제 저장됩니다)')}
                className="btn-primary flex-1 justify-center"
              >
                매물 등록 완료
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
