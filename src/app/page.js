"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

const sidebarMenus = [
  {
    label: "MAIN",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/></svg>
    ),
  },
  {
    label: "스케줄",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
    ),
  },
  {
    label: "구인",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1"/></svg>
    ),
  },
  {
    label: "구직",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2"/></svg>
    ),
  },
  {
    label: "외주",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20v-6M12 4v4m0 0a4 4 0 110 8 4 4 0 010-8z"/></svg>
    ),
  },
  {
    label: "실측",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10v10H7z"/></svg>
    ),
  },
  {
    label: "배치",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>
    ),
  },
  {
    label: "견적",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
    ),
  },
  {
    label: "주문내역",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
    ),
  },
];

// 일정 데이터 (날짜별)
const eventsByDate = {
  "2025-06-11": [
    { title: "Meeting", time: "12:30 pm", description: "Team meeting about project status." },
    { title: "Conference", time: "3:30 pm", description: "Online conference with partners." },
  ],
  "2025-06-17": [
    { title: "Picnic", time: "8:30 am", description: "Company picnic at the park." },
    { title: "Assignment", time: "9:30 pm", description: "Submit project assignment." },
  ],
  "2025-06-30": [
    { title: "프로젝트 리뷰", time: "2:00 pm", description: "분기별 프로젝트 진행 상황 리뷰 회의" },
    { title: "클라이언트 미팅", time: "4:30 pm", description: "신규 프로젝트 관련 클라이언트 미팅" },
  ],
};

// 한국 공휴일(월-일 문자열 배열)
const koreanHolidays = [
  "1-1",   // 신정
  "3-1",   // 삼일절
  "5-5",   // 어린이날
  "6-6",   // 현충일
  "8-15",  // 광복절
  "10-3",  // 개천절
  "10-9",  // 한글날
  "12-25", // 성탄절
];

// 알림/쪽지/포인트 더미 데이터
const notifications = [
  { id: 1, text: "새로운 댓글이 달렸습니다.", read: false },
  { id: 2, text: "결제가 완료되었습니다.", read: true },
  { id: 3, text: "새로운 공지사항이 있습니다.", read: false },
];
const messages = [
  { id: 1, text: "안녕하세요! 문의드립니다.", read: false },
  { id: 2, text: "내일 회의 일정 확인 부탁드립니다.", read: true },
];
const pointHistory = [
  { id: 1, text: "+10,000P 적립 (이벤트)", date: "2024-07-01" },
  { id: 2, text: "-5,000P 사용 (구매)", date: "2024-07-02" },
];
const unreadNoti = notifications.filter(n => !n.read).length;
const unreadMsg = messages.filter(m => !m.read).length;
const userPoint = 50000;

// 차트 설정 - 무채색 그레이 톤
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#374151"
  },
  mobile: {
    label: "Mobile", 
    color: "#6b7280"
  },
  progress: {
    label: "진행중",
    color: "#9ca3af"
  },
  completed: {
    label: "완료",
    color: "#d1d5db"
  }
};

// 구인-지원진행중, 구인-진행중용 Stacked 차트 데이터
const stackedChartData = [
  { month: "Jan", inProgress: 12, applicants: 8 },
  { month: "Feb", inProgress: 15, applicants: 10 },
  { month: "Mar", inProgress: 10, applicants: 14 },
  { month: "Apr", inProgress: 18, applicants: 12 },
  { month: "May", inProgress: 14, applicants: 16 },
  { month: "Jun", inProgress: 16, applicants: 11 }
];

// 구인-채택완료, 구인-완료용 Label 차트 데이터
const labelChartData = [
  { month: "Jan", adopted: 5, completed: 8 },
  { month: "Feb", adopted: 8, completed: 12 },
  { month: "Mar", adopted: 6, completed: 10 },
  { month: "Apr", adopted: 10, completed: 15 },
  { month: "May", adopted: 7, completed: 11 },
  { month: "Jun", adopted: 9, completed: 13 }
];

// 수행 숙련도 도넛 차트 데이터 - 무채색 그레이 톤
const skillLevelData = [
  { name: "조공", value: 35, fill: "#374151" },
  { name: "준기공", value: 45, fill: "#6b7280" },
  { name: "기공", value: 20, fill: "#9ca3af" }
];

