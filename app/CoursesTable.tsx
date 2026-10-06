"use client";

import { useEffect, useMemo, useState } from "react";

type Course = {
  NAME: string;
  USERDEFINED_ID: string;
  STARTDATE: string;
  LASTUPDATER_FIRSTNAME: string;
  CREATOR_FIRSTNAME: string;
};

type CourseKey = keyof Course;

const columns: Array<{ key: CourseKey; label: string }> = [
  { key: "NAME", label: "Course name" },
  { key: "USERDEFINED_ID", label: "Course ID" },
  { key: "STARTDATE", label: "Start date" },
  { key: "LASTUPDATER_FIRSTNAME", label: "Updated by" },
  { key: "CREATOR_FIRSTNAME", label: "Created by" },
];

function displayDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function CoursesTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{ key: CourseKey; direction: "asc" | "desc" }>({ key: "STARTDATE", direction: "asc" });

  useEffect(() => {
    fetch("/EU.Learn.UpcomingCourses/data/courses.json", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("The daily catalogue is not available yet.");
        return response.json();
      })
      .then((payload) => {
        setCourses(Array.isArray(payload.courses) ? payload.courses : []);
        setUpdatedAt(payload.updatedAt ?? null);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load courses."))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return courses
      .filter((course) => !needle || Object.values(course).some((value) => String(value ?? "").toLocaleLowerCase().includes(needle)))
      .sort((a, b) => {
        const result = String(a[sort.key] ?? "").localeCompare(String(b[sort.key] ?? ""), undefined, { numeric: true, sensitivity: "base" });
        return sort.direction === "asc" ? result : -result;
      });
  }, [courses, query, sort]);

  const changeSort = (key: CourseKey) => setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));

  return (
    <section className="panel" aria-label="Upcoming courses catalogue">
      <div className="toolbar">
        <div className="summary">
          <span className="count">{rows.length}</span>
          <span className="summary-copy"><strong>Upcoming courses</strong>{query ? `of ${courses.length} matching` : "in the current file"}</span>
        </div>
        <label className="search">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by course, ID or person…" aria-label="Search courses" />
        </label>
      </div>

      {loading ? <div className="empty"><strong>Loading the catalogue…</strong>Please wait a moment.</div> : null}
      {!loading && error ? <div className="empty error"><strong>Catalogue unavailable</strong>{error}</div> : null}
      {!loading && !error && rows.length === 0 ? <div className="empty"><strong>{query ? "No matching course" : "Waiting for the first CSV file"}</strong>{query ? "Try a broader search." : "The table will be populated after the next accepted email."}</div> : null}

      {!loading && !error && rows.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead><tr>{columns.map((column) => <th key={column.key}><button onClick={() => changeSort(column.key)} aria-label={`Sort by ${column.label}`}>{column.label}<span aria-hidden="true">{sort.key === column.key ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}</span></button></th>)}</tr></thead>
            <tbody>{rows.map((course, index) => <tr key={`${course.USERDEFINED_ID}-${index}`}>{columns.map((column) => <td key={column.key} className={column.key === "NAME" ? "course-name" : column.key === "USERDEFINED_ID" ? "mono" : undefined}>{column.key === "STARTDATE" ? displayDate(course[column.key]) : course[column.key] || "—"}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : null}

      <div className="footer-note"><span className="status-dot" />{updatedAt ? `Last replacement: ${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(updatedAt))}` : "Automatic daily replacement is ready"}</div>
    </section>
  );
}
