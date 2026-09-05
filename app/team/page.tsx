"use client";

import { Fragment, useEffect, useState } from "react";

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
    fetch("/team-content.json", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((manifest: { teams?: TeamRecord[] } | null) => setTeams(manifest?.teams ?? []))
      .catch(() => undefined);
  }, []);

  return <main className="team-page">
    <header className="site-header">
      <div className="brand-row"><a className="brand-mark" href="/" aria-label="REVOLUTION 메인으로 이동"><img src="/revolution-logo.png" alt="REVOLUTION 동아리 로고" /></a><div className="brand-copy"><p>게임으로 100억 벌자</p><span>REVOLUTION&nbsp; | &nbsp;레볼루션</span></div></div>
      <nav className="main-navigation team-navigation" aria-label="Team 페이지 메뉴"><a href="/">MAIN ↙</a><span>TEAM</span></nav>
    </header>
    <section className="team-hero"><p className="section-index">REVOLUTION / TEAM ARCHIVE</p><h1>레볼루션 내에서 개발 중인<br />게임과 팀을 만나보세요!</h1><p>서로 다른 아이디어가 하나의 플레이로 완성되는 과정을 소개합니다.</p></section>
    {teams.length ? <div className="team-list">{teams.map((team, index) => <section className={`team-entry ${index % 2 === 1 ? "is-media-left" : ""}`} id={`team-${team.id}`} key={team.id}><div className="team-entry-copy"><p className="section-index">{String(index + 1).padStart(2, "0")} / {team.teamName || "TEAM"}</p><h2>{renderText(team.teamName || "이름 없는 팀")}</h2><h3>{renderText(team.gameName || "게임 이름을 입력해 주세요")}</h3><p>{renderText(team.description || "Studio에서 팀과 게임에 대한 설명을 입력해 주세요.")}</p></div><div className="team-entry-media">{team.image ? <img src={`/${team.image}`} alt={`${team.teamName}의 ${team.gameName} 대표 이미지`} /> : <div className="team-image-placeholder">TEAM IMAGE</div>}</div></section>)}</div> : <section className="team-empty"><p>아직 등록된 팀이 없습니다.</p><span>로컬 Studio의 ‘팀 정보 나열’에서 첫 번째 팀을 추가해 주세요.</span></section>}
    <footer className="site-footer"><span>REVOLUTION</span><span>Made by 23전준황</span></footer>
  </main>;
}
