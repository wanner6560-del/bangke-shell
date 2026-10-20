import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { asset, sampleEntries } from './sample-data.js'
import './showcase.css'

const base = import.meta.env.BASE_URL
const experience = `蚌壳 SHELL｜独立产品设计与 AI 协作开发｜个人原型项目
针对截图、日记与灵感分散存储、缺少情绪化回看体验的问题，定义“私人视觉档案”产品方向，完成需求收敛、视觉系统与交互方案。
通过自然语言提出需求与验收标准，与 AI 编程助手协作，使用 React 19、Vite 8 构建移动端优先的 PWA；实现图文记录、本地持久化、拼贴/网格/时间线浏览、Canvas 视觉卡片导出与每日句子。
将完整宠物养成与真实 AI 接入分阶段处理，先验证记录—回看—分享链路；公开演示采用虚构文案与原创 SVG，配置 GitHub Pages 工作流并编写产品、架构与交接文档。
项目状态：可交互原型；AI 旁注与推荐为预设示例，无真实模型调用；尚未进行规模化用户验证。`

const exhibits = [
  { key: 'today', name: '每日水域', title: '先遇见一点惊喜，\n再决定写些什么。', text: '以培养皿和按日期轮换的短句代替任务面板。打开的理由，可以只是一点好奇。', note: '已实现 / 日期轮换 · 环境动效', number: 'DAILY RITUAL' },
  { key: 'drift', name: '漂流拼贴', title: '同一段记忆，\n可以拥有两种秩序。', text: '散漫模式让图像像记忆一样叠放；收拢模式把它们变成容易浏览的网格。切换布局，不改变记录本身。', note: '已实现 / 拼贴与网格切换', number: 'VISUAL MEMORY' },
  { key: 'archive', name: '秩序档案', title: '当你想认真寻找，\n它们也有迹可循。', text: '时间、标题、摘录与意象并列。给随性的收藏，保留一个可以重新读懂的入口。', note: '已实现 / 按保存顺序回看', number: 'A QUIET ORDER' },
  { key: 'share', name: '视觉卡片', title: '分享一小片自己，\n不必打开整本日记。', text: '从选中记录生成一张图文卡片。公开的是当前摘录，完整正文、标签和旁注仍然留在壳里。', note: '已实现 / 1080 × 1440 PNG 导出', number: 'SHARE A FRAGMENT' },
]

