"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";

// 일정 데이터 (날짜별)
const eventsByDate = {
  "2025-07-11": [
    { title: "Meeting", time: "12:30 pm", description: "Team meeting about project status." },
    { title: "Conference", time: "3:30 pm", description: "Online conference with partners." },
  ],
  "2025-07-17": [
    { title: "Picnic", time: "8:30 am", description: "Company picnic at the park." },
    { title: "Assignment", time: "9:30 pm", description: "Submit project assignment." },
  ],
  "2025-07-30": [
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

// 스케줄 데이터 (임시)
const scheduleData = [
  {
    id: 1,
    title: "프로젝트 회의",
    date: "2025-07-15",
    time: "10:00",
    description: "월간 프로젝트 진행 상황 검토 회의",
    status: "예정",
    type: "meeting"
  },
  {
    id: 2,
    title: "클라이언트 미팅",
    date: "2025-07-16",
    time: "14:00",
    description: "신규 프로젝트 요구사항 논의",
    status: "확정",
    type: "client"
  },
  {
    id: 3,
    title: "현장 실측",
    date: "2025-07-18",
    time: "09:00",
    description: "강남구 오피스텔 현장 실측 작업",
    status: "진행중",
    type: "field"
  },
  {
    id: 4,
    title: "설계 검토",
    date: "2025-07-20",
    time: "15:00",
    description: "도면 설계 최종 검토",
    status: "예정",
    type: "design"
  },
  {
    id: 5,
    title: "견적 발송",
    date: "2025-07-22",
    time: "11:00",
    description: "고객사 견적서 발송",
    status: "완료",
    type: "estimate"
  }
];

// 일정 타입별 색상 정의
const eventTypeColors = {
  meeting: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  client: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  field: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
  design: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
  estimate: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" }
};

function BigCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // 2025년 7월
  
  // 월간 캘린더 매트릭스 생성
  const getCalendarMatrix = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const matrix = [];
    const currentDay = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dayEvents = scheduleData.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === currentDay.toDateString();
        });
        
        weekDays.push({
          date: new Date(currentDay),
          isCurrentMonth: currentDay.getMonth() === month,
          isToday: currentDay.toDateString() === today.toDateString(),
          events: dayEvents
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      matrix.push(weekDays);
    }
    return matrix;
  };

  const matrix = getCalendarMatrix();
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="h-full flex flex-col">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900">
          {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden mb-1">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div key={day} className={`bg-gray-50 p-3 text-center font-semibold ${
            index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-700"
          }`}>
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="flex-1 grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {matrix.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`bg-white p-2 min-h-[120px] flex flex-col ${
                !day.isCurrentMonth ? "bg-gray-50" : ""
              } ${day.isToday ? "ring-2 ring-blue-500" : ""}`}
            >
              {/* 날짜 */}
              <div className={`text-sm font-medium mb-1 ${
                !day.isCurrentMonth ? "text-gray-400" :
                dayIndex === 0 ? "text-red-500" :
                dayIndex === 6 ? "text-blue-500" : "text-gray-900"
              }`}>
                {day.date.getDate()}
              </div>
              
              {/* 일정들 */}
              <div className="flex-1 space-y-1">
                {day.events.slice(0, 3).map((event, eventIndex) => {
                  const colors = eventTypeColors[event.type] || eventTypeColors.meeting;
                  return (
                    <div
                      key={event.id}
                      className={`${colors.bg} ${colors.text} ${colors.border} border rounded px-2 py-1 text-xs font-medium truncate cursor-pointer hover:opacity-80 transition`}
                      title={`${event.title} (${event.time})`}
                    >
                      {event.title}
                    </div>
                  );
                })}
                {day.events.length > 3 && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
                onClick={() => { setShowEventModal(true); setSelectedEvent(ev); }}
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
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full mx-4">
            <h2 className="text-lg font-semibold mb-2">{selectedEvent.title}</h2>
            <div className="text-sm text-gray-500 mb-2">{selectedEvent.time}</div>
            <div className="text-sm text-gray-700 mb-4">{selectedEvent.description}</div>
            <button
              onClick={() => setShowEventModal(false)}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const sidebarMenus = [
  {
    label: "MAIN",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/></svg>
    ),
    href: "/",
  },
  {
    label: "스케줄",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
    ),
    href: "/schedule",
    active: true,
  },
  {
    label: "구인",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1"/></svg>
    ),
    href: "#",
  },
  {
    label: "구직",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2"/></svg>
    ),
    href: "#",
  },
  {
    label: "외주",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20v-6M12 4v4m0 0a4 4 0 110 8 4 4 0 010-8z"/></svg>
    ),
    href: "#",
  },
  {
    label: "실측",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10v10H7z"/></svg>
    ),
    href: "#",
  },
  {
    label: "배치",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>
    ),
    href: "#",
  },
  {
    label: "견적",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
    ),
    href: "#",
  },
  {
    label: "주문내역",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
    ),
    href: "#",
  },
];

export default function SchedulePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState(scheduleData);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex flex-1 bg-gray-800">
          {/* 기존 좌측 사이드바 사용 */}
          <aside className="w-64 bg-gray-800 text-white flex flex-col py-8 px-6 gap-8 min-h-full">
            <nav className="flex-1">
              <ul className="space-y-2">
                {sidebarMenus.map((menu, idx) => (
                  <li
                    key={menu.label}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-gray-700 cursor-pointer ${
                      menu.active ? "bg-gray-700 font-semibold" : ""
                    }`}
                    onClick={() => {
                      if (menu.href !== "#") {
                        router.push(menu.href);
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

          {/* 메인 컨텐츠 영역 */}
          <main className="flex-1 flex gap-8 p-8 rounded-tl-3xl rounded-bl-3xl bg-gray-50 shadow">
            {/* 메인 캘린더 (왼쪽, 큰 영역) */}
            <section className="flex-1 flex flex-col gap-6">
              {/* 스케줄 헤더 */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">스케줄 관리</h1>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                  + 새 일정 추가
                </button>
              </div>

              {/* 새로운 메인 캘린더 */}
              <div className="bg-white rounded-xl shadow flex-1 p-6">
                <BigCalendar />
              </div>
            </section>

            {/* 일정 목록 (중간, 카드 형태) */}
            <section className="w-[350px] flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">일정 목록</h2>
              </div>
              
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px]">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="bg-white rounded-xl shadow border p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {schedule.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          schedule.status === "확정"
                            ? "bg-green-100 text-green-800"
                            : schedule.status === "진행중"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {schedule.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{schedule.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>{schedule.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        <span>{schedule.time}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="1"/>
                          <circle cx="19" cy="12" r="1"/>
                          <circle cx="5" cy="12" r="1"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
          
        </div>
      </div>
    </SidebarProvider>
  );
}