// 평균 임금 게이지 차트 데이터
const avgWageGaugeData = [
  { name: "평균임금", value: 456, maxValue: 600, unit: "만원" }
];

// 게이지 차트 색상 구간 설정 - 무채색 그레이 톤
const gaugeColorRanges = [
  { min: 0, max: 200, color: "#6b7280" },    // 진한 회색 (낮음)
  { min: 200, max: 400, color: "#9ca3af" },  // 중간 회색 (보통)
  { min: 400, max: 600, color: "#374151" }   // 진한 회색 (높음)
];

// 차트 색상 배열 - 무채색 그레이 톤
const COLORS = ['#374151', '#6b7280', '#9ca3af'];


function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const matrix = [];
  let day = 1 - firstDay.getDay();
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++, day++) {
      let d = new Date(year, month, day);
      const key = d.toISOString().slice(0, 10);
      week.push({
        date: d,
        isCurrentMonth: d.getMonth() === month,
        isToday:
          d.toDateString() === new Date().toDateString() && d.getMonth() === month,
        hasEvent: !!eventsByDate[key],
        key,
      });
    }
    matrix.push(week);
  }
  return matrix;
}

function CalendarCard() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(today);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEvent, setDialogEvent] = useState(null);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const matrix = getMonthMatrix(year, month);
  const selectedKey = selected.toISOString().slice(0, 10);
  const events = eventsByDate[selectedKey] || [];


  // 월을 '7월' 형식으로 반환
  const monthLabel = `${month + 1}월`;

  // 공휴일 여부 체크 함수
  function isHoliday(date) {
    // 일요일
    if (date.getDay() === 0) return true;
    // 한국 공휴일
    const key = `${date.getMonth() + 1}-${date.getDate()}`;
    return koreanHolidays.includes(key);
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => {
            if (month === 0) {
              setMonth(11);
              setYear((y) => y - 1);
            } else {
              setMonth((m) => m - 1);
            }
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{year}</span>
          <span className="text-base font-semibold text-gray-600 tracking-widest">{monthLabel}</span>
        </div>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => {
            if (month === 11) {
              setMonth(0);
              setYear((y) => y + 1);
            } else {
              setMonth((m) => m + 1);
            }
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      {/* 월 네비게이션(공간만 유지, 내용은 삭제) */}
      <div className="flex justify-between px-6 text-xs font-semibold text-gray-500 mb-2" style={{ minHeight: 24 }}></div>
      {/* 캘린더 표 */}
      <div className="flex flex-col px-4 pb-0">
        <table className="w-full text-center text-sm select-none">
          <thead>
            <tr className="text-gray-400">
              <th className="font-normal text-gray-500">S</th>
              <th className="font-normal">M</th>
              <th className="font-normal">T</th>
              <th className="font-normal">W</th>
              <th className="font-normal">T</th>
              <th className="font-normal">F</th>
              <th className="font-normal">S</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {matrix.map((week, i) => (
              <tr key={i}>
                {week.map((d, j) => {
                  const isRed = isHoliday(d.date);
                  const isBlue = d.date.getDay() === 6 && d.isCurrentMonth && !isRed;
                  return (
                    <td
                      key={j}
                      className={`h-10 w-10 p-0 relative cursor-pointer rounded-full transition
                        ${d.isCurrentMonth ? "" : "text-gray-300"}
                        ${d.isToday ? "bg-gray-200 text-gray-800 font-bold" : ""}
                        ${selected && d.date.toDateString() === selected.toDateString() ? "bg-gray-700 text-white font-bold" : ""}
                      `}
                      onClick={() => d.isCurrentMonth && setSelected(d.date)}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className={
                          isRed && d.isCurrentMonth ? "text-red-500" :
                          isBlue ? "text-blue-500" : undefined
                        }>
                          {d.date.getDate()}
                        </span>
                        {d.hasEvent && d.isCurrentMonth && (
                          <span className="w-1.5 h-1.5 mt-0.5 rounded-full bg-blue-500 inline-block"></span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* UPCOMING 일정 - 캘린더와의 간격은 mt-2로 조절, 숫자만 바꿔서 원하는 간격으로 쉽게 변경 가능 */}
      <div className="w-full rounded-b-2xl rounded-t-none bg-gray-700 text-white px-4 pt-0 pb-4 flex flex-col gap-1 mt-10">
        <span className="font-bold tracking-widest text-sm mb-2">UPCOMING</span>
        <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-white/70 text-sm">No events</div>
          ) : (
            events.map((ev, idx) => (
              <button
                key={idx}
                className="flex items-start gap-3 w-full text-left hover:bg-gray-600/40 rounded-lg px-2 py-1 transition"
                onClick={() => { setDialogOpen(true); setDialogEvent(idx); }}
              >
                <div className="flex flex-col items-center">
                  <span className="bg-white text-gray-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">{selected.getDate()}</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{ev.title}</div>
                  <div className="text-xs">{ev.time}</div>
                </div>
              </button>
            ))
          )}
          
          {/* 캘린더 이벤트 모달 */}
          {dialogOpen && dialogEvent !== null && events[dialogEvent] && (
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-4">
                <h2 className="text-lg font-semibold mb-2">{events[dialogEvent].title}</h2>
                <div className="text-sm text-gray-500 mb-2">{events[dialogEvent].time}</div>
                <div className="text-sm mb-4">{events[dialogEvent].description}</div>
                <button 
                  className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  onClick={() => { setDialogOpen(false); setDialogEvent(null); }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function Dashboard() {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState(0);
  const [skillChartKey, setSkillChartKey] = useState(0);
  const [wageChartKey, setWageChartKey] = useState(0);
  const [isSkillChartHovered, setIsSkillChartHovered] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  
  // 차트 타입 결정 (0,2는 Stacked, 1,3은 Label)
  const isStackedChart = activeCard === 0 || activeCard === 2;
  const chartData = isStackedChart ? stackedChartData : labelChartData;

  // 차트 애니메이션 재실행 함수 (한 번만)
  const handleSkillChartHover = () => {
    if (!isSkillChartHovered) {
      setSkillChartKey(prev => prev + 1);
      setIsSkillChartHovered(true);
    }
  };

  const handleSkillChartLeave = () => {
    setIsSkillChartHovered(false);
  };

  const handleWageChartHover = () => {
    setWageChartKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 bg-gray-800">
        {/* 사이드바 */}
        <aside className="w-64 bg-gray-800 text-white flex flex-col py-8 px-6 gap-8 min-h-full">
          <nav className="flex-1">
            <ul className="space-y-2">
              {sidebarMenus.map((menu, idx) => (
                <li key={menu.label} 
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-gray-700 cursor-pointer ${idx === 0 ? 'bg-gray-700 font-semibold' : ''}`}
                    onClick={() => {
                      if (menu.label === "스케줄") {
                        router.push("/schedule");
                      }
                    }}
                > 
                  <span>{menu.icon}</span>
                  {menu.label}
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-2">
            {/* Settings, Logout 메뉴 */}
            <div className="flex flex-col gap-1 mb-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-gray-700">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008.6 19a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 005 15.4a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 005 8.6a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 008.6 5a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015.4 5c.46 0 .9.18 1.23.51l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019 8.6c0 .46.18.9.51 1.23l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019 15.4z"/></svg>
                Settings
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-gray-700">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><rect x="3" y="4" width="4" height="16" rx="2"/></svg>
                Logout
              </button>
            </div>
            {/* 유저 정보 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/80">
              <span className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm">
                  U
                </div>
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">shadcn</div>
                <div className="text-xs text-gray-400 truncate">m@example.com</div>
              </div>
              <button className="p-2 text-gray-400 hover:text-white">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
              </button>
            </div>
          </div>
        </aside>
        {/* 메인 대시보드 */}
        <main className="flex-1 flex gap-8 p-8 rounded-tl-3xl rounded-bl-3xl bg-gray-50 shadow">
          {/* 캘린더 카드 (왼쪽, 높이 전체 사용) */}
          <section className="w-[340px] min-w-[300px] max-w-[360px] h-full flex flex-col">
            <div className="flex-1 flex flex-col h-full">
              <CalendarCard />
            </div>
          </section>
          {/* 중앙 대시보드 */}
          <section className="flex-1 flex flex-col gap-8">
            {/* 카드 4개 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "구인-지원진행중", value: "10", sub: "+5 from 7 days" },
                { label: "구인-채택완료", value: "3 / 24", sub: "+5 from 7 days" },
                { label: "구인-진행중", value: "1", sub: "+1 from 7 days" },
                { label: "구인-완료", value: "2 / 10", sub: "+1 from 7 days" },
              ].map((card, idx) => (
                <div
                  key={card.label}
                  className={`bg-white rounded-xl shadow p-5 flex flex-col gap-2 cursor-pointer transition border-2 ${activeCard === idx ? "border-gray-400 scale-105 bg-gray-50" : "border-transparent"}`}
                  onClick={() => setActiveCard(idx)}
                >
                  <span className="text-xs text-gray-500 font-medium">{card.label}</span>
                  <span className="text-2xl font-bold">{card.value}</span>
                  <span className="text-xs text-gray-500">{card.sub}</span>
                </div>
              ))}
            </div>
            {/* 새로운 차트 섹션 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">
                  {activeCard === 0 ? "구인 지원 현황" : 
                   activeCard === 1 ? "구인 채택 현황" :
                   activeCard === 2 ? "구인 진행 현황" : "구인 완료 현황"}
                </span>
                <div className="flex gap-2 text-xs">
                  <button className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold">Monthly</button>
                </div>
              </div>
              <div className="w-full h-64 relative chart-container">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .chart-container .recharts-bar-rectangle {
                      transition: none !important;
                    }
                    .chart-container .recharts-bar-rectangle:hover {
                      fill: rgba(107, 114, 128, 0.3) !important;
                      stroke: none !important;
                      filter: none !important;
                    }
                    .chart-container .recharts-active-bar {
                      fill: rgba(107, 114, 128, 0.3) !important;
                      stroke: none !important;
                      filter: none !important;
                    }
                    .chart-container .recharts-tooltip-wrapper {
                      filter: none !important;
                    }
                    .chart-container .recharts-default-tooltip {
                      background: white !important;
                      border: 1px solid #e5e7eb !important;
                      border-radius: 12px !important;
                      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                      padding: 12px !important;
                    }
                    .chart-container .recharts-tooltip-label {
                      color: #374151 !important;
                      font-weight: 600 !important;
                      margin-bottom: 8px !important;
                    }
                    .chart-container .recharts-tooltip-item {
                      color: #6b7280 !important;
                      padding: 2px 0 !important;
                    }
                    .chart-container .recharts-tooltip-item-name {
                      color: #374151 !important;
                    }
                    .chart-container .recharts-tooltip-item-value {
                      color: #111827 !important;
                      font-weight: 600 !important;
                    }
                  `
                }} />
                {isStackedChart ? (
                  /* Stacked Bar Chart */
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar 
                        dataKey="inProgress" 
                        stackId="a" 
                        fill="#374151" 
                        name="진행중"
                      />
                      <Bar 
                        dataKey="applicants" 
                        stackId="a" 
                        fill="#6b7280" 
                        name="지원자"
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  /* Label Bar Chart */
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="adopted" 
                        fill="#9ca3af" 
                        name="채택완료"
                        label={{ position: 'top' }}
                      />
                      <Bar 
                        dataKey="completed" 
                        fill="#d1d5db" 
                        name="완료"
                        label={{ position: 'top' }}
                      />
                    </BarChart>
                  </ChartContainer>
                )}
              </div>
            </div>
            {/* 프로젝트 리스트 */}
            <div className="bg-white rounded-xl shadow border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">PROJECT LIST</h2>
              </div>
              <div className="relative overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-gray-50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">NO</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-700">PJT</th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-700">견적</th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-700">실측</th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-700">재단</th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-700">시공</th>
                      <th className="h-12 px-4 text-center align-middle font-medium text-gray-700">진행상태</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    <tr className="border-b transition-colors hover:bg-gray-50">
                      <td className="p-4 align-middle font-medium text-gray-900">8</td>
                      <td className="p-4 align-middle text-gray-600">'25.06.02</td>
                      <td className="p-4 align-middle text-gray-900">남양주 아파트</td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 border-2 border-gray-300 bg-white">
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 border-2 border-gray-300 bg-white">
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 border-2 border-gray-300 bg-white">
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex h-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-600">
                          진행중
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-gray-50">
                      <td className="p-4 align-middle font-medium text-gray-900">7</td>
                      <td className="p-4 align-middle text-gray-600">'25.05.31</td>
                      <td className="p-4 align-middle text-gray-900">서울 창살문 상가</td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 border-2 border-gray-300 bg-white">
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex h-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-600">
                          진행중
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-gray-50">
                      <td className="p-4 align-middle font-medium text-gray-900">6</td>
                      <td className="p-4 align-middle text-gray-600">'25.04.02</td>
                      <td className="p-4 align-middle text-gray-900">인천 병원</td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex h-6 items-center justify-center rounded-full bg-gray-200 px-2 text-xs font-medium text-gray-700">
                          완료
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-gray-50">
                      <td className="p-4 align-middle font-medium text-gray-900">5</td>
                      <td className="p-4 align-middle text-gray-600">'25.01.02</td>
                      <td className="p-4 align-middle text-gray-900">구리시 빌라</td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <div className="inline-flex h-6 items-center justify-center rounded-full bg-gray-200 px-2 text-xs font-medium text-gray-700">
                          완료
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          {/* 우측 패널 */}
          <aside className="w-[380px] flex flex-col gap-6">
            {/* 프로필 카드 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-3">
              {/* 상단 프로필 영역 - 좌우 분할 */}
              <div className="flex items-start justify-between w-full">
                {/* 좌측: 프로필 사진, 닉네임, 이름 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden">
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-2xl">
                      U
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">너구순진</span>
                    <span className="text-xs text-gray-400">임병현</span>
                  </div>
                </div>
                
                {/* 우측: 경력, 숙련도 */}
                <div className="flex flex-col items-end gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    <span className="text-sm text-gray-600">경력</span>
                    <span className="text-sm font-semibold">4년 6개월</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-sm text-gray-600">숙련도</span>
                    <span className="text-sm font-semibold">기공</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-8 justify-center">
                {/* 알림 */}
                <div className="relative">
                  <button 
                    className="relative flex flex-col items-center group"
                    onClick={() => setShowNotificationModal(true)}
                  >
                    {/* 종 아이콘 */}
                    <span className="relative">
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500 group-hover:text-gray-700 transition"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                      {unreadNoti > 0 && <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold border-2 border-white z-10">{unreadNoti}</span>}
                    </span>
                    <span className="text-xs mt-1 text-gray-500">알림</span>
                  </button>
                  
                  {showNotificationModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-4">
                        <h2 className="text-lg font-semibold mb-2">알림</h2>
                        <p className="text-sm text-gray-600 mb-4">알림 목록을 확인하세요.</p>
                        <ul className="space-y-2 text-left mb-4">
                          {notifications.length === 0 ? <li className="text-gray-400">알림이 없습니다.</li> : notifications.map(n => (
                            <li key={n.id} className={n.read ? "text-gray-400" : "font-semibold text-black"}>{n.text}</li>
                          ))}
                        </ul>
                        <button 
                          className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                          onClick={() => setShowNotificationModal(false)}
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* 쪽지 */}
                <div className="relative">
                  <button 
                    className="relative flex flex-col items-center group"
                    onClick={() => setShowMessageModal(true)}
                  >
                    {/* 쪽지 아이콘 */}
                    <span className="relative">
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500 group-hover:text-gray-700 transition"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                      {unreadMsg > 0 && <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold border-2 border-white z-10">{unreadMsg}</span>}
                    </span>
                    <span className="text-xs mt-1 text-gray-500">메세지</span>
                  </button>
                  
                  {showMessageModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-4">
                        <h2 className="text-lg font-semibold mb-2">메세지</h2>
                        <p className="text-sm text-gray-600 mb-4">받은 메세지를 확인하세요.</p>
                        <ul className="space-y-2 text-left mb-4">
                          {messages.length === 0 ? <li className="text-gray-400">메세지가 없습니다.</li> : messages.map(m => (
                            <li key={m.id} className={m.read ? "text-gray-400" : "font-semibold text-black"}>{m.text}</li>
                          ))}
                        </ul>
                        <button 
                          className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                          onClick={() => setShowMessageModal(false)}
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* 포인트 */}
                <div className="relative">
                  <button 
                    className="flex flex-col items-center group"
                    onClick={() => setShowPointModal(true)}
                  >
                    <span className="flex items-center gap-2">
                      {/* 코인/포인트 아이콘 */}
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500 group-hover:text-gray-700 transition"><circle cx="12" cy="12" r="10"/><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="bold">P</text></svg>
                      <span className="font-bold text-base text-gray-600">P {userPoint.toLocaleString()}</span>
                    </span>
                    <span className="text-xs text-gray-500 mt-1">포인트</span>
                  </button>
                  
                  {showPointModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-4">
                        <h2 className="text-lg font-semibold mb-2">포인트 내역</h2>
                        <ul className="space-y-2 text-left mb-4">
                          {pointHistory.length === 0 ? <li className="text-gray-400">포인트 내역이 없습니다.</li> : pointHistory.map(p => (
                            <li key={p.id} className="text-black"><span className="font-semibold mr-2">{p.text}</span><span className="text-xs text-gray-400">{p.date}</span></li>
                          ))}
                        </ul>
                        <button 
                          className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                          onClick={() => setShowPointModal(false)}
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 수행 숙련도 도넛 차트 */}
            <motion.div 
              className="bg-white rounded-xl shadow p-6 transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={handleSkillChartHover}
              onMouseLeave={handleSkillChartLeave}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-lg">수행 숙련도</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-36 w-36 relative flex-shrink-0">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <PieChart key={skillChartKey}>
                      <Pie
                        data={skillLevelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={72}
                        paddingAngle={2}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {skillLevelData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold">
                        100%
                      </text>
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  {skillLevelData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span className="text-sm text-gray-600">{entry.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 평균 임금 게이지 차트 */}
            <motion.div 
              className="bg-white rounded-xl shadow p-6 transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={handleWageChartHover}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-lg">평균 임금</span>
              </div>
              <div className="flex items-center gap-4">
                {/* 왼쪽 통계 정보 */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="text-xs text-gray-500 text-center whitespace-nowrap">총 채택건수</div>
                  <div className="text-sm font-semibold">120건</div>
                </div>
                
                {/* 중앙 게이지 차트 */}
                <div className="h-36 w-48 relative flex-shrink-0">
                  {/* 게이지 차트 SVG */}
                  <svg viewBox="0 0 200 120" className="w-full h-full">
                    {/* 배경 아크 */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    
                    {/* 색상 구간별 아크 */}
                    {gaugeColorRanges.map((range, index) => {
                      const startAngle = -180 + (range.min / avgWageGaugeData[0].maxValue) * 180;
                      const endAngle = -180 + (range.max / avgWageGaugeData[0].maxValue) * 180;
                      const startX = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                      const startY = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                      const endX = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                      const endY = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
                      
                      return (
                        <path
                          key={index}
                          d={`M ${startX} ${startY} A 80 80 0 0 1 ${endX} ${endY}`}
                          fill="none"
                          stroke={range.color}
                          strokeWidth="12"
                          strokeLinecap="round"
                          opacity="0.3"
                        />
                      );
                    })}
                    
                    {/* 현재 값 표시 아크 */}
                    <motion.path
                      d={`M 20 100 A 80 80 0 0 1 ${100 + 80 * Math.cos((-180 + (avgWageGaugeData[0].value / avgWageGaugeData[0].maxValue) * 180) * Math.PI / 180)} ${100 + 80 * Math.sin((-180 + (avgWageGaugeData[0].value / avgWageGaugeData[0].maxValue) * 180) * Math.PI / 180)}`}
                      fill="none"
                      stroke={gaugeColorRanges.find(range => 
                        avgWageGaugeData[0].value >= range.min && avgWageGaugeData[0].value <= range.max
                      )?.color || "#10b981"}
                      strokeWidth="12"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      key={wageChartKey}
                    />
                    
                    {/* 중앙 텍스트 */}
                    <text x="100" y="85" textAnchor="middle" className="text-xl font-bold fill-gray-800">
                      {avgWageGaugeData[0].value}{avgWageGaugeData[0].unit}
                    </text>
                    <text x="100" y="105" textAnchor="middle" className="text-xs fill-gray-500">
                      평균 임금
                    </text>
                  </svg>
                  
                  {/* 게이지 범위 표시 */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>{avgWageGaugeData[0].maxValue}{avgWageGaugeData[0].unit}</span>
                  </div>
                </div>
                
                {/* 오른쪽 통계 정보 */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="text-xs text-gray-500 text-center whitespace-nowrap">총 채택비용</div>
                  <div className="text-sm font-semibold whitespace-nowrap">5,472만원</div>
                </div>
              </div>
            </motion.div>
          </aside>
        </main>
      </div>
    </div>
  );
}
