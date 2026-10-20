import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { asset, sampleEntries as seedEntries, sampleRecommendations as recommendations } from './sample-data.js'

const dailyLines = [
  '今天的雾比昨天更靠近玻璃。',
  '不要急着解释，先让画面在水里待一会儿。',
  '有些路不是通向远方，而是通向被遗漏的自己。',
  '壳里没有答案，只有还在缓慢发亮的东西。',
  '你保存下来的，不只是发生过的事。',
  '潮水退去以后，柔软的部分仍然有形状。',
  '今天适合收藏一句没有结尾的话。',
]

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const chars = [...text]
  let line = ''
  let count = 0
  for (let i = 0; i < chars.length; i += 1) {
    const test = line + chars[i]
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + count * lineHeight)
      line = chars[i]
      count += 1
      if (count >= maxLines - 1) break
    } else line = test
  }
  ctx.fillText(line, x, y + count * lineHeight)
}

function Icon({ name, size = 20 }) {
  const paths = {
    shell: <><path d="M4 16.5C4 10 8.5 4.5 12 3c3.5 1.5 8 7 8 13.5"/><path d="M7 16c.2-4.5 2.8-8.5 5-10.5 2.2 2 4.8 6 5 10.5"/><path d="M12 5.5V16"/><path d="M3 17h18"/></>,
    drift: <><path d="M5 4h6v7H5z"/><path d="M13 7h6v5h-6z"/><path d="M8 13h8v7H8z"/></>,
    archive: <><path d="M5 5h14"/><path d="M5 10h14"/><path d="M5 15h14"/><path d="M5 20h9"/><circle cx="2.5" cy="5" r=".5"/><circle cx="2.5" cy="10" r=".5"/><circle cx="2.5" cy="15" r=".5"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    share: <><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5"/><path d="m8 13 8 5"/></>,
    sparkle: <><path d="M12 2c.7 5.2 2.8 7.3 8 8-5.2.7-7.3 2.8-8 8-.7-5.2-2.8-7.3-8-8 5.2-.7 7.3-2.8 8-8Z"/><path d="M5 17c.3 2.6 1.4 3.7 4 4-2.6.3-3.7 1.4-4 4-.3-2.6-1.4-3.7-4-4 2.6-.3 3.7-1.4 4-4Z"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m4 17 5-5 4 4 3-3 4 4"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function ShellDoodle({ type = 'shell' }) {
  const shapes = {
    shell: <><path d="M23 79C24 44 48 17 75 12c28 8 49 34 50 67"/><path d="M41 76c3-24 17-43 34-54 17 11 31 30 34 54"/><path d="M75 22v57"/><path d="M16 82h118"/></>,
    tide: <><path d="M8 48c17-18 32 18 49 0s32 18 49 0 32 18 49 0"/><path d="M8 66c17-18 32 18 49 0s32 18 49 0 32 18 49 0"/><circle cx="81" cy="26" r="8"/></>,
    tunnel: <><path d="M15 82C18 39 42 15 75 12c33 3 57 27 60 70"/><path d="M34 82c2-29 17-47 41-50 24 3 39 21 41 50"/><path d="M55 82c1-15 8-25 20-27 12 2 19 12 20 27"/></>,
    corridor: <><path d="M14 16h122v72H14z"/><path d="m14 16 42 24v48"/><path d="m136 16-42 24v48"/><path d="M56 40h38"/><path d="M75 40v48"/></>,
    bell: <><path d="M49 70h52c-8-8-10-18-10-30 0-11-7-19-16-19s-16 8-16 19c0 12-2 22-10 30Z"/><path d="M68 76c2 7 12 7 14 0"/><path d="M75 12v9"/><path d="M37 31c-4 12-4 23 0 34"/><path d="M113 31c4 12 4 23 0 34"/></>,
  }
  return <svg className="doodle" viewBox="0 0 150 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[type] || shapes.shell}</svg>
}

function Opening({ onEnter }) {
  return <div className="opening" role="dialog" aria-label="进入蚌壳">
    <div className="opening-grain"/><div className="opening-light opening-light-a"/><div className="opening-light opening-light-b"/>
    <button className="aperture" type="button" onClick={onEnter} aria-label="触摸进入蚌壳">
      <span className="aperture-ring ring-1"/><span className="aperture-ring ring-2"/><span className="aperture-ring ring-3"/>
      <span className="aperture-core"><Icon name="shell" size={42}/></span>
    </button>
    <div className="opening-copy"><span className="opening-date">DAILY SPECIMEN · {new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit' }).format(new Date())}</span><h1>蚌壳</h1><p>触摸潮湿的入口</p></div>
    <button className="skip-opening" type="button" onClick={onEnter}>直接进入</button>
  </div>
}

function Header({ title, subtitle }) {
  return <header className="page-header"><div><span className="eyebrow">PRIVATE SPECIMEN ARCHIVE</span><h2>{title}</h2></div><span className="header-note">{subtitle}</span></header>
}

function TodayView({ entries, dailyLine, onSelect, onCompose }) {
  return <main className="page today-page">
    <Header title="今日水域" subtitle={new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(new Date())}/>
    <section className="vessel-card">
      <div className="vessel-window"><div className="vessel-fog"/><div className="vessel-orbit orbit-one"/><div className="vessel-orbit orbit-two"/><div className="pearl"><span/></div><div className="vessel-caption">培养第 01 日</div></div>
      <div className="vessel-message"><span>培养皿今日观察</span><p>“{dailyLine}”</p></div>
    </section>
    <section className="quick-capture" onClick={onCompose} role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && onCompose()}>
      <div className="capture-plus"><Icon name="plus"/></div><div><strong>保存一个刚刚</strong><span>文字、截图、梦或一句没说完的话</span></div><span className="capture-time">现在</span>
    </section>
    <section className="section-block">
      <div className="section-title"><h3>刚刚浮上来的</h3><span>{entries.length} 枚</span></div>
      <div className="recent-strip">{entries.slice(-3).reverse().map((entry) => <button className="recent-card" type="button" key={entry.id} onClick={() => onSelect(entry)}><img src={entry.image} alt=""/><span className="recent-date">{entry.date}</span><strong>{entry.title}</strong></button>)}</div>
    </section>
    <section className="rights-note"><Icon name="shell" size={18}/><p>新增记录保存在当前浏览器。旁注与推荐是演示示例。<a href={`${import.meta.env.BASE_URL}showcase/`}>查看项目故事 ↗</a></p></section>
  </main>
}

function DriftView({ entries, onSelect }) {
  const [mode, setMode] = useState('loose')
  return <main className="page drift-page">
    <Header title="漂流层" subtitle="自由排列"/>
    <div className="segmented-control" aria-label="选择排列方式"><button className={mode === 'loose' ? 'active' : ''} type="button" onClick={() => setMode('loose')}>散漫</button><button className={mode === 'grid' ? 'active' : ''} type="button" onClick={() => setMode('grid')}>收拢</button></div>
    <section className={`drift-canvas ${mode}`}>
      <div className="canvas-whisper">雾气 / 迷雾 / 猫铃铛 / 泡泡糖 / 湿透的发尾</div>
      {entries.map((entry, index) => <button className={`drift-item ${entry.position || `float-${String.fromCharCode(97 + index % 5)}`}`} type="button" key={entry.id} onClick={() => onSelect(entry)}><img src={entry.image} alt=""/><div className="drift-label"><span>{entry.date}</span><strong>{entry.title}</strong></div></button>)}
      <div className="loose-note note-one">地图上没有的水域</div><div className="loose-note note-two">A MOMENT TO KEEP</div><ShellDoodle type="tide"/>
    </section>
  </main>
}

function ArchiveView({ entries, onSelect }) {
  return <main className="page archive-page">
    <Header title="秩序档案" subtitle="按保存顺序"/>
    <div className="archive-index"><span>PERSONAL TIMELINE</span><span>{entries.length} RECORDS</span></div>
    <section className="timeline">{[...entries].reverse().map((entry) => <button className="timeline-entry" type="button" key={entry.id} onClick={() => onSelect(entry)}>
      <div className="timeline-date"><strong>{entry.date.split('.')[1]}</strong><span>{entry.date.split('.')[0]} / {entry.year}</span></div>
      <div className="timeline-content"><div className="timeline-topline"><span>{entry.tone}</span><span>{entry.tags.join(' · ')}</span></div><h3>{entry.title}</h3><p>{entry.excerpt}</p></div>
      <img className="timeline-thumb" src={entry.image} alt=""/>
    </button>)}</section>
  </main>
}

function Composer({ onClose, onSave }) {
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [isReading, setIsReading] = useState(false)
  const fileInput = useRef(null)
  function handleImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }
  function save() {
    if (!text.trim() && !image) return
    setIsReading(true)
    window.setTimeout(() => onSave({ text, image }), 900)
  }
  return <div className="modal-backdrop composer-backdrop"><section className="sheet composer-sheet" aria-modal="true" role="dialog" aria-label="写下记录">
    <div className="sheet-handle"/><header className="sheet-header"><div><span className="eyebrow">NEW SPECIMEN</span><h2>写下刚刚</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="关闭"><Icon name="close"/></button></header>
    <div className="composer-date">{new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date())}</div>{image && <img className="composer-preview" src={image} alt="新记录预览"/>}
    <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="今天有什么东西值得被壳保存下来？" autoFocus/>
    <div className="composer-tools"><button type="button" onClick={() => fileInput.current?.click()}><Icon name="image" size={18}/>加入图片</button><input ref={fileInput} type="file" accept="image/*" onChange={handleImage} hidden/><span>AI 不会自动读取</span></div>
    <button className="primary-button" type="button" onClick={save} disabled={isReading || (!text.trim() && !image)}>{isReading ? <><span className="loading-pearl"/>正在保存</> : '收入蚌壳'}</button>
  </section></div>
}

