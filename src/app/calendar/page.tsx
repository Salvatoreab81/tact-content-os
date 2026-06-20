"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarEvent {
  id: number;
  title: string;
  event_date: string;
  event_type: string;
  effort_level: string;
}

const effortColors: Record<string, string> = {
  low: "bg-[#00ff88]/8 border-[#00ff88]/15 text-[#00ff88]",
  medium: "bg-[#ffaa00]/8 border-[#ffaa00]/15 text-[#ffaa00]",
  high: "bg-[#ff3366]/8 border-[#ff3366]/15 text-[#ff3366]",
};

const effortDotColors: Record<string, string> = {
  low: "bg-[#00ff88]",
  medium: "bg-[#ffaa00]",
  high: "bg-[#ff3366]",
};

export default function CalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    event_date: "",
    event_type: "campaign",
    effort_level: "medium",
  });

  const currentMonth = new Date().getMonth();
  const [viewMonth, setViewMonth] = useState(currentMonth);

  // Generate sample events for demo
  useMemo(() => {
    const sampleEvents: CalendarEvent[] = [];
    const titles = [
      "Product Launch Campaign",
      "Holiday Sale Content",
      "Brand Awareness Week",
      "Summer Collection",
      "Black Friday Campaign",
      "New Year Promotion",
      "Back to School",
      "Valentine's Day",
      "Pet Appreciation Day",
    ];
    const types = ["campaign", "event", "holiday", "promotion"];
    const efforts = ["low", "medium", "high"];

    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      const numEvents = Math.floor(Math.random() * 3) + 1;
      for (let e = 0; e < numEvents; e++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1;
        sampleEvents.push({
          id: m * 10 + e,
          title: titles[Math.floor(Math.random() * titles.length)],
          event_date: `${year}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          event_type: types[Math.floor(Math.random() * types.length)],
          effort_level: efforts[Math.floor(Math.random() * efforts.length)],
        });
      }
    }
    setEvents(sampleEvents);
  }, [year]);

  const daysInMonth = new Date(year, viewMonth + 1, 0).getDate();
  const firstDay = new Date(year, viewMonth, 1).getDay();

  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let i = 1; i <= daysInMonth; i++) arr.push(i);
    return arr;
  }, [firstDay, daysInMonth]);

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.event_date === dateStr);
  };

  const selectedDayEvents = selectedDate
    ? events.filter((e) => e.event_date === selectedDate)
    : [];

  const addEvent = () => {
    if (!newEvent.title || !newEvent.event_date) return;
    setEvents((prev) => [
      ...prev,
      { ...newEvent, id: Date.now() } as CalendarEvent,
    ]);
    setNewEvent({
      title: "",
      event_date: "",
      event_type: "campaign",
      effort_level: "medium",
    });
    setShowAddForm(false);
  };

  return (
    <div className="p-8 sm:p-10 lg:p-12 section-container space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight heading-glow">
            Calendar
          </h1>
          <p className="text-sm text-white/50 mt-3 font-medium">
            Plan and visualize your content schedule
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold self-start transition-all duration-300 glow-sm hover:scale-[1.03] shadow-[0_0_20px_rgba(0,255,136,0.2)]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="glass glass-accent-top p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white heading-brutal">New Event</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-white/30 hover:text-white/70 transition-colors duration-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="glass-input"
            />
            <Input
              type="date"
              value={newEvent.event_date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, event_date: e.target.value })
              }
              className="glass-input"
            />
            <select
              value={newEvent.effort_level}
              onChange={(e) =>
                setNewEvent({ ...newEvent, effort_level: e.target.value })
              }
              className="rounded-xl glass-select px-3 py-2 text-sm"
            >
              <option value="low">Low Effort</option>
              <option value="medium">Medium Effort</option>
              <option value="high">High Effort</option>
            </select>
            <Button
              onClick={addEvent}
              className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a1a] font-bold transition-all duration-300"
            >
              Add
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  viewMonth === 0
                    ? (setYear((y) => y - 1), setViewMonth(11))
                    : setViewMonth((m) => m - 1)
                }
                className="p-2.5 rounded-xl hover:bg-white/[0.06] transition-all duration-300 text-white/30 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setYear((y) => y - 1)}
                  className="text-white/30 hover:text-white/70 text-xs transition-colors duration-300 font-mono"
                >
                  ← {year - 1}
                </button>
                <h2 className="text-lg font-bold text-white heading-brutal">
                  {MONTHS[viewMonth]} {year}
                </h2>
                <button
                  onClick={() => setYear((y) => y + 1)}
                  className="text-white/30 hover:text-white/70 text-xs transition-colors duration-300 font-mono"
                >
                  {year + 1} →
                </button>
              </div>
              <button
                onClick={() =>
                  viewMonth === 11
                    ? (setYear((y) => y + 1), setViewMonth(0))
                    : setViewMonth((m) => m + 1)
                }
                className="p-2.5 rounded-xl hover:bg-white/[0.06] transition-all duration-300 text-white/30 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-5">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-3">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-semibold text-white/30 py-2.5 font-mono uppercase tracking-[0.1em]"
                >
                  {day}
                </div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                if (day === null)
                  return <div key={`empty-${i}`} className="aspect-square" />;
                const dayEvents = getEventsForDate(day);
                const dateStr = `${year}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === viewMonth &&
                  new Date().getFullYear() === year;
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`calendar-day aspect-square p-1.5 flex flex-col items-center justify-start gap-0.5 relative ${
                      isSelected
                        ? "selected"
                        : isToday
                          ? "today"
                          : ""
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        isToday
                          ? "text-[#00ff88]"
                          : isSelected
                            ? "text-white"
                            : "text-white/40"
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5">
                        {dayEvents.slice(0, 3).map((ev, j) => (
                          <div
                            key={j}
                            className={`h-1 w-1 rounded-full ${
                              effortDotColors[ev.effort_level] || "bg-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Day Detail / Legend */}
        <div className="space-y-4">
          <div className="glass p-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 heading-brutal mb-4">
              <CalendarIcon className="h-4 w-4 text-[#00d4ff]/50" />
              {selectedDate
                ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  )
                : "Select a day"}
            </h3>
            <div>
              {selectedDate ? (
                selectedDayEvents.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedDayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`rounded-xl border p-4 transition-all duration-300 ${
                          effortColors[event.effort_level] ||
                          "bg-white/[0.04] border-white/[0.08] text-white/40"
                        }`}
                      >
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs opacity-60 capitalize font-mono mt-1">
                          {event.event_type} · {event.effort_level} effort
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/25 text-center py-5">
                    No events on this day
                  </p>
                )
              ) : (
                <p className="text-sm text-white/25 text-center py-5">
                  Click on a day to see events
                </p>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="glass p-6">
            <h3 className="text-sm font-bold text-white mb-4 heading-brutal">
              Effort Level
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]" />
                <span className="text-sm text-white/45">Low</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ffaa00] shadow-[0_0_10px_rgba(255,170,0,0.3)]" />
                <span className="text-sm text-white/45">Medium</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff3366] shadow-[0_0_10px_rgba(255,51,102,0.3)]" />
                <span className="text-sm text-white/45">High</span>
              </div>
            </div>
          </div>

          {/* Month Quick Nav */}
          <div className="glass p-6">
            <h3 className="text-sm font-bold text-white mb-4 heading-brutal">
              Quick Nav
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setViewMonth(i)}
                  className={`rounded-xl px-2 py-2 text-[10px] font-semibold transition-all duration-300 font-mono ${
                    i === viewMonth
                      ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 shadow-[0_0_10px_rgba(0,255,136,0.06)]"
                      : "text-white/30 hover:text-white/60 hover:bg-white/[0.05] border border-transparent"
                  }`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
