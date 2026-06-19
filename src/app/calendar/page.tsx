"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  low: "bg-green-500/20 border-green-500/30 text-green-400",
  medium: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
  high: "bg-red-500/20 border-red-500/30 text-red-400",
};

const effortDotColors: Record<string, string> = {
  low: "bg-green-400",
  medium: "bg-yellow-400",
  high: "bg-red-400",
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Calendar
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Plan and visualize your content schedule
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white self-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <Card className="bg-gray-900/50 border-blue-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">New Event</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-600 hover:text-white transition-colors"
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
                className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-600"
              />
              <Input
                type="date"
                value={newEvent.event_date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, event_date: e.target.value })
                }
                className="bg-white/[0.05] border-white/[0.08] text-white"
              />
              <select
                value={newEvent.effort_level}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, effort_level: e.target.value })
                }
                className="rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-sm text-white outline-none"
              >
                <option value="low">Low Effort</option>
                <option value="medium">Medium Effort</option>
                <option value="high">High Effort</option>
              </select>
              <Button
                onClick={addEvent}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-white/[0.06]">
          <CardHeader className="border-b border-white/[0.06] pb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  viewMonth === 0
                    ? (setYear((y) => y - 1), setViewMonth(11))
                    : setViewMonth((m) => m - 1)
                }
                className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-gray-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setYear((y) => y - 1)}
                  className="text-gray-500 hover:text-white text-xs transition-colors"
                >
                  ← {year - 1}
                </button>
                <h2 className="text-lg font-semibold text-white">
                  {MONTHS[viewMonth]} {year}
                </h2>
                <button
                  onClick={() => setYear((y) => y + 1)}
                  className="text-gray-500 hover:text-white text-xs transition-colors"
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
                className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-gray-400 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-600 py-2"
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
                    className={`aspect-square rounded-lg p-1.5 flex flex-col items-center justify-start gap-0.5 transition-all duration-200 relative ${
                      isSelected
                        ? "bg-blue-600/20 ring-1 ring-blue-500/40"
                        : isToday
                          ? "bg-white/[0.06]"
                          : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        isToday
                          ? "text-blue-400"
                          : isSelected
                            ? "text-white"
                            : "text-gray-400"
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
                              effortDotColors[ev.effort_level] || "bg-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day Detail / Legend */}
        <div className="space-y-4">
          <Card className="bg-gray-900/50 border-white/[0.06]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDayEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`rounded-lg border p-3 ${
                          effortColors[event.effort_level] ||
                          "bg-gray-500/10 border-gray-500/20 text-gray-400"
                        }`}
                      >
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs opacity-70 capitalize">
                          {event.event_type} · {event.effort_level} effort
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No events on this day
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">
                  Click on a day to see events
                </p>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="bg-gray-900/50 border-white/[0.06]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white">
                Effort Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="text-sm text-gray-400">Low</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="text-sm text-gray-400">Medium</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="text-sm text-gray-400">High</span>
              </div>
            </CardContent>
          </Card>

          {/* Month Quick Nav */}
          <Card className="bg-gray-900/50 border-white/[0.06]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white">
                Quick Nav
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-1.5">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setViewMonth(i)}
                    className={`rounded-md px-2 py-1.5 text-[10px] font-medium transition-all ${
                      i === viewMonth
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