function EntryDetail({ entry, onClose, onShare }) {
  const recs = recommendations[entry.id] || ['《去年在马里昂巴德》', '佩索阿〈烟草店〉', 'Max Richter · On the Nature of Daylight']
  return <div className="modal-backdrop"><article className="sheet detail-sheet" aria-modal="true" role="dialog" aria-label={entry.title}>
    <div className="sheet-handle"/><header className="detail-actions"><button className="icon-button" type="button" onClick={onClose} aria-label="关闭"><Icon name="close"/></button><button className="share-button" type="button" onClick={() => onShare(entry)}><Icon name="share" size={17}/>生成视觉卡片</button></header>
    <div className="detail-image-wrap"><img className="detail-image" src={entry.image} alt=""/><span>{entry.date} · {entry.tone}</span></div>
    <div className="detail-copy"><span className="eyebrow">PRIVATE RECORD · {entry.year}</span><h2>{entry.title}</h2><p className="detail-lead">{entry.excerpt}</p><p className="detail-body">{entry.body}</p><div className="tag-row">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
    <section className="ai-reading"><div className="ai-doodle"><ShellDoodle type={entry.doodle}/></div><div><span><Icon name="sparkle" size={16}/>蚌壳的旁注 · 演示</span><p>“{entry.aiLine}”</p></div></section>
    <section className="recommendation-block"><span className="eyebrow">相似的回声 · DEMO</span>{recs.map((rec, i) => <div className="recommendation" key={rec}><span>0{i + 1}</span><p>{rec}</p></div>)}</section>
  </article></div>
}

