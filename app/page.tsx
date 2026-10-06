import catalogue from "../public/data/courses.json";

type Course = {
  NAME: string;
  USERDEFINED_ID: string;
  STARTDATE: string;
  LASTUPDATER_FIRSTNAME: string;
  CREATOR_FIRSTNAME: string;
};

const columns = [
  ["NAME", "Course name"],
  ["USERDEFINED_ID", "Course ID"],
  ["STARTDATE", "Start date"],
  ["LASTUPDATER_FIRSTNAME", "Updated by"],
  ["CREATOR_FIRSTNAME", "Created by"],
] as const;

const styles = ":root{--blue:#0c4da2;--yellow:#fde021;--ink:#1e1e1e;--grey:#c8c8c8;--pale:#f3f7fc;--white:#fff;font-family:Arial,sans-serif;color:var(--ink);background:#fff}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}button,input{font:inherit}.container{width:min(1280px,calc(100% - 96px));margin:auto}.hero-inner{padding:20px 0 24px}.hero-copy{max-width:900px}.eyebrow{margin:0 0 14px;font-size:12px;line-height:1.6;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--blue)}.dialogue{display:flex;align-items:center;gap:12px}.dialogue:before{content:'';width:26px;height:3px;background:var(--blue)}h1{margin:0;font-size:clamp(36px,5.4vw,78px);line-height:1.04;letter-spacing:-2px;text-transform:uppercase}.intro-text{margin:10px 0 0;font-size:16px;line-height:1.5}.wayfinding{background:var(--blue);color:#fff}.wayfinding-inner{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px 0}.wayfinding p{display:flex;flex-wrap:wrap;gap:8px 24px;margin:0;font-size:15px;font-weight:700}.wayfinding-number{color:var(--yellow)}.wayfinding-note{font-size:12px}.catalogue{padding:56px 0 80px}.section-heading{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:28px}h2{margin:0;font-size:clamp(24px,2.8vw,36px);line-height:1.15;letter-spacing:-1px;text-transform:uppercase}.section-note{max-width:430px;margin:0;color:#4b4b4b;font-size:13px;line-height:1.6}.view-tabs,.creator-tabs{display:flex;gap:8px;overflow-x:auto;padding:0 0 14px;scrollbar-width:thin}.view-tab,.creator-tab{flex:0 0 auto;border:2px solid var(--blue);background:#fff;color:var(--blue);padding:11px 16px;font-size:13px;font-weight:700;cursor:pointer}.view-tab:hover,.creator-tab:hover{background:var(--pale)}.view-tab[aria-selected='true'],.creator-tab[aria-selected='true']{background:var(--blue);color:#fff;box-shadow:inset 0 -4px 0 var(--yellow)}.creator-tabs{display:none;padding:4px 0 18px}.creator-tabs.visible{display:flex}.creator-tab{border-width:1px;padding:8px 13px;font-size:12px}.panel{border:1px solid var(--grey);border-top:7px solid var(--yellow)}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:22px 24px;border-bottom:1px solid var(--grey)}.summary{display:flex;align-items:center;gap:14px;min-width:240px}.count{display:grid;place-items:center;min-width:56px;height:56px;padding:0 10px;background:var(--yellow);font-size:22px;font-weight:700}.summary-copy{color:#555;font-size:13px;line-height:1.3}.summary-copy strong{display:block;color:var(--blue);font-size:12px;letter-spacing:1.1px;text-transform:uppercase}.search{position:relative;flex:1;max-width:480px}.search input{width:100%;height:48px;border:2px solid var(--blue);padding:0 46px 0 16px;outline:none}.search input:focus,.view-tab:focus-visible,.creator-tab:focus-visible{outline:3px solid var(--ink);outline-offset:3px;box-shadow:0 0 0 6px var(--yellow)}.search span{position:absolute;right:16px;top:10px;color:var(--blue);font-size:22px}.table-wrap{overflow:auto}table{width:100%;min-width:980px;border-collapse:collapse}th{position:sticky;top:0;z-index:1;padding:15px 16px;color:var(--blue);background:var(--pale);border-bottom:1px solid var(--grey);text-align:left;font-size:11px;letter-spacing:1px;text-transform:uppercase;white-space:nowrap}th button{display:flex;gap:7px;padding:0;border:0;background:transparent;color:inherit;cursor:pointer;font-weight:700;text-transform:inherit;letter-spacing:inherit}td{padding:16px;border-bottom:1px solid #e4e4e4;color:#3a3a3a;font-size:14px;line-height:1.45;vertical-align:top}tbody tr:hover{background:#fffde8}.course-name{min-width:270px;color:var(--ink);font-weight:700}.mono{color:var(--blue);font-family:ui-monospace,monospace;font-size:12px}.empty{display:none;padding:58px 24px;text-align:center;color:#555}.empty.visible{display:block}.empty strong{display:block;margin-bottom:7px;color:var(--ink);font-size:18px}.footer-note{padding:14px 24px;border-top:1px solid var(--grey);color:#555;background:var(--pale);font-size:12px}.status-dot{display:inline-block;width:8px;height:8px;margin-right:8px;background:var(--blue)}.site-footer{padding:42px 0;background:var(--blue);color:#fff}.site-footer .eyebrow{color:var(--yellow)}.footer-title{margin:0;font-size:clamp(24px,3vw,36px);line-height:1.2;font-weight:700}.footer-title span{color:var(--yellow)}@media(max-width:900px){.container{width:calc(100% - 64px)}.section-heading,.toolbar{align-items:stretch;flex-direction:column}.search{max-width:none}}@media(max-width:600px){.container{width:calc(100% - 40px)}.hero-inner{padding:16px 0 18px}h1{font-size:clamp(30px,9vw,44px);letter-spacing:-1px}.catalogue{padding:40px 0}.wayfinding-note{display:none}.view-tab{padding:10px 12px}}";

