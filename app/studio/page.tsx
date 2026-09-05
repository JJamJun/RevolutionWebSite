"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { withBasePath } from "../site-path";

export const dynamic = "force-static";

type StudioArea = "games" | "history" | "activities" | "teams";
type StudioItem = { id: string; label: string; preview: string; storedName?: string; file?: File; title?: string; text?: string };
type TeamItem = { id: string; teamName: string; gameName: string; description: string; preview: string; storedName?: string; file?: File };

const historyDefaults = ["history-1997.png", "history-1998.png", "history-1999.png"];
const activityDefaults = ["activity-bootcamp.jpg", "activity-awards-2026.png", "activity-external.jpg"];
const sectionLabels = {
  history: ["1997", "1998–1999", "1999–2002"],
  activities: ["부트캠프", "레볼루션 공모전", "각종 외부 활동"],
};
const sectionCopyDefaults = {
  history: [
    { title: "레볼루션의 탄생 — 혁명 Since 1997", text: "1997년 10월 8일, 게임을 즐기는 것을 넘어 직접 만들어보고자 한 사람들이 아마추어 게임 개발 팀 ‘혁명 Since 1997’을 결성했습니다. 자취방에 작업실을 마련해 보름이 넘는 작업 끝에 첫 작품 ‘농장을 지켜라’를 완성하며 본격적인 활동을 시작했습니다." },
    { title: "레볼루션의 성장 — 학부동아리 승격", text: "더 많은 사람들과 함께하기 위해 경북대 전자전기공학부 A반 내 소모임 ‘혁명’으로 활동하며 ‘농장을 지켜라! Ver1.5’를 발표했습니다. ‘Seek Square 1998’에 ‘농장야화’와 ‘Electron 모험기’로 참가해 우수상을 수상했고, 1999년 학부동아리 ‘REVOLUTION’으로 발전했습니다." },
    { title: "레볼루션의 활동과 성과", text: "해마다 2~3개 작품을 개발하며 ‘Seek Square 1999’부터 ‘Seek Square 2002’까지 4년 연속 작품전 1위를 차지했습니다. A.G.C 아마추어 게임 제작 공모전에서도 ‘뽕 2002’와 ‘얌미르’로 연말 대상 최우수상, 손노리상, 하반기 가작, 소프트맥스상, KRG소프트상을 수상했습니다." },
  ],
  activities: [
    { title: "부트캠프", text: "레볼루션은 매 학기, 유니티가 낯선 초보 개발자도 자신만의 첫 작품을 완성할 수 있도록 자체 부트캠프를 엽니다.\n기초부터 작은 프로젝트의 완성까지, 함께 배우고 직접 만들어보는 가장 든든한 출발선입니다." },
    { title: "레볼루션 공모전", text: "한 사람의 아이디어가 하나의 게임으로 자라나는 순간을 응원합니다. 1인 개발 게임 공모전을 통해 창작의 동력을 나누고, 공정한 심사와 시상으로 각자의 도전이 빛날 수 있는 무대를 만듭니다." },
    { title: "각종 외부 활동", text: "크래프톤 배터그라운드 정글 프로그램과 대구 · 경북 게임잼, 대학 간 교류까지. 레볼루션은 교실 밖의 현장에서 새로운 사람과 아이디어를 만나며, 다시 오기 어려운 경험을 함께 만들어갑니다." },
  ],
};
const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
const makeSectionItems = (names: string[], labels: string[], copy: { title: string; text: string }[]) => names.map((name, index) => ({ id: makeId(), label: labels[index], preview: withBasePath(`/${name}`), storedName: name, title: copy[index].title, text: copy[index].text }));