function ShareCard({ entry, onClose }) {
  const canvasRef = useRef(null)
  const [downloadUrl, setDownloadUrl] = useState('')
  const shortQuote = entry.excerpt.length > 74 ? `${entry.excerpt.slice(0, 74)}……` : entry.excerpt
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = 1080; canvas.height = 1440
    ctx.fillStyle = '#c7d7d4'; ctx.fillRect(0, 0, 1080, 1440)
    const img = new Image(); img.src = entry.image; await img.decode()
    ctx.save(); ctx.beginPath(); ctx.roundRect(48, 48, 984, 780, 34); ctx.clip()
    const scale = Math.max(984 / img.width, 780 / img.height)
    const width = img.width * scale; const height = img.height * scale
    ctx.drawImage(img, 48 + (984 - width) / 2, 48 + (780 - height) / 2, width, height)
    const gradient = ctx.createLinearGradient(0, 490, 0, 828); gradient.addColorStop(0, 'rgba(7,24,27,0)'); gradient.addColorStop(1, 'rgba(7,24,27,.75)')
    ctx.fillStyle = gradient; ctx.fillRect(48, 470, 984, 358); ctx.restore()
    ctx.fillStyle = '#0c2225'; ctx.font = '26px ui-monospace, monospace'; ctx.fillText(`${entry.date} / PRIVATE SPECIMEN`, 72, 892)
    ctx.font = '58px "Songti SC", "STSong", serif'; drawWrappedText(ctx, shortQuote, 72, 1000, 920, 82, 4)
    ctx.strokeStyle = '#0c2225'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(72, 1310); ctx.lineTo(1008, 1310); ctx.stroke()
    ctx.font = '36px "Songti SC", serif'; ctx.fillText('蚌壳', 72, 1370)
    ctx.font = '22px ui-monospace, monospace'; ctx.fillText('KEEP THE CREDIT. SHARE A FRAGMENT.', 505, 1366)
    return canvas
  }, [entry, shortQuote])

  useEffect(() => {
    let cancelled = false
    let objectUrl = ''
    renderCanvas().then((canvas) => {
      canvas.toBlob((blob) => {
        if (!blob || cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setDownloadUrl(objectUrl)
      }, 'image/png')
    })
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [entry, renderCanvas])

  async function share() {
    const canvas = await renderCanvas()
    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], `蚌壳-${entry.id}.png`, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: `蚌壳 · ${entry.title}`, text: shortQuote })
      else if (downloadUrl) {
        const link = document.createElement('a')
        link.download = `蚌壳-${entry.id}.png`
        link.href = downloadUrl
        link.click()
      }
    }, 'image/png')
  }
  return <div className="modal-backdrop share-backdrop"><section className="sheet share-sheet" aria-modal="true" role="dialog" aria-label="视觉分享卡片">
    <div className="sheet-handle"/><header className="sheet-header"><div><span className="eyebrow">SHARE AS A SHELL</span><h2>视觉卡片</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="关闭"><Icon name="close"/></button></header>
    <div className="share-preview"><img src={entry.image} alt=""/><div className="share-gradient"/><span>{entry.date} / PRIVATE SPECIMEN</span><p>{shortQuote}</p><footer><strong>蚌壳</strong><small>请保留署名与素材来源</small></footer></div>
    <canvas ref={canvasRef} hidden/><div className="share-controls"><a className={`secondary-button ${downloadUrl ? '' : 'disabled'}`} href={downloadUrl || undefined} download={`蚌壳-${entry.id}.png`} aria-disabled={!downloadUrl}><Icon name="download" size={18}/>保存图片</a><button className="primary-button compact" type="button" onClick={share}><Icon name="share" size={18}/>分享卡片</button></div>
    <p className="share-privacy">卡片只包含当前短句，不包含完整日记、标签或 AI 分析。</p>
  </section></div>
}