function Arrow() { return <span aria-hidden="true">↗</span> }
function ShellMark() { return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M5 30C5 19 12 7 20 4c8 3 15 15 15 26M11 30c0-8 4-17 9-22 5 5 9 14 9 22M20 8v22M4 33h32" stroke="currentColor" strokeWidth="1.4"/></svg> }
function Kicker({ children, light = false }) { return <div className={`sc-kicker ${light ? 'sc-kicker-light' : ''}`}><span/>{children}</div> }

function Specimen({ className = '' }) {
  return <div className={`sc-specimen ${className}`} aria-hidden="true"><div className="sc-specimen-haze"/><div className="sc-dish sc-dish-back"/><div className="sc-dish sc-dish-front"/><div className="sc-shell-fan">{Array.from({ length: 11 }, (_, i) => <span key={i} style={{ '--rib': i }}/>)}</div><div className="sc-specimen-pearl"/><span className="sc-float-dot dot-a"/><span className="sc-float-dot dot-b"/><span className="sc-float-dot dot-c"/></div>
}

function PhonePreview({ view }) {
  const [gathered, setGathered] = useState(false)
  return <div className="sc-phone"><div className="sc-phone-top"><span>9:41</span><span className="sc-phone-island"/><span>▰</span></div><div className={`sc-phone-screen sc-screen-${view}`}>
    {view === 'today' && <><div className="sc-mini-heading"><small>PRIVATE SPECIMEN ARCHIVE</small><h3>今日水域</h3><span>雾里的第一个早晨</span></div><div className="sc-mini-vessel"><Specimen/><span>培养皿今日观察</span><p>壳里没有答案，只有还在<br/>缓慢发亮的东西。</p></div><a className="sc-mini-capture" href={base}><b>＋</b><span>保存一个刚刚<small>文字、截图、梦</small></span>↗</a><div className="sc-mini-section">刚刚浮上来的 <small>5 枚</small></div><div className="sc-mini-recent">{sampleEntries.slice(2, 4).map(e => <div key={e.id}><img src={e.image} alt=""/><span>{e.title}</span></div>)}</div></>}
    {view === 'drift' && <><div className="sc-mini-heading"><small>VISUAL MEMORY</small><h3>漂流层</h3></div><button className="sc-mini-toggle" type="button" onClick={() => setGathered(!gathered)}>{gathered ? '收拢 ●' : '散漫 ●'} <span>切换排列 ↔</span></button><div className={`sc-mini-collage ${gathered ? 'gathered' : ''}`}>{sampleEntries.slice(0, 4).map((e, i) => <div key={e.id} style={{ '--i': i }}><img src={e.image} alt=""/><span>{e.date}　{e.title}</span></div>)}</div></>}
    {view === 'archive' && <><div className="sc-mini-heading"><small>A QUIET ORDER</small><h3>秩序档案</h3></div><div className="sc-mini-index">03 / MARCH <span>5 RECORDS</span></div>{[...sampleEntries].reverse().slice(0, 4).map(e => <div className="sc-mini-entry" key={e.id}><b>{e.date.slice(-2)}</b><div><small>{e.tone}</small><h4>{e.title}</h4><p>{e.excerpt}</p></div><img src={e.image} alt=""/></div>)}</>}
    {view === 'share' && <><div className="sc-mini-heading"><small>SHARE A FRAGMENT</small><h3>视觉卡片</h3></div><div className="sc-mini-share"><img src={asset('yellow')} alt="雾中黄伞的原创插画"/><small>03.21 / A MOMENT TO KEEP</small><p>今天只想记住一种颜色：<br/>阴天里，一把没有被风<br/>吹走的黄色伞。</p><footer>蚌壳 <small>请保留署名与素材来源</small></footer></div><a className="sc-mini-download" href={base}>打开 Demo，生成卡片 ↗</a><p className="sc-mini-disclosure">分享摘录，让完整日记留在壳里。</p></>}
  </div><div className="sc-phone-nav"><ShellMark/><span>▧</span><b>＋</b><span>☷</span><span>···</span></div></div>
}

function Showcase() {
  const [activeExhibit, setActiveExhibit] = useState(0)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showExperience, setShowExperience] = useState(false)
  const exhibit = exhibits[activeExhibit]
  useEffect(() => {
    const elements = document.querySelectorAll('.sc-reveal')
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((items) => items.forEach(item => { if (item.isIntersecting) { item.target.classList.add('is-visible'); observer.unobserve(item.target) } }), { threshold: .1 })
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  async function copyExperience() {
    try { await navigator.clipboard.writeText(experience); setCopied(true); setTimeout(() => setCopied(false), 2400) }
    catch { setCopyFailed(true); setShowExperience(true) }
  }

  return <div className="sc-site">
    <a className="sc-skip" href="#story">跳至项目内容</a>
    <header className="sc-header"><a href="#top" className="sc-brand" aria-label="蚌壳项目首页"><ShellMark/><strong>蚌壳</strong><span>SHELL</span></a><button className="sc-menu-button" type="button" aria-expanded={menuOpen} aria-controls="sc-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '关闭 −' : '菜单 ＋'}</button><nav id="sc-navigation" className={menuOpen ? 'sc-nav is-open' : 'sc-nav'} aria-label="项目导航"><a href="#story" onClick={() => setMenuOpen(false)}>从何而来</a><a href="#experience" onClick={() => setMenuOpen(false)}>产品体验</a><a href="#build" onClick={() => setMenuOpen(false)}>如何构建</a></nav><a className="sc-header-cta" href={base}>进入蚌壳 <Arrow/></a></header>

    <main>
      <section className="sc-hero" id="top"><div className="sc-hero-mist"/><div className="sc-hero-copy"><Kicker>AN INDEPENDENT PRODUCT EXPERIMENT</Kicker><h1>给感受，<br/>一枚<span>壳。</span></h1><p>电影里的一场雨。梦里的一条走廊。<br/>还有那些，还没想好如何形容的自己。</p><div className="sc-hero-actions"><a href={base} className="sc-button sc-button-dark">打开私人水域 <Arrow/></a><a href="#story" className="sc-text-link">阅读项目故事 <span>↓</span></a></div><div className="sc-hero-meta"><span>PRODUCT DESIGN</span><i>×</i><span>VIBE CODING</span><i>×</i><span>LOCAL FIRST</span></div></div>
        <div className="sc-hero-art"><span className="sc-art-coordinate">SPECIMEN / S—001<br/>SOMETHING SOFT, STILL GROWING.</span><Specimen className="sc-hero-specimen"/><div className="sc-floating-note sc-note-left"><span>03.16 · 梦的切片</span><img src={asset('mist')} alt="雾中水域的原创插画"/><p>地图上没有的水域。</p><i>KEEP A LITTLE WONDER.</i></div><div className="sc-floating-note sc-note-right"><img src={asset('yellow')} alt="一把黄色的伞"/><span>03.21 / 雨衣黄</span><p>颜色先于答案抵达。</p></div><div className="sc-art-caption"><span className="sc-live-dot"/>一款生长中的私人视觉档案 <small>PROTOTYPE / V0.2</small></div><div className="sc-orbit-label">雾气　·　猫铃铛　·　泡泡糖　·　湿透的发尾</div></div>
        <div className="sc-hero-bottom"><span>不是每一种感受，都需要立刻被解释。</span><a href="#story" aria-label="向下阅读">SCROLL TO EXPLORE　↓</a></div>
      </section>

      <div className="sc-project-strip"><div><small>产品定位</small><span>私人视觉档案</span></div><div><small>我的工作</small><span>产品构想 / 设计 / AI 协作</span></div><div><small>交付形态</small><span>移动优先的 PWA</span></div><div><small>当前阶段</small><span><i/>可交互原型</span></div></div>

      <section className="sc-story sc-section" id="story"><div className="sc-section-intro sc-reveal"><Kicker>THE STARTING POINT</Kicker><h2>我们存下了很多。<br/><em>但很少再遇见它们。</em></h2><p>截图在相册里沉底，日记在备忘录里排队。<br/>当时让我们停下来的感受，反而没有一个合适的地方。</p></div><div className="sc-pain-grid sc-reveal"><article><span className="sc-pain-symbol">▧</span><small>散落的收藏</small><h3>画面存下了，<br/>缘由却丢了。</h3><p>相册保留图像，却很难一起留下“为什么是这一张”。</p><span className="sc-solution">→ 图像与文字，成为同一枚记录</span></article><article><span className="sc-pain-symbol">≋</span><small>单一的秩序</small><h3>有时想自由，<br/>有时需要整齐。</h3><p>灵感不总是线性发生，寻找时却需要清楚的线索。</p><span className="sc-solution">→ 自由拼贴 + 网格 + 时间档案</span></article><article><span className="sc-pain-symbol">◌</span><small>分享的边界</small><h3>想被理解，<br/>也想有所保留。</h3><p>一段值得分享的文字，并不意味着整篇日记都适合公开。</p><span className="sc-solution">→ 把当前摘录，变成独立卡片</span></article></div><p className="sc-research-note">以上来自个人使用场景与设计假设；尚未进行系统用户访谈或商业需求验证。</p></section>

      <section className="sc-experience" id="experience"><div className="sc-experience-inner"><div className="sc-experience-copy sc-reveal"><Kicker light>DESIGNED TO BE RETURNED TO</Kicker><h2>一个空间。<br/><em>几种靠近自己的方式。</em></h2><div className="sc-exhibit-tabs" role="tablist" aria-label="查看功能"><div>{exhibits.map((item, i) => <button key={item.key} id={`tab-${item.key}`} type="button" role="tab" aria-selected={i === activeExhibit} aria-controls="exhibit-panel" tabIndex={0} onClick={() => setActiveExhibit(i)} onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const next = (i + (event.key === 'ArrowRight' ? 1 : -1) + exhibits.length) % exhibits.length; setActiveExhibit(next); document.getElementById(`tab-${exhibits[next].key}`)?.focus() } }}>{item.name}</button>)}</div></div><div id="exhibit-panel" role="tabpanel" aria-labelledby={`tab-${exhibit.key}`} className="sc-exhibit-description"><small>{exhibit.number}</small><h3>{exhibit.title}</h3><p>{exhibit.text}</p><span className="sc-feature-state"><i/>{exhibit.note}</span></div><a href={base} className="sc-button sc-button-light">在真实 Demo 里体验 <Arrow/></a></div><div className="sc-preview-stage sc-reveal"><span className="sc-preview-coordinate">INTERACTIVE PREVIEW / {String(activeExhibit + 1).padStart(2, '0')}</span><PhonePreview key={exhibit.key} view={exhibit.key}/><div className="sc-preview-callout"><span>↖</span><p>{exhibit.key === 'drift' ? '点击手机里的切换按钮，收拢散落的记忆。' : '用原创示例展示产品界面。完整操作请进入 Demo。'}</p></div><span className="sc-stage-watermark">SHELL</span></div></div></section>

      <section className="sc-loop sc-section"><div className="sc-section-intro sc-reveal"><Kicker>THE SMALLEST COMPLETE EXPERIENCE</Kicker><h2>把功能减下来，<br/><em>把一段体验做完整。</em></h2></div><div className="sc-loop-grid sc-reveal">{[['保存', '截图 + 当下的文字', '不强迫自己写成长文。'], ['回看', '拼贴 / 网格 / 时间线', '按此刻的心情靠近记忆。'], ['共鸣', '旁注 + 相似作品', '本版用预设示例验证呈现方式。'], ['分享', '一张独立的视觉卡片', '只带走当前摘录。']].map(([title, sub, desc], i) => <article key={title}><span className="sc-loop-step">{i + 1}<i>→</i></span><h3>{title}</h3><b>{sub}</b><p>{desc}</p></article>)}</div><div className="sc-scope-note sc-reveal"><span>一次重要的取舍</span><p>把“会长大、能对话的独角兽”收敛为培养皿和每日一句。先完成记录、回看与分享，再决定 AI 和陪伴是否值得继续投入。</p></div></section>

      <section className="sc-design sc-section"><div className="sc-design-art sc-reveal"><div className="sc-palette-orb"/><div className="sc-design-type">潮湿<br/><span>的私人标本室</span></div><span className="sc-design-art-caption">A VISUAL LANGUAGE BORROWED FROM WATER.</span></div><div className="sc-design-copy sc-reveal"><Kicker>ART DIRECTION</Kicker><h2>让界面有气候，<br/><em>让内容自己发光。</em></h2><p>雾青是空气，深水绿是容器，雨衣黄是偶然出现的亮点。中文宋体用于情绪表达，黑体负责阅读，等宽字记录时间与坐标。</p><div className="sc-palette">{[['#cbd9cd','雾青'],['#153d3d','深水绿'],['#dfb84f','雨衣黄'],['#e49ab3','泡泡糖'],['#edf0e7','贝壳白']].map(([color,name]) => <div key={name}><i style={{ background: color }}/><span>{name}<small>{color}</small></span></div>)}</div><p className="sc-design-footnote">一种主要动效：缓慢呼吸。尊重系统“减少动态效果”设置；页面字体与插画均无需请求外部 CDN。</p></div></section>

      <section className="sc-build sc-section" id="build"><div className="sc-section-intro sc-reveal"><Kicker>HUMAN INTENT, AI-ASSISTED CRAFT</Kicker><h2>Vibe 是起点。<br/><em>完成度来自一次次具体的判断。</em></h2><p>人决定感受、边界和取舍，AI 帮助把它们落成可运行的界面。</p></div><div className="sc-build-grid sc-reveal"><article className="sc-decisions"><h3>从想象到可运行</h3>{[['定义体验', '从“自己的小豆瓣”，收敛为保存个人感受的视觉档案。'],['先做完整闭环', '优先图文记录、双布局回看、卡片导出，延后宠物养成。'],['把审美翻译成规则', '把雾气、泡泡糖等关键词落实到颜色、排版与动效。'],['用证据交接', '用可操作原型、构建检查、浏览器验证与部署说明交付。']].map(([a,b],i) => <div key={a}><small>0{i+1}</small><div><h4>{a}</h4><p>{b}</p></div></div>)}</article><article className="sc-architecture"><div className="sc-architecture-header"><h3>轻量、可独立部署</h3><span>AS BUILT</span></div><div className="sc-arch-node sc-arch-top">React 19 + Vite 8 <small>响应式界面 / 两个独立入口</small></div><div className="sc-arch-branch"><div className="sc-arch-node">本地记录<small>localStorage</small></div><div className="sc-arch-node">视觉卡片<small>Canvas → PNG</small></div><div className="sc-arch-node">安装与缓存<small>Manifest + SW</small></div></div><div className="sc-arch-boundary"><span>FUTURE / 尚未接入</span><p>服务端 AI 代理 → 模型识别 / 语义检索 / 按需生成</p></div><p className="sc-arch-note">当前没有模型调用、账号或云同步。新增内容留在浏览器；清除网站数据会丢失本地记录。</p></article></div></section>

      <section className="sc-roadmap sc-section"><div className="sc-roadmap-intro sc-reveal"><Kicker>HONESTLY, STILL GROWING</Kicker><h2>已经发生的。<br/><em>和下一片水域。</em></h2><p>一个完成了核心路径的原型，<br/>距离成熟产品仍有具体的工作。</p></div><div className="sc-roadmap-items sc-reveal"><article><span className="sc-status complete">现在</span><div><h3>可操作的个人空间</h3><p>图文记录 · 三种浏览布局 · 每日句子 · 视觉卡片 · PWA 基础 · 项目案例</p></div></article><article><span className="sc-status next">下一步</span><div><h3>先让记忆更可靠</h3><p>IndexedDB 图片存储、导出备份、存储不足提示、移动设备与无障碍专项测试。</p></div></article><article><span className="sc-status later">探索</span><div><h3>让回声产生联系</h3><p>经确认的电影识别、基于检索的作品推荐、按需 AI 旁注；用实际使用反馈决定是否继续做陪伴角色。</p></div></article></div></section>

      <section className="sc-takeaway sc-reveal"><div><Kicker light>TAKE A LITTLE SHELL WITH YOU</Kicker><h2>把想法做出来，<br/>也把过程留下来。</h2><p>产品案例、工程说明，以及可直接使用的项目经历。<br/>不夸大结果，让每一句描述都能被作品证明。</p><div className="sc-takeaway-actions"><a className="sc-button sc-button-light" href={base}>体验蚌壳 <Arrow/></a><button className="sc-outline-button" type="button" onClick={copyExperience}>{copied ? '已复制项目经历 ✓' : '复制项目经历 ↗'}</button><a className="sc-takeaway-download" href={`${base}project-notes.md`} download>下载项目说明 ↓</a></div><button className="sc-experience-toggle" type="button" aria-expanded={showExperience} onClick={() => setShowExperience(!showExperience)}>{showExperience ? '收起' : '展开'}项目经历文本 {showExperience ? '−' : '＋'}</button>{showExperience && <div className="sc-experience-text"><p>{experience}</p>{copyFailed && <small role="status">当前浏览器未开放剪贴板权限，可手动选中以上文字复制。</small>}</div>}<span className="sc-copy-status" role="status" aria-live="polite">{copied ? '项目经历已复制到剪贴板' : ''}</span></div><div className="sc-ending-shell"><ShellMark/><span>KEEP FEELING.<br/>KEEP A SHELL.</span></div></section>
    </main>
    <footer className="sc-footer"><a className="sc-brand" href="#top"><ShellMark/><strong>蚌壳</strong><span>SHELL</span></a><p>独立产品实验 · Human × AI<br/>公开示例为虚构文本与原创 SVG，项目实现与规划均已明确标注。</p><a href="https://github.com/wanner6560-del/bangke-shell" target="_blank" rel="noreferrer">GitHub ↗</a><a href="#top">回到水面 ↑</a></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<StrictMode><Showcase/></StrictMode>)

export default Showcase
