"use client";

import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  isAfter,
  addMonths,
  subMonths,
} from "date-fns";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");

  // Days of current month
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || {};
    setNotes(savedNotes);
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Month change
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Handle date click
  const handleDateClick = (day) => {
    if (!selectedRange.start || selectedRange.end) {
      setSelectedRange({ start: day, end: null });
    } else {
      if (isAfter(day, selectedRange.start)) {
        setSelectedRange({ ...selectedRange, end: day });
      } else {
        setSelectedRange({ start: day, end: selectedRange.start });
      }
    }
  };

  // Check selected
  const isSelected = (day) => {
    if (selectedRange.start && selectedRange.end) {
      return isWithinInterval(day, {
        start: selectedRange.start,
        end: selectedRange.end,
      });
    }
    return selectedRange.start && isSameDay(day, selectedRange.start);
  };

  // Add note
  const addNote = () => {
    if (selectedRange.start && noteInput.trim() !== "") {
      const key = format(selectedRange.start, "yyyy-MM-dd");
      setNotes({ ...notes, [key]: noteInput });
      setNoteInput("");
    }
  };

  // Delete note
  const deleteNote = (date) => {
    const updated = { ...notes };
    delete updated[date];
    setNotes(updated);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      
      {/* HERO + MONTH CONTROLS */}
      <div style={{ textAlign: "center" }}>
        <img
          src="https://source.unsplash.com/800x300/?calendar,nature"
          alt="hero"
          style={{ borderRadius: "10px", width: "100%" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={prevMonth}
            style={{
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              background: "#ddd",
            }}
          >
            ◀ Prev
          </button>

          <h2 style={{ margin: 0 }}>
            {format(currentDate, "MMMM yyyy")}
          </h2>

          <button
            onClick={nextMonth}
            style={{
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              background: "#ddd",
            }}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {days.map((day) => (
          <div
            key={day.toString()}
            onClick={() => handleDateClick(day)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "center",
              background: isSelected(day) ? "#4CAF50" : "#eee",
              color: isSelected(day) ? "white" : "black",
              fontWeight: "bold",
            }}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>

      {/* NOTES SECTION */}
      <div style={{ marginTop: "30px" }}>
        <h3>Add Note</h3>

        <input
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Write note..."
          style={{
            padding: "10px",
            width: "70%",
            marginRight: "10px",
          }}
        />

        <button
          onClick={addNote}
          style={{
            padding: "10px 15px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save
        </button>

        {/* NOTES LIST */}
        <div style={{ marginTop: "20px" }}>
          <h4>Your Notes</h4>

          {Object.keys(notes).length === 0 && <p>No notes yet</p>}

          {Object.keys(notes).map((date) => (
            <div
              key={date}
              style={{
                marginBottom: "10px",
                padding: "10px",
                background: "black",
                borderRadius: "5px",
              }}
            >
              <b>{date}</b>: {notes[date]}

              <button
                onClick={() => deleteNote(date)}
                style={{
                  marginLeft: "10px",
                  color: "red",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}