export default function StudioPage() {
  const [activeArea, setActiveArea] = useState<StudioArea>("games");
  const [items, setItems] = useState<StudioItem[]>([]);
  const [historyItems, setHistoryItems] = useState<StudioItem[]>(() => makeSectionItems(historyDefaults, sectionLabels.history, sectionCopyDefaults.history));
  const [activityItems, setActivityItems] = useState<StudioItem[]>(() => makeSectionItems(activityDefaults, sectionLabels.activities, sectionCopyDefaults.activities));
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [gamesFolderHandle, setGamesFolderHandle] = useState<any>(null);
  const [publicFolderHandle, setPublicFolderHandle] = useState<any>(null);
  const [notice, setNotice] = useState("대문 · 게임 갤러리");

  useEffect(() => {
    fetch(withBasePath("/games/manifest.json"), { cache: "no-store" })
      .then((response) => response.json())
      .then((manifest: { items?: string[] }) => setItems((manifest.items ?? []).map((name) => ({ id: makeId(), label: name, preview: withBasePath(`/games/${name}`), storedName: name }))))
      .catch(() => setNotice("게임 목록을 불러오지 못했습니다."));

    fetch(withBasePath("/content-images.json"), { cache: "no-store" })
      .then((response) => response.json())
      .then((manifest: { history?: string[]; activities?: string[] }) => {
        const historyNames = manifest.history?.length === 3 ? manifest.history : historyDefaults;
        const activityNames = manifest.activities?.length === 3 ? manifest.activities : activityDefaults;
        setHistoryItems((current) => makeSectionItems(historyNames, sectionLabels.history, current.map((item, index) => ({ title: item.title ?? sectionCopyDefaults.history[index].title, text: item.text ?? sectionCopyDefaults.history[index].text }))));
        setActivityItems((current) => makeSectionItems(activityNames, sectionLabels.activities, current.map((item, index) => ({ title: item.title ?? sectionCopyDefaults.activities[index].title, text: item.text ?? sectionCopyDefaults.activities[index].text }))));
      })
      .catch(() => setNotice("History와 Activities 사진 목록을 불러오지 못했습니다."));

    fetch(withBasePath("/content-copy.json"), { cache: "no-store" })
      .then((response) => response.json())
      .then((manifest: { history?: { title: string; text: string }[]; activities?: { title: string; text: string }[] }) => {
        if (manifest.history?.length === 3) setHistoryItems((current) => current.map((item, index) => ({ ...item, title: manifest.history![index].title, text: manifest.history![index].text })));
        if (manifest.activities?.length === 3) setActivityItems((current) => current.map((item, index) => ({ ...item, title: manifest.activities![index].title, text: manifest.activities![index].text })));
      })
      .catch(() => setNotice("History와 Activities 텍스트 목록을 불러오지 못했습니다."));

    fetch(withBasePath("/team-content.json"), { cache: "no-store" })
      .then((response) => response.json())
      .then((manifest: { teams?: { id: string; teamName: string; gameName: string; description: string; image: string }[] }) => setTeams((manifest.teams ?? []).map((team) => ({ ...team, preview: team.image ? withBasePath(`/${team.image}`) : "", storedName: team.image || undefined }))))
      .catch(() => setNotice("프로젝트 정보 목록을 불러오지 못했습니다."));
  }, []);

  const selectArea = (area: StudioArea) => {
    setActiveArea(area);
    setNotice(area === "games" ? "대문 · 게임 갤러리" : area === "teams" ? "Team · 프로젝트 정보 나열" : `${area === "history" ? "History" : "Activities"} · 3개 콘텐츠`);
  };

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const added = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/")).map((file) => ({ id: makeId(), label: file.name, preview: URL.createObjectURL(file), file }));
    setItems((current) => [...current, ...added]);
    event.target.value = "";
  };

  const replaceSectionImage = (area: "history" | "activities", index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const update = (current: StudioItem[]) => current.map((item, itemIndex) => itemIndex === index ? { ...item, preview: URL.createObjectURL(file), file } : item);
    if (area === "history") setHistoryItems(update);
    else setActivityItems(update);
    setNotice(`${area === "history" ? "History" : "Activities"} ${index + 1}번 사진을 선택했습니다. 변경사항 저장을 눌러주세요.`);
    event.target.value = "";
  };

  const updateSectionCopy = (area: "history" | "activities", index: number, field: "title" | "text", value: string) => {
    const update = (current: StudioItem[]) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item);
    if (area === "history") setHistoryItems(update);
    else setActivityItems(update);
    setNotice(`${area === "history" ? "History" : "Activities"} ${index + 1}번 텍스트를 수정했습니다. 변경사항 저장을 눌러주세요.`);
  };

  const moveItem = (index: number, direction: -1 | 1) => setItems((current) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= current.length) return current;
    const next = [...current];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    return next;
  });

  const addTeam = () => setTeams((current) => [...current, { id: makeId(), teamName: "", gameName: "프로젝트 이름", description: "프로젝트에 대한 설명을 입력해 주세요.", preview: "" }]);
  const updateTeam = (id: string, field: "gameName" | "description", value: string) => setTeams((current) => current.map((team) => team.id === id ? { ...team, [field]: value } : team));
  const replaceTeamImage = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setTeams((current) => current.map((team) => team.id === id ? { ...team, file, preview: URL.createObjectURL(file) } : team));
    setNotice("프로젝트 사진을 선택했습니다. 변경사항 저장을 눌러주세요.");
    event.target.value = "";
  };
  const moveTeam = (index: number, direction: -1 | 1) => setTeams((current) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= current.length) return current;
    const next = [...current];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    return next;
  });

  const applyGames = async () => {
    const handle = gamesFolderHandle ?? await (window as any).showDirectoryPicker({ mode: "readwrite" });
    setGamesFolderHandle(handle);
    const savedItems: StudioItem[] = [];
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const extension = item.file?.name.split(".").pop() || "png";
      const storedName = item.storedName ?? `game-${Date.now()}-${String(index + 1).padStart(2, "0")}.${extension}`;
      if (item.file) {
        const fileHandle = await handle.getFileHandle(storedName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(item.file);
        await writable.close();
      }
      savedItems.push({ ...item, storedName, preview: withBasePath(`/games/${storedName}`), file: undefined });
    }
    const manifestHandle = await handle.getFileHandle("manifest.json", { create: true });
    const manifestWriter = await manifestHandle.createWritable();
    await manifestWriter.write(JSON.stringify({ items: savedItems.map((item) => item.storedName) }, null, 2));
    await manifestWriter.close();
    setItems(savedItems);
    setNotice(`${savedItems.length}개 작품을 적용했습니다. 대문을 새로고침하면 반영됩니다.`);
  };

  const applySection = async (area: "history" | "activities") => {
    const handle = publicFolderHandle ?? await (window as any).showDirectoryPicker({ mode: "readwrite" });
    setPublicFolderHandle(handle);
    const source = area === "history" ? historyItems : activityItems;
    const saved: StudioItem[] = [];
    const stamp = Date.now();
    for (let index = 0; index < source.length; index += 1) {
      const item = source[index];
      let storedName = item.storedName;
      if (item.file) {
        const extension = (item.file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
        storedName = `${area}-${index + 1}-${stamp}.${extension}`;
        const fileHandle = await handle.getFileHandle(storedName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(item.file);
        await writable.close();
      }
      saved.push({ ...item, storedName, preview: withBasePath(`/${storedName}`), file: undefined });
    }
    const historyNames = area === "history" ? saved.map((item) => item.storedName) : historyItems.map((item) => item.storedName);
    const activityNames = area === "activities" ? saved.map((item) => item.storedName) : activityItems.map((item) => item.storedName);
    const manifestHandle = await handle.getFileHandle("content-images.json", { create: true });
    const manifestWriter = await manifestHandle.createWritable();
    await manifestWriter.write(JSON.stringify({ history: historyNames, activities: activityNames }, null, 2));
    await manifestWriter.close();
    const nextHistoryItems = area === "history" ? saved : historyItems;
    const nextActivityItems = area === "activities" ? saved : activityItems;
    const copyHandle = await handle.getFileHandle("content-copy.json", { create: true });
    const copyWriter = await copyHandle.createWritable();
    await copyWriter.write(JSON.stringify({
      history: nextHistoryItems.map((item) => ({ title: item.title ?? "", text: item.text ?? "" })),
      activities: nextActivityItems.map((item) => ({ title: item.title ?? "", text: item.text ?? "" })),
    }, null, 2));
    await copyWriter.close();
    if (area === "history") setHistoryItems(saved);
    else setActivityItems(saved);
    setNotice(`${area === "history" ? "History" : "Activities"} 사진과 텍스트를 적용했습니다. 사이트를 새로고침하면 반영됩니다.`);
  };

  const applyTeams = async () => {
    const handle = publicFolderHandle ?? await (window as any).showDirectoryPicker({ mode: "readwrite" });
    setPublicFolderHandle(handle);
    const stamp = Date.now();
    const savedTeams: TeamItem[] = [];
    for (let index = 0; index < teams.length; index += 1) {
      const team = teams[index];
      let storedName = team.storedName;
      if (team.file) {
        const extension = (team.file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
        storedName = `team-${index + 1}-${stamp}.${extension}`;
        const fileHandle = await handle.getFileHandle(storedName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(team.file);
        await writable.close();
      }
      savedTeams.push({ ...team, storedName, preview: storedName ? withBasePath(`/${storedName}`) : "", file: undefined });
    }
    const contentHandle = await handle.getFileHandle("team-content.json", { create: true });
    const contentWriter = await contentHandle.createWritable();
    await contentWriter.write(JSON.stringify({ teams: savedTeams.map((team) => ({ id: team.id, teamName: team.teamName, gameName: team.gameName, description: team.description, image: team.storedName ?? "" })) }, null, 2));
    await contentWriter.close();
    setTeams(savedTeams);
    setNotice(`${savedTeams.length}개 프로젝트 정보를 저장했습니다. Team 페이지를 새로고침하면 반영됩니다.`);
  };

  const apply = async () => {
    try {
      if (activeArea === "games") await applyGames();
      else if (activeArea === "teams") await applyTeams();
      else await applySection(activeArea);
    } catch {
      setNotice(activeArea === "games" ? "저장하려면 프로젝트의 public/games 폴더를 선택해 주세요." : "저장하려면 프로젝트의 public 폴더를 선택해 주세요.");
    }
  };

  const sectionItems = activeArea === "history" ? historyItems : activityItems;
  const areaTitle = activeArea === "history" ? "History 콘텐츠" : "Activities 콘텐츠";

  return <main className="studio-page">
    <header className="studio-header"><div><p>REVOLUTION LOCAL STUDIO</p><h1>콘텐츠 관리자</h1></div><a href={withBasePath("/")}>사이트 보기 ↗</a></header>
    <section className="studio-shell">
      <aside className="studio-sidebar"><p className="studio-label">CONTENT AREAS</p><button className={`studio-area ${activeArea === "games" ? "is-active" : ""}`} onClick={() => selectArea("games")}>대문 <span>게임 갤러리</span></button><button className={`studio-area ${activeArea === "history" ? "is-active" : ""}`} onClick={() => selectArea("history")}>History <span>사진 1 · 2 · 3</span></button><button className={`studio-area ${activeArea === "activities" ? "is-active" : ""}`} onClick={() => selectArea("activities")}>Activities <span>사진 1 · 2 · 3</span></button><button className={`studio-area ${activeArea === "teams" ? "is-active" : ""}`} onClick={() => selectArea("teams")}>프로젝트 정보 나열 <span>Team 페이지 콘텐츠</span></button><p className="studio-help">게임 갤러리는 public/games 폴더를, 나머지 콘텐츠는 프로젝트의 public 폴더를 선택해 주세요.</p></aside>
      <section className="studio-workspace">
        {activeArea === "games" ? <><div className="studio-topline"><div><p className="studio-label">HERO GAME GALLERY</p><h2>게임 썸네일</h2></div><label className="upload-button">이미지 추가<input type="file" accept="image/*" multiple onChange={addFiles} /></label></div><p className="studio-description">정렬 순서는 대문 배경의 노출 순서가 됩니다. 작품 수가 3의 배수가 아니어도 대문에서는 자동으로 빈칸 없이 이어집니다.</p><div className="studio-grid">{items.map((item, index) => <article className="studio-card" key={item.id}><img src={item.preview} alt="" /><div><span>{String(index + 1).padStart(2, "0")}</span><p>{item.label}</p></div><div className="studio-actions"><button onClick={() => moveItem(index, -1)} aria-label="앞으로 이동">←</button><button onClick={() => moveItem(index, 1)} aria-label="뒤로 이동">→</button><button onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label="삭제">×</button></div></article>)}</div></> : activeArea === "teams" ? <><div className="studio-topline"><div><p className="studio-label">TEAM PAGE CONTENT</p><h2>프로젝트 정보 나열</h2></div><button className="upload-button" type="button" onClick={addTeam}>프로젝트 추가</button></div><p className="studio-description">프로젝트 순서대로 Team 페이지에 영역이 생성됩니다. 설명에는 Enter 또는 &lt;br /&gt; 줄바꿈을 사용할 수 있습니다.</p><div className="studio-team-list">{teams.map((team, index) => <article className="studio-team-card" key={team.id}><div className="studio-team-media">{team.preview ? <img src={team.preview} alt={`${team.gameName} 미리보기`} /> : <div>600 × 500<br />PROJECT IMAGE</div>}<label className="studio-replace-button">사진 선택<input type="file" accept="image/*" onChange={(event) => replaceTeamImage(team.id, event)} /></label></div><div className="studio-team-fields"><p className="studio-label">{String(index + 1).padStart(2, "0")} / PROJECT</p><label>프로젝트 이름<input value={team.gameName} onChange={(event) => updateTeam(team.id, "gameName", event.target.value)} /></label><label>프로젝트 설명<textarea rows={7} value={team.description} onChange={(event) => updateTeam(team.id, "description", event.target.value)} /></label><small>Enter 또는 &lt;br /&gt;로 줄바꿈</small><div className="studio-team-actions"><button onClick={() => moveTeam(index, -1)} aria-label="위로 이동">↑</button><button onClick={() => moveTeam(index, 1)} aria-label="아래로 이동">↓</button><button onClick={() => setTeams((current) => current.filter((entry) => entry.id !== team.id))} aria-label="프로젝트 삭제">프로젝트 삭제</button></div></div></article>)}{!teams.length && <div className="studio-team-empty">등록된 프로젝트가 없습니다. ‘프로젝트 추가’를 눌러 시작해 주세요.</div>}</div></> : <><div className="studio-topline"><div><p className="studio-label">{activeArea.toUpperCase()} CONTENT SLOTS</p><h2>{areaTitle}</h2></div></div><p className="studio-description">사진과 제목, 설명을 수정한 뒤 변경사항 저장을 눌러주세요. 설명 입력창에서 Enter 또는 &lt;br /&gt;를 입력하면 사이트에서 줄바꿈됩니다.</p><div className="studio-grid studio-section-grid">{sectionItems.map((item, index) => <article className="studio-card studio-section-card" key={item.id}><img src={item.preview} alt={`${item.label} 미리보기`} /><div><span>{String(index + 1).padStart(2, "0")}</span><p>{item.label}</p></div><label className="studio-replace-button">사진 교체<input type="file" accept="image/*" onChange={(event) => replaceSectionImage(activeArea, index, event)} /></label><div className="studio-copy-fields"><label>제목<input type="text" value={item.title ?? ""} onChange={(event) => updateSectionCopy(activeArea, index, "title", event.target.value)} /></label><label>설명<textarea rows={7} value={item.text ?? ""} onChange={(event) => updateSectionCopy(activeArea, index, "text", event.target.value)} /></label><small>Enter 또는 &lt;br /&gt;로 줄바꿈</small></div></article>)}</div></>}
        <footer className="studio-footer"><p>{notice}</p><button className="apply-button" onClick={apply}>변경사항 저장</button></footer>
      </section>
    </section>
  </main>;
}
