"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";

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

// 차트 설정
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))"
  },
  mobile: {
    label: "Mobile", 
    color: "hsl(var(--chart-2))"
  },
  progress: {
    label: "진행중",
    color: "hsl(var(--chart-3))"
  },
  completed: {
    label: "완료",
    color: "hsl(var(--chart-4))"
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

// 수행 숙련도 도넛 차트 데이터
const skillLevelData = [
  { name: "조공", value: 35, fill: "hsl(var(--chart-1))" },
  { name: "준기공", value: 45, fill: "hsl(var(--chart-2))" },
  { name: "기공", value: 20, fill: "hsl(var(--chart-3))" }
];

// 평균 임금 방사형 차트 데이터
const avgWageData = [
  { category: "채택건수", value: 120, fill: "hsl(var(--chart-1))" },
  { category: "채택비용", value: 85, fill: "hsl(var(--chart-2))" },
  { category: "평균임금", value: 70, fill: "hsl(var(--chart-3))" }
];

// 차트 색상 배열
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];


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

  // 커스텀 오버레이(블러 효과)
  function CustomOverlay(props) {
    return (
      <AlertDialogOverlay {...props} className="bg-black/30 backdrop-blur-sm" />
    );
  }

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
          <span className="text-base font-semibold text-pink-500 tracking-widest">{monthLabel}</span>
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
              <th className="font-normal text-red-500">S</th>
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
                        ${d.isToday ? "bg-pink-100 text-pink-600 font-bold" : ""}
                        ${selected && d.date.toDateString() === selected.toDateString() ? "bg-pink-500 text-white font-bold" : ""}
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
                          <span className="w-1.5 h-1.5 mt-0.5 rounded-full bg-pink-500 inline-block"></span>
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
      <div className="w-full rounded-b-2xl rounded-t-none bg-pink-500 text-white px-4 pt-0 pb-4 flex flex-col gap-1 mt-10">
        <span className="font-bold tracking-widest text-sm mb-2">UPCOMING</span>
        <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-white/70 text-sm">No events</div>
          ) : (
            events.map((ev, idx) => (
              <AlertDialog key={idx} open={dialogOpen && dialogEvent === idx} onOpenChange={(open) => { setDialogOpen(open); if (!open) setDialogEvent(null); }}>
                <AlertDialogTrigger asChild>
                  <button
                    className="flex items-start gap-3 w-full text-left hover:bg-pink-400/40 rounded-lg px-2 py-1 transition"
                    onClick={() => { setDialogOpen(true); setDialogEvent(idx); }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="bg-white text-pink-500 font-bold rounded-full w-8 h-8 flex items-center justify-center">{selected.getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{ev.title}</div>
                      <div className="text-xs">{ev.time}</div>
                    </div>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent asChild>
                  <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-auto flex flex-col items-center">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{ev.title}</AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="text-sm text-gray-500 mb-2">{ev.time}</div>
                        <div>{ev.description}</div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel className="mt-4">Close</AlertDialogCancel>
                  </div>
                </AlertDialogContent>
                <CustomOverlay />
              </AlertDialog>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


export default function Dashboard() {
  const [activeCard, setActiveCard] = useState(0);
  
  // 차트 타입 결정 (0,2는 Stacked, 1,3은 Label)
  const isStackedChart = activeCard === 0 || activeCard === 2;
  const chartData = isStackedChart ? stackedChartData : labelChartData;

  return (
    <div className="min-h-screen bg-[#f6f8fc] flex flex-col">
      {/* 상단바 */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Image src="/file.svg" alt="Logo" width={40} height={40} className="rounded" />
          <span className="text-2xl font-bold text-[#222]">saastech.io</span>
        </div>
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search something..."
              className="w-full rounded-full border border-gray-200 pl-10 pr-24 py-2 bg-[#f6f8fc] focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </span>
            <button className="absolute right-2 top-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 text-sm font-semibold">Search</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="1"/></svg>
          </button>
          <span className="font-medium text-gray-700">Admin</span>
          <span className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">A</span>
        </div>
      </header>
      <div className="flex flex-1 bg-[#232946]">
        {/* 사이드바 */}
        <aside className="w-64 bg-[#232946] text-white flex flex-col py-8 px-6 gap-8 min-h-full">
          <nav className="flex-1">
            <ul className="space-y-2">
              {sidebarMenus.map((menu, idx) => (
                <li key={menu.label} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-[#353a5a] cursor-pointer ${idx === 0 ? 'bg-[#353a5a] font-semibold' : ''}`}> 
                  <span>{menu.icon}</span>
                  {menu.label}
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-2">
            {/* Settings, Logout 메뉴 */}
            <div className="flex flex-col gap-1 mb-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-[#353a5a]">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008.6 19a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 005 15.4a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 005 8.6a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 008.6 5a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015.4 5c.46 0 .9.18 1.23.51l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019 8.6c0 .46.18.9.51 1.23l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019 15.4z"/></svg>
                Settings
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-[#353a5a]">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><rect x="3" y="4" width="4" height="16" rx="2"/></svg>
                Logout
              </button>
            </div>
            {/* 유저 정보 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#232946]/80">
              <span className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <Image src="/vercel.svg" alt="User Avatar" width={36} height={36} />
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
        <main className="flex-1 flex gap-8 p-8 rounded-tl-3xl rounded-bl-3xl bg-[#f7f8fa] shadow">
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
                  className={`bg-white rounded-xl shadow p-5 flex flex-col gap-2 cursor-pointer transition border-2 ${activeCard === idx ? "border-blue-500 scale-105 bg-blue-50" : "border-transparent"}`}
                  onClick={() => setActiveCard(idx)}
                >
                  <span className="text-xs text-gray-500 font-medium">{card.label}</span>
                  <span className="text-2xl font-bold">{card.value}</span>
                  <span className="text-xs text-green-500">{card.sub}</span>
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
                  <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">Monthly</button>
                </div>
              </div>
              <div className="w-full h-64 relative">
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
                        fill="hsl(var(--chart-1))" 
                        name="진행중"
                      />
                      <Bar 
                        dataKey="applicants" 
                        stackId="a" 
                        fill="hsl(var(--chart-2))" 
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
                        fill="hsl(var(--chart-3))" 
                        name="채택완료"
                        label={{ position: 'top' }}
                      />
                      <Bar 
                        dataKey="completed" 
                        fill="hsl(var(--chart-4))" 
                        name="완료"
                        label={{ position: 'top' }}
                      />
                    </BarChart>
                  </ChartContainer>
                )}
              </div>
            </div>
            {/* 최근 주문 */}
            <div className="bg-white rounded-xl shadow p-6">
              <span className="font-semibold text-lg mb-4 block">Recent Orders</span>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs">
                    <th className="text-left py-2">Order ID</th>
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">City</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-2">1</td>
                    <td>Fozyah Alarmi</td>
                    <td>02 Mar 2025</td>
                    <td>Riyadh</td>
                    <td>5,351</td>
                    <td className="text-green-500 font-semibold">PAID</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">2</td>
                    <td>Aya Faisal</td>
                    <td>12 Apr 2025</td>
                    <td>Dubai</td>
                    <td>3,951</td>
                    <td className="text-green-500 font-semibold">PAID</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">3</td>
                    <td>Huda Alshihri</td>
                    <td>04 Jul 2025</td>
                    <td>Doha</td>
                    <td>2,351</td>
                    <td className="text-green-500 font-semibold">PAID</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          {/* 우측 패널 */}
          <aside className="w-[340px] flex flex-col gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden">
                <Image src="/vercel.svg" alt="Profile" width={80} height={80} />
              </div>
              <span className="font-bold text-lg">Gloria</span>
              <span className="text-xs text-gray-400">@Gloria</span>
              <div className="flex gap-8 mt-4 justify-center">
                {/* 알림 */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="relative flex flex-col items-center group">
                      {/* 종 아이콘 */}
                      <span className="relative">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500 group-hover:text-blue-500 transition"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                        {unreadNoti > 0 && <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold border-2 border-white z-10">{unreadNoti}</span>}
                      </span>
                      <span className="text-xs mt-1 text-gray-500">알림</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent asChild>
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-auto flex flex-col items-center">
                      <AlertDialogHeader>
                        <AlertDialogTitle>알림</AlertDialogTitle>
                        <AlertDialogDescription>
                          <ul className="mt-2 space-y-2 text-left">
                            {notifications.length === 0 ? <li className="text-gray-400">알림이 없습니다.</li> : notifications.map(n => (
                              <li key={n.id} className={n.read ? "text-gray-400" : "font-semibold text-black"}>{n.text}</li>
                            ))}
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogCancel className="mt-4">닫기</AlertDialogCancel>
                    </div>
                  </AlertDialogContent>
                  <AlertDialogOverlay className="bg-black/30 backdrop-blur-sm" />
                </AlertDialog>
                {/* 쪽지 */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="relative flex flex-col items-center group">
                      {/* 쪽지 아이콘 */}
                      <span className="relative">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500 group-hover:text-blue-500 transition"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                        {unreadMsg > 0 && <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold border-2 border-white z-10">{unreadMsg}</span>}
                      </span>
                      <span className="text-xs mt-1 text-gray-500">메세지</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent asChild>
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-auto flex flex-col items-center">
                      <AlertDialogHeader>
                        <AlertDialogTitle>메세지</AlertDialogTitle>
                        <AlertDialogDescription>
                          <ul className="mt-2 space-y-2 text-left">
                            {messages.length === 0 ? <li className="text-gray-400">메세지가 없습니다.</li> : messages.map(m => (
                              <li key={m.id} className={m.read ? "text-gray-400" : "font-semibold text-black"}>{m.text}</li>
                            ))}
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogCancel className="mt-4">닫기</AlertDialogCancel>
                    </div>
                  </AlertDialogContent>
                  <AlertDialogOverlay className="bg-black/30 backdrop-blur-sm" />
                </AlertDialog>
                {/* 포인트 */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="flex flex-col items-center group">
                      <span className="flex items-center gap-2">
                        {/* 코인/포인트 아이콘 */}
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-yellow-500 group-hover:text-yellow-400 transition"><circle cx="12" cy="12" r="10"/><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#facc15" fontWeight="bold">P</text></svg>
                        <span className="font-bold text-base text-yellow-600">P {userPoint.toLocaleString()}</span>
                      </span>
                      <span className="text-xs text-gray-500 mt-1">포인트</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent asChild>
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-auto flex flex-col items-center">
                      <AlertDialogHeader>
                        <AlertDialogTitle>포인트 내역</AlertDialogTitle>
                        <AlertDialogDescription>
                          <ul className="mt-2 space-y-2 text-left">
                            {pointHistory.length === 0 ? <li className="text-gray-400">포인트 내역이 없습니다.</li> : pointHistory.map(p => (
                              <li key={p.id} className="text-black"><span className="font-semibold mr-2">{p.text}</span><span className="text-xs text-gray-400">{p.date}</span></li>
                            ))}
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogCancel className="mt-4">닫기</AlertDialogCancel>
                    </div>
                  </AlertDialogContent>
                  <AlertDialogOverlay className="bg-black/30 backdrop-blur-sm" />
                </AlertDialog>
              </div>
            </div>
            {/* 수행 숙련도 도넛 차트 */}
            <motion.div 
              className="bg-white rounded-xl shadow p-4 transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-base">수행 숙련도</span>
              </div>
              <div className="h-44 relative">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <PieChart>
                    <Pie
                      data={skillLevelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {skillLevelData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                      100%
                    </text>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                {skillLevelData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      ></div>
                      <span className="text-xs text-gray-600">{entry.name}</span>
                    </div>
                    <span className="text-xs font-semibold">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* 평균 임금 방사형 차트 */}
            <motion.div 
              className="bg-white rounded-xl shadow p-4 transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-base">평균 임금</span>
              </div>
              <div className="h-32 relative">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="35%"
                    outerRadius="80%"
                    data={avgWageData}
                  >
                    <RadialBar 
                      dataKey="value" 
                      stackId="1" 
                      cornerRadius={3}
                      fill="hsl(var(--chart-1))"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadialBarChart>
                </ChartContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">456만원</div>
                  <div className="text-xs text-gray-500">평균 임금</div>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }}></div>
                    <span>총 채택건수</span>
                  </div>
                  <span className="font-semibold">120건</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-2))' }}></div>
                    <span>총 채택비용</span>
                  </div>
                  <span className="font-semibold">5,472만원</span>
                </div>
              </div>
            </motion.div>
          </aside>
        </main>
      </div>
    </div>
  );
}
