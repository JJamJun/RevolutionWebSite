"use client";

import { Fragment, useEffect, useState } from "react";
import { withBasePath } from "../site-path";

export const dynamic = "force-static";

type TeamRecord = {
  id: string;
  teamName: string;
  gameName: string;
  description: string;
  image: string;
};

const renderText = (value: string) => value.split(/\r?\n|<br\s*\/?>/gi).map((part, index) => <Fragment key={`${index}-${part}`}>{index > 0 && <br />}{part}</Fragment>);

export default function TeamPage() {
  const [teams, setTeams] = useState<TeamRecord[]>([]);

  useEffect(() => {
    fetch(withBasePath("/team-content.json"), { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((manifest: { teams?: TeamRecord[] } | null) => setTeams(manifest?.teams ?? []))
      .catch(() => undefined);
  }, []);

  return <main className="team-page">
    <header className="site-header">
      <div className="brand-row"><a className="brand-mark" href={withBasePath("/")} aria-label="REVOLUTION 메인으로 이동"><img src={withBasePath("/revolution-logo.png")} alt="REVOLUTION 동아리 로고" /></a><div className="brand-copy"><p>게임으로 100억 벌자</p><span>REVOLUTION&nbsp; | &nbsp;레볼루션</span></div></div>
      <nav className="main-navigation team-navigation" aria-label="Team 페이지 메뉴"><a href={withBasePath("/")}>MAIN ↙</a><span>TEAM</span></nav>
    </header>
    <section className="team-hero"><p className="section-index">REVOLUTION / TEAM ARCHIVE</p><h1>레볼루션 내에서 개발 중인<br />게임과 팀을 만나보세요!</h1><p>서로 다른 아이디어가 하나의 플레이로 완성되는 과정을 소개합니다.</p></section>
    {teams.length ? <>
      <section className="team-directory" aria-labelledby="team-directory-title">
        <div className="team-directory-heading">
          <h2 id="team-directory-title">레볼루션은 다양하고 참신하며 기발한 게임을 개발하고 있습니다!</h2>
          <p className="section-index">PROJECT INDEX / {String(teams.length).padStart(2, "0")}</p>
        </div>
        <nav className="team-directory-grid" aria-label="프로젝트 목록">
          {teams.map((team) => <a className="team-directory-card" href={`#team-${team.id}`} aria-label={`${team.gameName} 소개로 이동`} key={`directory-${team.id}`}>
            {team.image ? <img src={withBasePath(`/${team.image}`)} alt="" /> : <div className="team-directory-placeholder">NO IMAGE</div>}
            <span>{team.gameName || "이름 없는 프로젝트"}</span>
          </a>)}
        </nav>
      </section>
      <div className="team-list">{teams.map((team, index) => <section className="team-entry" id={`team-${team.id}`} key={team.id}>
        <div className="team-entry-media">{team.image ? <img src={withBasePath(`/${team.image}`)} alt={`${team.gameName} 대표 이미지`} /> : <div className="team-image-placeholder">PROJECT IMAGE</div>}</div>
        <div className="team-entry-copy"><p className="section-index">{String(index + 1).padStart(2, "0")} / PROJECT</p><h2>{renderText(team.gameName || "프로젝트 이름을 입력해 주세요")}</h2><p>{renderText(team.description || "Studio에서 프로젝트 설명을 입력해 주세요.")}</p></div>
      </section>)}</div>
    </> : <section className="team-empty"><p>아직 등록된 프로젝트가 없습니다.</p><span>로컬 Studio의 ‘프로젝트 정보 나열’에서 첫 번째 프로젝트를 추가해 주세요.</span></section>}
    <footer className="site-footer"><span>REVOLUTION</span><span>Made by 23전준황</span></footer>
  </main>;
}
