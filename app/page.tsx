"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { withBasePath } from "./site-path";

export const dynamic = "force-static";

const defaultGameThumbnails = Array.from({ length: 28 }, (_, index) => withBasePath(`/games/game-${String(index + 1).padStart(2, "0")}.png`));
const gamesPerRow = 3;
const defaultContentImages = {
  history: ["history-1997.png", "history-1998.png", "history-1999.png"],
  activities: ["activity-bootcamp.jpg", "activity-awards-2026.png", "activity-external.jpg"],
};
const history = [
  { year: "1997", image: "/history-1997.png", title: "레볼루션의 탄생 — 혁명 Since 1997", text: "1997년 10월 8일, 게임을 즐기는 것을 넘어 직접 만들어보고자 한 사람들이 아마추어 게임 개발 팀 ‘혁명 Since 1997’을 결성했습니다. 자취방에 작업실을 마련해 보름이 넘는 작업 끝에 첫 작품 ‘농장을 지켜라’를 완성하며 본격적인 활동을 시작했습니다." },
  { year: "1998–1999", image: "/history-1998.png", title: "레볼루션의 성장 — 학부동아리 승격", text: "더 많은 사람들과 함께하기 위해 경북대 전자전기공학부 A반 내 소모임 ‘혁명’으로 활동하며 ‘농장을 지켜라! Ver1.5’를 발표했습니다. ‘Seek Square 1998’에 ‘농장야화’와 ‘Electron 모험기’로 참가해 우수상을 수상했고, 1999년 학부동아리 ‘REVOLUTION’으로 발전했습니다." },
  { year: "1999–2002", image: "/history-1999.png", title: "레볼루션의 활동과 성과", text: "해마다 2~3개 작품을 개발하며 ‘Seek Square 1999’부터 ‘Seek Square 2002’까지 4년 연속 작품전 1위를 차지했습니다. A.G.C 아마추어 게임 제작 공모전에서도 ‘뽕 2002’와 ‘얌미르’로 연말 대상 최우수상, 손노리상, 하반기 가작, 소프트맥스상, KRG소프트상을 수상했습니다." },
];

const activities = [
  { number: "01", image: "/activity-bootcamp.jpg", title: "부트캠프", text: "레볼루션은 매 학기, 유니티가 낯선 초보 개발자도 자신만의 첫 작품을 완성할 수 있도록 자체 부트캠프를 엽니다.\n기초부터 작은 프로젝트의 완성까지, 함께 배우고 직접 만들어보는 가장 든든한 출발선입니다." },
  { number: "02", image: "/activity-awards-2026.png", title: "레볼루션 공모전", text: "한 사람의 아이디어가 하나의 게임으로 자라나는 순간을 응원합니다. 1인 개발 게임 공모전을 통해 창작의 동력을 나누고, 공정한 심사와 시상으로 각자의 도전이 빛날 수 있는 무대를 만듭니다." },
  { number: "03", image: "/activity-external.jpg", title: "각종 외부 활동", text: "크래프톤 배터그라운드 정글 프로그램과 대구 · 경북 게임잼, 대학 간 교류까지. 레볼루션은 교실 밖의 현장에서 새로운 사람과 아이디어를 만나며, 다시 오기 어려운 경험을 함께 만들어갑니다." },
];

const defaultContentCopy = {
  history: history.map(({ title, text }) => ({ title, text })),
  activities: activities.map(({ title, text }) => ({ title, text })),
};
const renderText = (value: string) => value.split(/\r?\n|<br\s*\/?>/gi).map((part, index) => <Fragment key={`${index}-${part}`}>{index > 0 && <br />}{part}</Fragment>);

