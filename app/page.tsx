import { CoursesTable } from "./CoursesTable";

export default function Home() {
  return (
    <>
      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow dialogue">Hello, learning colleague.</p>
              <h1 id="page-title">EU Learn Today</h1>
              <p className="intro-text">
                <span>Explore the latest learning offer received by email.</span>
                <span>One clear catalogue, automatically renewed every day.</span>
              </p>
              <a className="primary-link" href="#catalogue">Browse the catalogue <span aria-hidden="true">↓</span></a>
            </div>
            <div className="kiwi-feature" aria-hidden="true">
              <img className="kiwi-blob" src="/EU.Learn.UpcomingCourses/kiwi-blob.webp" alt="" width="1400" height="894" />
              <img className="kiwi-art" src="/EU.Learn.UpcomingCourses/kiwi-large.webp" alt="" width="1400" height="898" />
            </div>
          </div>
        </section>

        <section className="wayfinding" aria-label="Catalogue process">
          <div className="container wayfinding-inner">
            <p>
              <span className="wayfinding-step"><span className="wayfinding-number">01</span> Receive.</span>
              <span className="wayfinding-step"><span className="wayfinding-number">02</span> Replace.</span>
              <span className="wayfinding-step"><span className="wayfinding-number">03</span> Learn.</span>
            </p>
            <span className="wayfinding-note">Updated from the daily CSV file</span>
          </div>
        </section>

        <section className="catalogue" id="catalogue">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your daily learning offer</p>
                <h2>Learning catalogue</h2>
              </div>
              <p className="section-note">Search any course, identifier or colleague. Select a heading to sort the table.</p>
            </div>
            <CoursesTable />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-copy">
            <p className="eyebrow">L&amp;D, a fresh start, every day</p>
            <p className="footer-title">big on learning.<br /><span>Creativity on the side.</span></p>
          </div>
          <img className="footer-community" src="/EU.Learn.UpcomingCourses/footer-community.webp" alt="" width="1500" height="900" />
        </div>
      </footer>
    </>
  );
}
