import { CoursesTable } from "./CoursesTable";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow">EU · LEARNING CATALOGUE</div>
        <div className="hero-grid">
          <div>
            <h1 id="page-title">Upcoming courses</h1>
            <p className="intro">
              The latest course catalogue received by email, refreshed
              automatically every day.
            </p>
          </div>
          <div className="hero-mark" aria-hidden="true">EU</div>
        </div>
      </section>
      <CoursesTable />
    </main>
  );
}
