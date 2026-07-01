'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle, FileText, Shield, BookOpen, ExternalLink,
  Phone, Home, Search, ArrowRight, Check, Info, AlertCircle, HelpCircle
} from 'lucide-react'

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'newbie' | 'fraud' | 'registry' | 'checklist'>('newbie')
  const [registryDetailTab, setRegistryDetailTab] = useState<'pyoje' | 'gap' | 'eul'>('pyoje')
  const [checkedList, setCheckedList] = useState<string[]>([])

  // 체크박스 토글 함수
  const toggleCheckItem = (item: string) => {
    if (checkedList.includes(item)) {
      setCheckedList(checkedList.filter(i => i !== item))
    } else {
      setCheckedList([...checkedList, item])
    }
  }

  // 가이드 데이터
  const newbieSteps = [
    { step: '01', title: '예산 계획 및 자금 설계', desc: '월세뿐만 아니라 보증금 이자, 관리비, 각종 세금, 공과금과 생활비를 꼼꼼히 설계하세요. 일반적으로 주거비 지출은 월 소득의 30% 이내를 권장합니다.' },
    { step: '02', title: '희망 조건 정의', desc: '직장/학교와의 통근·통학 거리, 가까운 지하철역, 생활 인프라(편의점, 대형마트, 대형병원 등), 치안 상태를 파악하여 나만의 타협 불가능한 1순위 조건을 정하세요.' },
    { step: '03', title: '방방 직거래 매물 검색', desc: '허위 매물 없는 방방 플랫폼에서 필터를 활용해 원하는 전·월세 매물을 탐색합니다. 중개수수료 부담이 없어 첫 독립 예산을 획기적으로 아낄 수 있습니다.' },
    { step: '04', title: '직접 방문(임장) 및 실물 검증', desc: '반드시 낮과 밤에 각각 방문하여 수압(싱크대/화장실 동시에 틀기), 벽면 결로나 누수 자국, 방음 및 채광 상태를 눈으로 확인하고, 채광은 정오 전후로 관찰하는 것이 좋습니다.' },
    { step: '05', title: '공식 서류 열람', desc: '계약 전 대법원 인터넷등기소에서 등기부등본을, 정부24에서 건축물대장을 발급받아 임대인 정보와 압류, 선순위 근저당이 과다하지 않은지 1차 확인합니다.' },
    { step: '06', title: '계약서 작성 및 특약 조율', desc: '집주인과 마주하여 권리 관계 및 약정 사항을 꼼꼼하게 대조합니다. 구두 합의한 모든 조건(수리 약정 등)은 계약서의 특약 조항으로 명문화해야 법적 효력이 생깁니다.' },
    { step: '07', title: '잔금 치르기 및 대항력 확보', desc: '잔금을 치르는 날 오전, 한 번 더 등기부등본을 떼어 변동이 없는지 체크한 후 이사 당일 주민센터나 정부24에서 즉시 전입신고를 하고 확정일자를 부여받아 대항력을 확보합니다.' }
  ]

  const fraudChecks = [
    {
      title: '깡통전세 예방 (전세가율 대조)',
      desc: '해당 매물이 있는 지역의 평균 매매가 대비 전세가 비율(전세가율)이 70~80% 이상이라면 깡통전세 위험군입니다. 집값이 조금만 내려가도 만기 시 보증금을 돌려받지 못하는 상황이 발생할 수 있습니다.',
      badge: '위험성 상',
      color: '#DC3545'
    },
    {
      title: '선순위 채권액 및 임차인 보증금 합산',
      desc: '등기부등본의 근저당권 채권최고액과 앞서 입주한 임차인들의 보증금 합계가 매물 감정가(또는 실거래가)의 60%를 초과하는지 계산하세요. 경매에 넘어갈 경우 내 보증금이 후순위로 밀려 변제받지 못할 수 있습니다.',
      badge: '필수 체크',
      color: '#FF6B35'
    },
    {
      title: '임대인(소유자)의 세금 체납 여부 확인',
      desc: '국세나 지방세 체납액은 등기부에 바로 기재되지 않지만 경매 시 보증금보다 먼저 징수됩니다. 집주인에게 국세·지방세 완납증명서 교부를 요청하거나 미납국세열람동의서를 꼭 요구하여 체납 사실이 없는지 확인하세요.',
      badge: '사기 예방 핵심',
      color: '#28A745'
    },
    {
      title: '대리인 계약 시 위임 서류 진위 확인',
      desc: '집주인이 아닌 대리인과 계약할 경우, 임대인의 인감증명서(본인서명사실확인서), 위임장 원본, 임대인 본인 신분증 사본을 반드시 확인 및 회수하고 집주인과 직접 영상통화 등을 통해 위임 의사를 더블 체크해야 합니다.',
      badge: '대리 계약 필수',
      color: '#6F42C1'
    },
    {
      title: 'HUG 전세보증금 반환보증 가입 조건 확인',
      desc: '가장 강력한 방패는 HUG 주택도시보증공사 등의 보증보험입니다. 계약서 특약에 "보증보험 가입 불가능 시 계약은 무효로 하고 계약금 전액을 반환한다"는 특약을 무조건 추가해 계약을 진행하는 것이 현명합니다.',
      badge: '안전 보증',
      color: '#007BFF'
    }
  ]

  const checklistData = {
    before: [
      '대법원 인터넷등기소에서 당일 발행된 최신 등기부등본 확인하기',
      '정부24에서 건축물대장을 발급받아 위반(불법) 건축물 표시 여부 확인하기',
      '국토교통부 실거래가 시스템 또는 네이버 부동산을 통해 해당 매물의 최근 실거래 시세 파악하기',
      '등기부 갑구에 가압류, 압류, 가등기, 신탁 설정 등이 없는지 확인하기',
      '등기부 을구에 적힌 채권최고액(은행 대출) 확인하고 매매 시세의 30% 이하인지 대조하기',
      '임대인이 제시한 신분증의 성명, 주민등록번호가 등기부상 소유자와 완벽히 일치하는지 비교하기',
      '정부24(주민등록증) 또는 도로교통공단(운전면허증)을 통해 집주인 신분증의 위조 여부 검증하기',
      '방문 시 보일러 작동 상태, 수압, 누수 자국, 배수, 창문 시큐리티 등 하자 상태 촬영 및 체크하기'
    ],
    contract: [
      '모든 계약금 및 잔금은 반드시 임대인(소유자) 본인 명의의 은행 계좌로만 송금하기',
      '계약서 특약 조항에 "전입신고 효력 발생 전까지 저당권 설정 등 권리 관계 변동을 금지한다" 명시하기',
      '계약서 특약 조항에 "임차인의 책임 없는 사유로 전세보증보험 가입이 거절될 경우 계약은 즉시 무효로 하고 임대인은 보증금 전액을 반환한다" 추가하기',
      '임대인의 세금(국세, 지방세) 체납이 없음을 확인하는 완납 서류 요구 및 확인하기',
      '도장을 찍기 전 계약서에 기재된 보증금 금액 한글/숫자 표기 및 주소가 정확한지 마지막 재확인하기',
      '계약금 송금 후 즉시 임대인의 날인이 포함된 공식 영수증 수령 및 보관하기'
    ],
    after: [
      '잔금을 치르는 날 아침, 등기부등본을 재발급받아 계약 체결 후 추가적인 권리 변동이 없는지 체크하기',
      '이사 당일 관할 행정복지센터 방문 또는 정부24를 통해 신속하게 전입신고 완료하기',
      '전입신고와 동시에 확정일자를 즉시 부여받아 법적인 우선변제권 획득하기',
      '이사 후 가구 배치 전 하자가 있는 부분(벽지 손상, 파손 등) 사진/동영상을 촬영하여 날짜 증거 남기고 집주인에게 통보하기',
      '주택 임대차 신고(월세 30만원 초과 또는 보증금 6000만원 초과 시 필수) 잔금 후 30일 이내에 수행하기',
      '최종 입주 완료 후 1개월 이내에 HUG 주택도시보증공사 등을 통해 전세보증금 반환보증보험 가입 진행하기'
    ]
  }

  const agencies = [
    { name: 'HUG 전세피해지원센터', phone: '1670-1004', desc: '전세 사기 전문 상담, 법률 및 금융 지원 연계', color: '#DC3545' },
    { name: '주택도시보증공사(HUG)', phone: '1566-9009', desc: '전세보증금 반환보증 가입 및 사후 이행 청구 상담', color: '#007BFF' },
    { name: '대한법률구조공단', phone: '132', desc: '국민을 위한 무료 법률 상담 및 임대차 분쟁 조정', color: '#17A2B8' },
    { name: '국토교통부 콜센터', phone: '1599-0001', desc: '부동산 정책, 실거래 신고 및 법률 유권해석 문의', color: '#28A745' }
  ]

  return (
    <div style={{ background: '#FFFDF9', minHeight: '100vh' }}>
      
      {/* ══════════════ HERO BANNER ══════════════ */}
      <div className="relative overflow-hidden py-16 md:py-20 text-center rounded-b-[2.5rem] md:rounded-b-[3.5rem]" 
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,53,0.15),transparent_60%)] pointer-events-none" />

        <div className="container-main relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black mb-4"
            style={{ background: 'rgba(255,107,53,0.15)', color: '#FF8C5A' }}>
            <Shield size={12} />
            사회초년생을 위한 직거래 안전 지침서
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            안전 직거래 가이드
          </h1>
          <p className="text-sm md:text-base max-w-xl mx-auto text-gray-300 leading-relaxed">
            등기부등본 해독부터 전세사기 예방 팁, 이사 후 필수 체크리스트까지<br />
            트렌디하고 직관적인 가이드로 사기 걱정 없는 안전한 거래를 시작하세요.
          </p>
        </div>
      </div>

      {/* ══════════════ INTERACTIVE CATEGORY TABS ══════════════ */}
      <div className="container-main -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] p-2 md:p-3 border border-gray-100 flex flex-wrap md:flex-nowrap gap-1">
          {[
            { id: 'newbie', label: '부동산 입문 가이드', icon: Home, color: '#FF6B35' },
            { id: 'fraud', label: '전세사기 예방 비법', icon: AlertTriangle, color: '#DC3545' },
            { id: 'registry', label: '등기부등본 완벽 해독', icon: FileText, color: '#17A2B8' },
            { id: 'checklist', label: '직거래 체크리스트', icon: Shield, color: '#28A745' }
          ].map(tab => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs md:text-sm font-black transition-all duration-300 active:scale-95"
                style={{
                  background: isSelected ? tab.color : 'transparent',
                  color: isSelected ? 'white' : '#6C757D'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ══════════════ TAB CONTENT SECTION ══════════════ */}
      <div className="container-main py-12">
        <div className="bg-white rounded-[2rem] border border-gray-100/90 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-6 md:p-10">
          
          {/* TAB 1: 사회초년생 부동산 입문 가이드 */}
          {activeTab === 'newbie' && (
            <div>
              <div className="mb-8">
                <span className="text-xs font-black text-[#FF6B35] uppercase tracking-wider">A to Z Roadmap</span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-1">방 구하기 로드맵 7단계</h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">첫 독립을 준비하는 청년을 위해 이사 준비 과정을 정밀하게 기획했습니다.</p>
              </div>

              {/* Vertical Step Timeline */}
              <div className="relative pl-6 border-l-2 border-orange-100 space-y-8 ml-2">
                {newbieSteps.map((stepData, idx) => (
                  <div key={idx} className="relative group">
                    
                    {/* Circle Bullet */}
                    <div className="absolute -left-[35px] top-0.5 w-6 h-6 rounded-full bg-white border-2 border-[#FF6B35] flex items-center justify-center text-[10px] font-black text-[#FF6B35] group-hover:bg-[#FF6B35] group-hover:text-white transition-all duration-300">
                      {idx + 1}
                    </div>

                    <div className="bg-orange-50/20 hover:bg-[#FFF6F2]/45 rounded-2xl p-5 border border-orange-50 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-black text-[#FF6B35]">{stepData.step}</span>
                        <h4 className="font-extrabold text-sm md:text-base text-gray-900">{stepData.title}</h4>
                      </div>
                      <p className="text-xs md:text-sm leading-relaxed text-gray-500">{stepData.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 전세사기 예방 완전 가이드 */}
          {activeTab === 'fraud' && (
            <div>
              <div className="mb-8">
                <span className="text-xs font-black text-[#DC3545] uppercase tracking-wider">Defend Rules</span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-1">보증금을 지키는 5대 방어 전략</h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">소중한 전세 보증금을 지켜내기 위한 최상위급 안전 확인 핵심입니다.</p>
              </div>

              <div className="space-y-4">
                {fraudChecks.map((card, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-red-50 hover:shadow-md transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, rgba(220,53,69,0.02) 0%, rgba(255,255,255,1) 100%)' }}>
                    <div className="w-10 h-10 rounded-xl bg-red-50/80 text-[#DC3545] flex items-center justify-center flex-shrink-0 mt-0.5 border border-red-100/50">
                      <AlertCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className="font-extrabold text-sm md:text-base text-gray-900">{card.title}</h4>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black text-white" style={{ background: card.color }}>
                          {card.badge}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm leading-relaxed text-gray-500">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 등기부등본 완벽 해석 (Mock Interactive Document) */}
          {activeTab === 'registry' && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-black text-[#17A2B8] uppercase tracking-wider">Interactive Document Decoder</span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-1">등기부등본 3분 완전 해독기</h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">모의 등기 서류 탭을 눌러 해당 영역에서 반드시 짚고 가야 할 핵심 정보를 확인하세요.</p>
              </div>

              {/* Document Tab Switcher */}
              <div className="flex bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-1.5 mb-6 max-w-md">
                {(['pyoje', 'gap', 'eul'] as const).map(dTab => (
                  <button
                    key={dTab}
                    onClick={() => setRegistryDetailTab(dTab)}
                    className="flex-1 py-2 rounded-xl text-xs font-black transition-all active:scale-95"
                    style={{
                      background: registryDetailTab === dTab ? '#17A2B8' : 'transparent',
                      color: registryDetailTab === dTab ? 'white' : '#64748B'
                    }}
                  >
                    {dTab === 'pyoje' ? '1. 표제부' : dTab === 'gap' ? '2. 갑구' : '3. 을구'}
                  </button>
                ))}
              </div>

              {/* Mock Registry Document Box */}
              <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                
                {/* Official header design */}
                <div className="bg-[#EDF2F7] px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-black text-[#2B6CB0]">임대인 제공 서류 검증</span>
                  <span className="text-[10px] font-bold text-gray-400">발행번호: 2026-0701-0900-1124</span>
                </div>

                <div className="p-4 md:p-6 overflow-x-auto">
                  
                  {/* PYOJEBU (표제부) */}
                  {registryDetailTab === 'pyoje' && (
                    <div className="min-w-[600px] space-y-4">
                      <div className="border-l-4 border-[#17A2B8] pl-3 py-1 mb-4">
                        <h4 className="font-extrabold text-sm text-[#1A202C]">【표제부】 (건물의 표시)</h4>
                        <p className="text-xs text-gray-400">부동산의 소재지, 면적, 층수, 용도 등 외형 정보가 표시됩니다.</p>
                      </div>

                      <table className="w-full text-xs text-left border-collapse border border-slate-200">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                            <th className="p-3 border-r border-slate-200 w-16">표시번호</th>
                            <th className="p-3 border-r border-slate-200 w-28">접수</th>
                            <th className="p-3 border-r border-slate-200">소재지번, 건물명칭 및 번호</th>
                            <th className="p-3">건물내역</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="p-3 border-r border-slate-200 font-bold text-center">1</td>
                            <td className="p-3 border-r border-slate-200">2021년 3월 15일</td>
                            <td className="p-3 border-r border-slate-200 font-bold text-blue-600">서울특별시 마포구 합정동 123-45 번지 [합정팰리스]</td>
                            <td className="p-3">철근콘크리트구조 공동주택 5층 내 3층 302호 면적: 33.5㎡</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-4 p-4 rounded-xl bg-cyan-50/50 border border-cyan-100 flex gap-3">
                        <Info size={16} className="text-[#17A2B8] flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-black text-slate-800">핵심 체크포인트: 소재지 주소 대조</h5>
                          <p className="text-[11px] leading-relaxed text-gray-500 mt-1">
                            표제부에 적힌 **동·호수 정보**가 실제 여러분이 현장 계약서에 기재하는 상세 주소와 자판 단위 하나까지 정확히 매칭하는지 대조하세요. 건축물대장상 '근린생활시설(상가)'로 되어있으면서 무단 개조하여 주거용으로 쓰는 위반 건축물인지도 함께 검사해야 합니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GAPGU (갑구) */}
                  {registryDetailTab === 'gap' && (
                    <div className="min-w-[600px] space-y-4">
                      <div className="border-l-4 border-red-500 pl-3 py-1 mb-4">
                        <h4 className="font-extrabold text-sm text-[#1A202C]">【갑구】 (소유권에 관한 사항)</h4>
                        <p className="text-xs text-gray-400">부동산의 현재 주인 정보 및 압류/경매 등 소유권 위협 사항이 등기됩니다.</p>
                      </div>

                      <table className="w-full text-xs text-left border-collapse border border-slate-200">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                            <th className="p-3 border-r border-slate-200 w-16">순위번호</th>
                            <th className="p-3 border-r border-slate-200 w-28">등기목적</th>
                            <th className="p-3 border-r border-slate-200 w-28">접수</th>
                            <th className="p-3">권리자 및 기타사항</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="p-3 border-r border-slate-200 font-bold text-center">1</td>
                            <td className="p-3 border-r border-slate-200">소유권 이전</td>
                            <td className="p-3 border-r border-slate-200">2021년 3월 15일</td>
                            <td className="p-3 font-semibold text-gray-700">공유자 홍길동(800101-1******) 지분 2분의 1, 홍길순(851010-2******) 지분 2분의 1</td>
                          </tr>
                          <tr className="bg-red-50/20 border-b border-red-100">
                            <td className="p-3 border-r border-slate-200 font-bold text-center text-red-600">2</td>
                            <td className="p-3 border-r border-slate-200 font-extrabold text-red-600">가압류 (위험!)</td>
                            <td className="p-3 border-r border-slate-200 text-red-500">2026년 5월 20일</td>
                            <td className="p-3 font-bold text-red-600">채권자 마포세무서 (체납처분에 의한 압류 처분 등)</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3">
                        <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-black text-red-800">핵심 체크포인트: 가압류, 임차권등기, 가등기 확인</h5>
                          <p className="text-[11px] leading-relaxed text-red-700 mt-1">
                            갑구에 **압류, 가압류, 가등기, 경매개시결정, 신탁** 등의 단어가 하나라도 보인다면 계약을 즉시 멈추거나 계약금을 절대로 지급하지 마세요. 또한 등기부에 표기된 소유자의 성함, 주민등록번호 앞자리가 계약서상 임대인 신분증과 완전히 대조되는지 정밀 검토하세요.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EULGU (을구) */}
                  {registryDetailTab === 'eul' && (
                    <div className="min-w-[600px] space-y-4">
                      <div className="border-l-4 border-yellow-500 pl-3 py-1 mb-4">
                        <h4 className="font-extrabold text-sm text-[#1A202C]">【을구】 (소유권 외의 권리에 관한 사항)</h4>
                        <p className="text-xs text-gray-400">해당 부동산에 걸려 있는 담보 대출 및 대출 금액 한도 정보가 등기됩니다.</p>
                      </div>

                      <table className="w-full text-xs text-left border-collapse border border-slate-200">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                            <th className="p-3 border-r border-slate-200 w-16">순위번호</th>
                            <th className="p-3 border-r border-slate-200 w-28">등기목적</th>
                            <th className="p-3 border-r border-slate-200 w-28">접수</th>
                            <th className="p-3">권리자 및 기타사항</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="p-3 border-r border-slate-200 font-bold text-center">1</td>
                            <td className="p-3 border-r border-slate-200 font-bold text-yellow-600">근저당설정</td>
                            <td className="p-3 border-r border-slate-200">2021년 3월 15일</td>
                            <td className="p-3 font-semibold text-slate-800">채권최고액 금120,000,000원 (근저당권자: 한국은행)</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-4 p-4 rounded-xl bg-yellow-50/50 border border-yellow-100/80 flex gap-3">
                        <Info size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-black text-slate-800">핵심 체크포인트: 채권최고액 확인</h5>
                          <p className="text-[11px] leading-relaxed text-gray-500 mt-1">
                            근저당권의 **채권최고액**을 확인하세요. 채권최고액은 실제 대출금의 약 120% 수준으로 설정됩니다. 이 채권최고액에 들어올 임대 보증금 합계를 더한 금액이 주택 매매가의 60%를 초과하면 나중에 전세를 반환받을 때 보장 확률이 크게 떨어질 수 있으니 보증보험 설계가 필수적입니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 계약 전/후 체크리스트 20 (Interactive Checkbox) */}
          {activeTab === 'checklist' && (
            <div>
              <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-black text-[#28A745] uppercase tracking-wider">Action Checklists</span>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-1">실시간 계약 검토 체크리스트</h2>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">요소별 핵심 항목을 직접 체크하며 완벽하게 자가진단해 보세요.</p>
                </div>
                {/* Progress status */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2 text-right">
                  <span className="text-xs font-bold text-emerald-800">검토 완료율: </span>
                  <span className="text-base font-extrabold text-emerald-600">
                    {Math.round((checkedList.length / (checklistData.before.length + checklistData.contract.length + checklistData.after.length)) * 100)}%
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">({checkedList.length} / 20개 점검)</span>
                </div>
              </div>

              {/* 3 Steps Checklists */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Before Contract */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-red-100 pb-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <h3 className="font-extrabold text-sm text-gray-900">1단계. 계약서 도장 날인 전</h3>
                  </div>
                  <div className="space-y-2.5">
                    {checklistData.before.map((item, i) => (
                      <label key={i} className="flex items-start gap-3 p-3 bg-[#FBFDFB] hover:bg-emerald-50/20 border border-gray-100 hover:border-emerald-100/40 rounded-2xl cursor-pointer transition-all duration-200 select-none">
                        <input
                          type="checkbox"
                          checked={checkedList.includes(item)}
                          onChange={() => toggleCheckItem(item)}
                          className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400 accent-emerald-500 mt-0.5 flex-shrink-0"
                        />
                        <span className={`text-[11px] leading-relaxed transition-all ${
                          checkedList.includes(item) ? 'line-through text-gray-300' : 'text-gray-600 font-medium'
                        }`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* During Contract */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-orange-100 pb-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <h3 className="font-extrabold text-sm text-gray-900">2단계. 계약 테이블 작성 시</h3>
                  </div>
                  <div className="space-y-2.5">
                    {checklistData.contract.map((item, i) => (
                      <label key={i} className="flex items-start gap-3 p-3 bg-[#FBFDFB] hover:bg-emerald-50/20 border border-gray-100 hover:border-emerald-100/40 rounded-2xl cursor-pointer transition-all duration-200 select-none">
                        <input
                          type="checkbox"
                          checked={checkedList.includes(item)}
                          onChange={() => toggleCheckItem(item)}
                          className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400 accent-emerald-500 mt-0.5 flex-shrink-0"
                        />
                        <span className={`text-[11px] leading-relaxed transition-all ${
                          checkedList.includes(item) ? 'line-through text-gray-300' : 'text-gray-600 font-medium'
                        }`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* After Contract */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-emerald-100 pb-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="font-extrabold text-sm text-gray-900">3단계. 계약서 날인 잔금 후</h3>
                  </div>
                  <div className="space-y-2.5">
                    {checklistData.after.map((item, i) => (
                      <label key={i} className="flex items-start gap-3 p-3 bg-[#FBFDFB] hover:bg-emerald-50/20 border border-gray-100 hover:border-emerald-100/40 rounded-2xl cursor-pointer transition-all duration-200 select-none">
                        <input
                          type="checkbox"
                          checked={checkedList.includes(item)}
                          onChange={() => toggleCheckItem(item)}
                          className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400 accent-emerald-500 mt-0.5 flex-shrink-0"
                        />
                        <span className={`text-[11px] leading-relaxed transition-all ${
                          checkedList.includes(item) ? 'line-through text-gray-300' : 'text-gray-600 font-medium'
                        }`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══════════════ EMERGENCY CONTACTS ══════════════ */}
      <div className="container-main pb-8">
        <div className="bg-white rounded-[2rem] border border-gray-100/90 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
              <Phone size={18} className="text-[#DC3545]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-gray-900">긴급 전세 피해 상담 및 정부 공식 연락처</h2>
              <p className="text-xs text-gray-400">보증금 미반환 사고나 권리관계 분쟁 발생 시 즉시 전문가의 무료 지원을 받으세요.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agencies.map((agency, idx) => (
              <div key={idx} className="bg-gray-50/50 border border-[#F2ECE9]/55 hover:border-red-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#2D2D2D] mb-1">{agency.name}</h4>
                  <p className="text-[10px] text-gray-400 leading-normal mb-4">{agency.desc}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
                  <span className="text-[10px] font-bold text-slate-400">전화번호</span>
                  <a href={`tel:${agency.phone}`} className="text-sm font-black transition-colors hover:underline" style={{ color: agency.color }}>
                    {agency.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ USEFUL OFFICIAL SITES ══════════════ */}
      <div className="container-main pb-20">
        <div className="bg-white rounded-[2rem] border border-gray-100/90 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-6 md:p-10">
          <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6">신뢰할 수 있는 공식 열람 사이트 바로가기</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: '대법원 인터넷등기소', url: 'https://www.iros.go.kr', desc: '등기부등본 열람 및 실시간 발급 (수수료 700원)', color: '#FF6B35' },
              { name: '국토교통부 실거래가 공개시스템', url: 'https://rt.molit.go.kr', desc: '지역별, 평형별 실제 최근 전·월세 실거래가 시세 확인', color: '#17A2B8' },
              { name: '정부24 민원포털', url: 'https://www.gov.kr', desc: '민원 전입신고 신청 및 확정일자 비대면 확인 가능', color: '#28A745' },
            ].map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:shadow-md border border-[#F2ECE9]/55 hover:border-[#FFCFC0]/60"
                style={{ background: 'linear-gradient(135deg, #FBFDFB 0%, #FFFFFF 100%)' }}>
                <div>
                  <h4 className="font-extrabold text-sm text-[#2D2D2D] group-hover:text-[#FF6B35] transition-colors">{link.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">{link.desc}</p>
                </div>
                <ExternalLink size={14} className="text-slate-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