const clientScript = "(()=>{const input=document.getElementById('search');const tbody=document.getElementById('body');const count=document.getElementById('count');const summary=document.getElementById('summary');const title=document.getElementById('summary-title');const empty=document.getElementById('empty');const creatorTabs=document.getElementById('creator-tabs');const rows=[...tbody.querySelectorAll('tr')];const labels={all:'Tous les cours',creator:'Cours par créateur',today:'Cours du jour',days15:'Cours sur 15 jours',month:'Cours sur 1 mois'};let view='all',creator='',sortDir=1,sortIndex=2;const startOfDay=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());function inRange(row){if(view==='all')return true;if(view==='creator')return row.dataset.creator===creator;const raw=row.dataset.start;const date=new Date(raw);if(Number.isNaN(date.getTime()))return false;const now=startOfDay(new Date());const value=startOfDay(date);if(view==='today')return value.getTime()===now.getTime();if(view==='days15'){const end=new Date(now);end.setDate(end.getDate()+15);return value>=now&&value<end}if(view==='month'){const end=new Date(now);end.setMonth(end.getMonth()+1);return value>=now&&value<end}return true}function refresh(){const q=input.value.trim().toLowerCase();let n=0;rows.forEach(r=>{const show=inRange(r)&&(!q||r.dataset.search.includes(q));r.hidden=!show;if(show)n++});count.textContent=String(n);title.textContent=view==='creator'&&creator?creator:labels[view];summary.textContent=q?'résultat'+(n===1?'':'s')+' correspondant'+(n===1?'':'s'):view==='all'?'dans le fichier du jour':'dans cette sélection';empty.classList.toggle('visible',n===0)}input.addEventListener('input',refresh);document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-selected',String(x===b)));creatorTabs.classList.toggle('visible',view==='creator');refresh()}));document.querySelectorAll('[data-creator]').forEach(b=>b.addEventListener('click',()=>{creator=b.dataset.creator;document.querySelectorAll('[data-creator]').forEach(x=>x.setAttribute('aria-selected',String(x===b)));refresh()}));document.querySelectorAll('[data-sort]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.sort);sortDir=i===sortIndex?-sortDir:1;sortIndex=i;rows.sort((a,c)=>sortDir*(a.cells[i].dataset.sort||a.cells[i].textContent).localeCompare(c.cells[i].dataset.sort||c.cells[i].textContent,undefined,{numeric:true,sensitivity:'base'})).forEach(r=>tbody.appendChild(r));document.querySelectorAll('[data-sort]').forEach((x,j)=>x.querySelector('span').textContent=j===i?(sortDir===1?'↑':'↓'):'↕')}));const firstCreator=document.querySelector('[data-creator]');if(firstCreator){creator=firstCreator.dataset.creator;firstCreator.setAttribute('aria-selected','true')}refresh()})();";

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default function Home() {
  const courses = (catalogue.courses || []) as Course[];
  const creators = [...new Set(courses.map((course) => course.CREATOR_FIRSTNAME || "Non renseigné"))]
    .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
  const updated = catalogue.updatedAt
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(catalogue.updatedAt))
    : null;

  return <>
    <style dangerouslySetInnerHTML={{ __html: styles }} />
    <main id="top">
      <section className="hero" aria-labelledby="page-title">
        <div className="container hero-inner"><div className="hero-copy">
          <p className="eyebrow dialogue">Hello, learning colleague.</p>
          <h1 id="page-title">EU Learn Today</h1>
          <p className="intro-text">The clear catalogue, renewed every day.</p>
        </div></div>
      </section>
      <section className="wayfinding" aria-label="Catalogue process">
        <div className="container wayfinding-inner">
          <p><span className="wayfinding-step"><span className="wayfinding-number">01</span> Receive.</span><span className="wayfinding-step"><span className="wayfinding-number">02</span> Replace.</span><span className="wayfinding-step"><span className="wayfinding-number">03</span> Learn.</span></p>
          <span className="wayfinding-note">Daily updated</span>
        </div>
      </section>
      <section className="catalogue" id="catalogue"><div className="container">
        <div className="section-heading">
          <div><p className="eyebrow">Your daily learning offer</p><h2>Learning catalogue</h2></div>
          <p className="section-note">Search any course. Select a heading to sort the table.</p>
        </div>
        <nav className="view-tabs" aria-label="Sélection des cours" role="tablist">
          <button className="view-tab" type="button" role="tab" aria-selected="true" data-view="all">Tous</button>
          <button className="view-tab" type="button" role="tab" aria-selected="false" data-view="creator">Par créateur</button>
          <button className="view-tab" type="button" role="tab" aria-selected="false" data-view="today">Aujourd’hui</button>
          <button className="view-tab" type="button" role="tab" aria-selected="false" data-view="days15">15 jours</button>
          <button className="view-tab" type="button" role="tab" aria-selected="false" data-view="month">1 mois</button>
        </nav>
        <nav className="creator-tabs" id="creator-tabs" aria-label="Créateurs" role="tablist">
          {creators.map((creator) => <button className="creator-tab" type="button" role="tab" aria-selected="false" data-creator={creator.toLowerCase()} key={creator}>{creator}</button>)}
        </nav>
        <section className="panel" aria-label="Upcoming courses catalogue">
          <div className="toolbar">
            <div className="summary"><span className="count" id="count">{courses.length}</span><span className="summary-copy"><strong id="summary-title">Tous les cours</strong><span id="summary">dans le fichier du jour</span></span></div>
            <label className="search"><span aria-hidden="true">⌕</span><input id="search" placeholder="Rechercher un cours…" aria-label="Rechercher des cours" /></label>
          </div>
          <div className="table-wrap"><table><thead><tr>
            {columns.map(([key, label], index) => <th key={key}><button type="button" data-sort={index}>{label} <span aria-hidden="true">{key === "STARTDATE" ? "↑" : "↕"}</span></button></th>)}
          </tr></thead><tbody id="body">
            {courses.map((course, index) => <tr key={course.USERDEFINED_ID + "-" + index} data-search={Object.values(course).join(" ").toLowerCase()} data-start={course.STARTDATE} data-creator={(course.CREATOR_FIRSTNAME || "Non renseigné").toLowerCase()}>
              {columns.map(([key]) => <td key={key} data-sort={course[key]} className={key === "NAME" ? "course-name" : key === "USERDEFINED_ID" ? "mono" : undefined}>{key === "STARTDATE" ? displayDate(course[key]) : course[key] || "—"}</td>)}
            </tr>)}
          </tbody></table></div>
          <div className="empty" id="empty"><strong>Aucun cours dans cette période.</strong>Essayez un autre onglet ou effacez votre recherche.</div>
          <div className="footer-note"><span className="status-dot" />{updated ? "Last replacement: " + updated : "Automatic daily replacement is ready"}</div>
        </section>
      </div></section>
    </main>
    <footer className="site-footer"><div className="container"><p className="eyebrow">L&amp;D, a fresh start, every day</p><p className="footer-title">big on learning.<br/><span>Creativity on the side.</span></p></div></footer>
    <script dangerouslySetInnerHTML={{ __html: clientScript }} />
  </>;
}