function BottomNav({ active, onChange, onCompose }) {
  return <nav className="bottom-nav" aria-label="主要导航">
    <button type="button" className={active === 'today' ? 'active' : ''} onClick={() => onChange('today')}><Icon name="shell"/><span>今日</span></button>
    <button type="button" className={active === 'drift' ? 'active' : ''} onClick={() => onChange('drift')}><Icon name="drift"/><span>漂流</span></button>
    <button className="compose-nav" type="button" onClick={onCompose} aria-label="写下新记录"><Icon name="plus" size={25}/></button>
    <button type="button" className={active === 'archive' ? 'active' : ''} onClick={() => onChange('archive')}><Icon name="archive"/><span>档案</span></button>
    <button type="button" onClick={() => window.alert('设置将在下一版加入：AI 权限、备份和分享链接撤销。')}><span className="dot-icon">···</span><span>更多</span></button>
  </nav>
}

function App() {
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState('today')
  const [entries, setEntries] = useState(() => {
    try { const saved = window.localStorage.getItem('bangke-public-entries-v2'); return saved ? JSON.parse(saved) : seedEntries } catch { return seedEntries }
  })
  const [selected, setSelected] = useState(null)
  const [composerOpen, setComposerOpen] = useState(false)
  const [shareEntry, setShareEntry] = useState(null)

  useEffect(() => { const timer = window.setTimeout(() => setEntered(true), 4200); return () => window.clearTimeout(timer) }, [])
  useEffect(() => { try { window.localStorage.setItem('bangke-public-entries-v2', JSON.stringify(entries)) } catch { /* Session state still works if a large image exceeds storage. */ } }, [entries])
  const dailyLine = useMemo(() => { const today = new Date(); const seed = today.getFullYear() + today.getMonth() * 31 + today.getDate(); return dailyLines[seed % dailyLines.length] }, [])

  function saveEntry({ text, image }) {
    const now = new Date(); const date = `${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`; const cleaned = text.trim() || '一张没有附加说明的画面。'
    const entry = { id: `local-${Date.now()}`, date, year: String(now.getFullYear()), title: cleaned.length > 16 ? `${cleaned.slice(0, 16)}……` : cleaned, excerpt: cleaned, body: '这是一枚保存在本机的私人记录。真实 AI 分析将在下一阶段接入，并且只在你主动选择时读取。', image: image || asset('lakeside'), tone: '新生雾', tags: ['刚刚', '未分类'], aiLine: '刚保存的东西，还带着现实世界的温度。', doodle: 'shell', position: `float-${String.fromCharCode(97 + entries.length % 5)}` }
    setEntries((current) => [...current, entry]); setComposerOpen(false); setSelected(entry)
  }

  return <div className="site-shell">
    {!entered && <Opening onEnter={() => setEntered(true)}/>}<div className="ambient ambient-left"/><div className="ambient ambient-right"/>
    <div className="desktop-label left-label">蚌壳 / SHELL<br/>PERSONAL WEATHER ARCHIVE</div><div className="desktop-label right-label">LOCAL FIRST<br/>© THE KEEPER</div>
    <div className="app-frame">
      {active === 'today' && <TodayView entries={entries} dailyLine={dailyLine} onSelect={setSelected} onCompose={() => setComposerOpen(true)}/>} 
      {active === 'drift' && <DriftView entries={entries} onSelect={setSelected}/>} 
      {active === 'archive' && <ArchiveView entries={entries} onSelect={setSelected}/>} 
      <BottomNav active={active} onChange={setActive} onCompose={() => setComposerOpen(true)}/>
    </div>
    {composerOpen && <Composer onClose={() => setComposerOpen(false)} onSave={saveEntry}/>} 
    {selected && !shareEntry && <EntryDetail entry={selected} onClose={() => setSelected(null)} onShare={setShareEntry}/>} 
    {shareEntry && <ShareCard entry={shareEntry} onClose={() => setShareEntry(null)}/>} 
  </div>
}

export default App