export default function Home() {
  const [scrollAmount, setScrollAmount] = useState(0);
  const [activeHistory, setActiveHistory] = useState(0);
  const [activeActivity, setActiveActivity] = useState(0);
  const [gameThumbnails, setGameThumbnails] = useState(defaultGameThumbnails);
  const [contentImages, setContentImages] = useState(defaultContentImages);
  const [contentCopy, setContentCopy] = useState(defaultContentCopy);
  const historyRef = useRef<HTMLElement>(null);
  const activitiesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateScroll = () => {
      setScrollAmount(Math.min(window.scrollY / 260, 1));
      const section = historyRef.current;
      if (!section) return;
      const start = section.offsetTop;
      const travel = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / travel));
      setActiveHistory(Math.min(history.length - 1, Math.floor(progress * history.length)));
      const activitySection = activitiesRef.current;
      if (!activitySection) return;
      const activityStart = activitySection.offsetTop;
      const activityTravel = activitySection.offsetHeight - window.innerHeight;
      const activityProgress = Math.max(0, Math.min(1, (window.scrollY - activityStart) / activityTravel));
      setActiveActivity(Math.min(activities.length - 1, Math.floor(activityProgress * activities.length)));
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    fetch(withBasePath("/games/manifest.json"), { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((manifest: { items?: string[] } | null) => {
        if (manifest?.items?.length) setGameThumbnails(manifest.items.map((item) => withBasePath(`/games/${item}`)));
      })
      .catch(() => undefined);

    fetch(withBasePath("/content-images.json"), { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((manifest: { history?: string[]; activities?: string[] } | null) => {
        if (!manifest) return;
        setContentImages({
          history: manifest.history?.length === 3 ? manifest.history : defaultContentImages.history,
          activities: manifest.activities?.length === 3 ? manifest.activities : defaultContentImages.activities,
        });
      })
      .catch(() => undefined);

    fetch(withBasePath("/content-copy.json"), { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((manifest: { history?: { title: string; text: string }[]; activities?: { title: string; text: string }[] } | null) => {
        if (!manifest) return;
        setContentCopy({
          history: manifest.history?.length === 3 ? manifest.history : defaultContentCopy.history,
          activities: manifest.activities?.length === 3 ? manifest.activities : defaultContentCopy.activities,
        });
      })
      .catch(() => undefined);
  }, []);

  const completeGameGrid = Array.from(
    { length: Math.ceil(gameThumbnails.length / gamesPerRow) * gamesPerRow },
    (_, index) => gameThumbnails[index % gameThumbnails.length],
  );

  return <main>
    <header className="site-header">
      <div className="brand-row"><a className="brand-mark" href="#top" aria-label="REVOLUTION 홈"><img src={withBasePath("/revolution-logo.png")} alt="REVOLUTION 동아리 로고" /></a><div className="brand-copy"><p>게임으로 100억 벌자</p><span>REVOLUTION&nbsp; | &nbsp;레볼루션</span></div></div>
      <nav className="main-navigation" aria-label="주요 메뉴"><div className="main-menu"><button type="button" aria-haspopup="true">MAIN <span>⌄</span></button><div className="main-dropdown"><a href="#history">HISTORY</a><a href="#activities">ACTIVITIES</a><a href="#contact">CONTACT</a></div></div><a className="team-link" href={withBasePath("/team/")} target="_blank" rel="noreferrer">TEAM ↗</a></nav>
    </header>
    <section className="hero" id="top">
      <div className="game-gallery" aria-hidden="true"><div className="game-gallery-track">{[0, 1, 2, 3].map((panel) => <div className="game-gallery-panel" key={panel}>{completeGameGrid.map((src, index) => <img src={src} alt="" key={`${panel}-${index}`} />)}</div>)}</div></div>
      <div className="hero-copy" style={{ opacity: 1 - scrollAmount, transform: `translateY(${scrollAmount * -88}px)` }}><p className="eyebrow">SINCE 1997</p><h1>Create<br />New World!</h1><p className="intro">게임을 즐기는 것을 넘어<br />직접 만들기 시작한 사람들의 커뮤니티.</p><span className="scroll-note">SCROLL TO EXPLORE <i>↓</i></span></div>
    </section>
    <section className="history" id="history" ref={historyRef}>
      <div className="history-pin">
        <div className="history-layout">
          <div className="history-text"><div className="history-heading"><p className="section-index">01 / HISTORY</p><h2>REVOLUTION<br />SINCE 1997</h2><p>게임을 즐기는 데서 한 걸음 더 나아가, 직접 만들기 시작한 사람들의 이야기입니다.</p></div><div className="timeline">{history.map((item, index) => <article className={`timeline-entry ${index === activeHistory ? "is-active" : ""}`} key={item.year} aria-hidden={index !== activeHistory}><p className="timeline-year">{item.year}</p><div><h3>{renderText(contentCopy.history[index].title)}</h3><p>{renderText(contentCopy.history[index].text)}</p></div></article>)}</div><div className="history-progress" aria-label={`${activeHistory + 1} of ${history.length}`}>{history.map((_, index) => <span className={index === activeHistory ? "is-active" : ""} key={index} />)}</div></div>
          <div className="history-media"><img key={contentImages.history[activeHistory]} src={withBasePath(`/${contentImages.history[activeHistory]}`)} alt={`${history[activeHistory].year} 레볼루션 활동 사진`} /></div>
        </div>
      </div>
    </section>
    <section className="history activities-story" id="activities" ref={activitiesRef}>
      <div className="history-pin">
        <div className="history-layout">
          <div className="history-text"><div className="history-heading"><p className="section-index">02 / ACTIVITIES</p><h2>What Does<br /><span className="about-title-line">REVOLUTION Do?</span></h2><p>배우고, 만들고, 더 넓은 게임의 세계와 연결되는 레볼루션의 활동입니다.</p></div><div className="timeline">{activities.map((item, index) => <article className={`timeline-entry ${index === activeActivity ? "is-active" : ""}`} key={item.number} aria-hidden={index !== activeActivity}><p className="timeline-year">{item.number}</p><div><h3>{renderText(contentCopy.activities[index].title)}</h3><p>{renderText(contentCopy.activities[index].text)}</p></div></article>)}</div><div className="history-progress" aria-label={`${activeActivity + 1} of ${activities.length}`}>{activities.map((_, index) => <span className={index === activeActivity ? "is-active" : ""} key={index} />)}</div></div>
          <div className="history-media"><img key={contentImages.activities[activeActivity]} src={withBasePath(`/${contentImages.activities[activeActivity]}`)} alt={`${activities[activeActivity].title} 활동 사진`} /></div>
        </div>
      </div>
    </section>
    <section className="contact-section" id="contact"><div className="contact-orbit" aria-hidden="true" /><div className="contact-copy"><p className="section-index">03 / CONTACT</p><h2>레볼루션 가입 문의<br /><span>Tel. 010-XXXX-XXXX</span></h2></div></section>
    <footer className="site-footer"><span>REVOLUTION</span><span>Made by 23전준황</span></footer>
  </main>;
}
