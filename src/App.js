import { useState, useEffect } from "react";

const C = {
  bg: "#0d0f14", surface: "#13161e", border: "rgba(255,255,255,0.07)",
  accent: "#3b82f6", accentDim: "rgba(59,130,246,0.15)", text: "#e2e8f0",
  muted: "rgba(226,232,240,0.4)", success: "#10b981", danger: "#ef4444", warn: "#f59e0b",
};

const FSI_GRANTS = [
  { id: "student_startup", label: "Студенческий стартап", desc: "до 1 млн руб · для студентов", ready: true },
  { id: "umnik", label: "УМНИК", desc: "500 тыс руб · для молодых учёных", ready: false },
  { id: "start", label: "СТАРТ", desc: "до 5 млн руб · для малых компаний", ready: false },
  { id: "razvitie", label: "Развитие", desc: "до 20 млн руб · для МСП", ready: false },
  { id: "inno", label: "ИнноШкольник", desc: "для школьников", ready: false },
  { id: "intern", label: "Интернационализация", desc: "выход на зарубежные рынки", ready: false },
  { id: "comm", label: "Коммерциализация", desc: "внедрение разработок", ready: false },
];

const DIRECTIONS = [
  { id: "n1", label: "Н1", full: "Цифровые технологии / ИИ" },
  { id: "n2", label: "Н2", full: "Медицина и здоровьесбережение" },
  { id: "n3", label: "Н3", full: "Новые материалы и химия" },
  { id: "n4", label: "Н4", full: "Новые приборы и производство" },
  { id: "n5", label: "Н5", full: "Биотехнологии" },
  { id: "n6", label: "Н6", full: "Ресурсосберегающая энергетика" },
  { id: "n7", label: "Н7", full: "Креативные индустрии" },
];

const FSI_SECTIONS = [
  { id: "keywords",        num: 16, label: "Ключевые слова",                                    hint: "5-10 ключевых слов через запятую" },
  { id: "nptl",            num: 17, label: "Обоснование соответствия приоритетам НПТЛ",         hint: "Соответствие нац. проектам технологического лидерства" },
  { id: "annotation",      num: 19, label: "Аннотация проекта",                                 hint: "Краткое описание: суть, цель, результат" },
  { id: "goal",            num: 20, label: "Цель проекта",                                      hint: "Конкретная измеримая цель" },
  { id: "problem",         num: 21, label: "Проблема, которую решает результат проекта",        hint: "Развёрнутое обоснование проблемы" },
  { id: "solution_fit",    num: 22, label: "Каким образом результат проекта решает проблему",   hint: "Механизм решения" },
  { id: "product",         num: 23, label: "Описание конечного продукта проекта",               hint: "Функции, характеристики, форм-фактор" },
  { id: "application",     num: 24, label: "Область применения продукта проекта",               hint: "Где и кем используется" },
  { id: "market",          num: 25, label: "Рынок, сегмент рынка",                              hint: "Объём рынка, целевая аудитория" },
  { id: "analogs",         num: 26, label: "Существующие аналоги",                              hint: "3-5 конкурентов на рынке" },
  { id: "advantages",      num: 27, label: "Конкурентные преимущества",                         hint: "Чем лучше аналогов — конкретные параметры" },
  { id: "resources",       num: 28, label: "Ресурсы проекта",                                   hint: "Оборудование, ПО, партнёры" },
  { id: "costs",           num: 29, label: "Затраты на реализацию проекта",                     hint: "Статьи расходов и обоснование" },
  { id: "team_plan",       num: 30, label: "Планы по формированию команды проекта",             hint: "Кого нанять, какие компетенции нужны" },
  { id: "revenue",         num: 31, label: "Планируемый способ получения дохода",               hint: "Бизнес-модель" },
  { id: "tech",            num: 32, label: "Техническое решение проекта",                       hint: "Технологический стек, архитектура" },
  { id: "tech_advantages", num: 33, label: "Преимущества выбранного технического решения",      hint: "Почему именно эта технология" },
  { id: "backlog",         num: 34, label: "Имеющийся задел (в т.ч. научно-технический)",       hint: "Прототип, патенты, публикации, испытания" },
];

const USER_FIELDS = [
  { key: "name",        label: "Имя и фамилия *",           placeholder: "Иванова Данияр" },
  { key: "org",         label: "Университет *",             placeholder: "МГУ им. Ломоносова" },
  { key: "title",       label: "Название проекта *",        placeholder: "AI-ассистент для написания грантов" },
  { key: "product",     label: "Что разрабатываете? *",     placeholder: "Опишите суть разработки и технологию", multiline: true },
  { key: "problem_raw", label: "Какую проблему решаете? *", placeholder: "Кратко: боль рынка которую вы закрываете", multiline: true },
  { key: "team",        label: "Команда *",                 placeholder: "ФИО, роли, компетенции участников" },
  { key: "backlog_raw", label: "Что уже сделано / задел *", placeholder: "Прототип, патенты, публикации, расчёты" },
];

function Inp({ label, value, onChange, placeholder, multiline, rows = 3 }) {
  const s = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "8px", padding: "10px 14px", color: "#e2e8f0", fontSize: "13px",
    fontFamily: "'IBM Plex Mono', monospace", outline: "none", resize: "vertical", boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(226,232,240,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{label}</label>
      {multiline ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} /> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />}
    </div>
  );
}

function SectionCard({ section, result, loading, onRegen, onDelete, isCustom }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const done = !!result && !loading;
  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ border: `1px solid ${done ? "rgba(59,130,246,0.35)" : loading ? "rgba(59,130,246,0.2)" : isCustom ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: "12px", marginBottom: "10px", overflow: "hidden", background: done ? "rgba(59,130,246,0.04)" : loading ? "rgba(59,130,246,0.02)" : "#13161e", transition: "all 0.3s" }}>
      <div onClick={() => done && setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", cursor: done ? "pointer" : "default" }}>
        <div style={{ width: "28px", height: "22px", borderRadius: "6px", flexShrink: 0, background: done ? "#3b82f6" : loading ? "rgba(59,130,246,0.3)" : isCustom ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", fontFamily: "monospace", color: done ? "#fff" : loading ? "#3b82f6" : isCustom ? "#f59e0b" : "rgba(226,232,240,0.4)" }}>
          {done ? "✓" : loading ? "…" : isCustom ? "★" : section.num || "·"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: done ? "#e2e8f0" : loading ? "rgba(226,232,240,0.6)" : "rgba(226,232,240,0.4)" }}>{section.label}</div>
          {loading && <div style={{ fontSize: "11px", color: "#3b82f6", marginTop: "2px" }}>генерирую...</div>}
          {!loading && !done && section.hint && <div style={{ fontSize: "11px", color: "rgba(226,232,240,0.4)", marginTop: "2px", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{section.hint}</div>}
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          {done && <button onClick={e => { e.stopPropagation(); copy(); }} style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: copied ? "#10b981" : "rgba(226,232,240,0.4)", cursor: "pointer" }}>{copied ? "✓" : "copy"}</button>}
          {done && <button onClick={e => { e.stopPropagation(); onRegen(); }} style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px", border: "1px solid rgba(59,130,246,0.3)", background: "transparent", color: "#3b82f6", cursor: "pointer" }}>↺</button>}
          {isCustom && <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ padding: "4px 8px", fontSize: "11px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#ef4444", cursor: "pointer" }}>✕</button>}
          {done && <span style={{ fontSize: "11px", color: "rgba(226,232,240,0.4)", padding: "4px 2px" }}>{open ? "▲" : "▼"}</span>}
        </div>
      </div>
      {done && open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "14px" }}>
          <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.9", color: "rgba(226,232,240,0.85)", whiteSpace: "pre-wrap", fontFamily: "'Lora', serif" }}>{result}</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [selectedDir, setSelectedDir] = useState(null);
  const [userData, setUserData] = useState({});
  const [sections, setSections] = useState(FSI_SECTIONS);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [showAddField, setShowAddField] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHint, setNewHint] = useState("");
  const [allDone, setAllDone] = useState(false);
  const [generating, setGenerating] = useState(false);

  const setField = key => val => setUserData(u => ({ ...u, [key]: val }));
  const canProceed = USER_FIELDS.every(f => userData[f.key]?.trim());
  const doneCount = sections.filter(s => results[s.id]).length;

  const deleteField = (id) => {
    setSections(s => s.filter(sec => sec.id !== id));
    setResults(r => { const n = { ...r }; delete n[id]; return n; });
  };

  const generateOne = async (sectionId, secs) => {
    const sec = (secs || sections).find(s => s.id === sectionId);
    const grant = FSI_GRANTS.find(g => g.id === selectedGrant);
    const dir = DIRECTIONS.find(d => d.id === selectedDir);
    setLoading(l => ({ ...l, [sectionId]: true }));
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Ты эксперт по написанию грантовых заявок для ФСИ (Фонд содействия инновациям).
Программа: ${grant?.label || "Студенческий стартап"}
Направление: ${dir ? dir.label + " — " + dir.full : "не указано"}

Данные заявителя:
- Имя: ${userData.name}
- Университет: ${userData.org}
- Название проекта: ${userData.title}
- Суть разработки: ${userData.product}
- Проблема (кратко): ${userData.problem_raw}
- Команда: ${userData.team}
- Задел: ${userData.backlog_raw}

Напиши раздел заявки №${sec.num || ""}: «${sec.label}»
Подсказка: ${sec.hint || ""}

Требования:
- Профессиональный деловой русский язык
- Конкретные факты и числа, без воды
- Объём 100-250 слов
- Только текст раздела без заголовка и нумерации`
          }]
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setResults(r => ({ ...r, [sectionId]: text }));
    } catch (e) { console.error(e); }
    finally { setLoading(l => ({ ...l, [sectionId]: false })); }
  };

  useEffect(() => {
    if (step !== 2 || generating) return;
    const run = async () => {
      setGenerating(true);
      setAllDone(false);
      for (const s of sections) { await generateOne(s.id, sections); }
      setAllDone(true);
      setGenerating(false);
    };
    run();
  }, [step]);

  const addAndGenerate = async () => {
    if (!newLabel.trim()) return;
    const id = "custom_" + Date.now();
    const newSec = { id, label: newLabel.trim(), hint: newHint.trim(), isCustom: true };
    setSections(s => [...s, newSec]);
    setNewLabel(""); setNewHint(""); setShowAddField(false);
    await generateOne(id, [...sections, newSec]);
  };

  const exportText = () => {
    const grant = FSI_GRANTS.find(g => g.id === selectedGrant);
    const dir = DIRECTIONS.find(d => d.id === selectedDir);
    const lines = sections.map(s => `═══ ${s.num ? s.num + ". " : ""}${s.label.toUpperCase()} ═══\n\n${results[s.id] || "(не сгенерировано)"}\n`).join("\n");
    const header = `ГРАНТОВАЯ ЗАЯВКА — ФСИ ${grant?.label?.toUpperCase() || ""}\nНаправление: ${dir ? dir.label + " — " + dir.full : ""}\nПроект: ${userData.title}\nЗаявитель: ${userData.name} | ${userData.org}\n\n${"─".repeat(60)}\n\n`;
    const blob = new Blob([header + lines], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `fsi_${selectedGrant}.txt`; a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", fontFamily: "'Inter', sans-serif", color: "#e2e8f0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Lora&family=Inter:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; } ::placeholder { color: rgba(226,232,240,0.2) !important; } textarea,input { caret-color: #3b82f6; } textarea:focus,input:focus { border-color: rgba(59,130,246,0.5) !important; outline: none; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }`}</style>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 20px" }}>

        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 10px #3b82f6" }} />
            <span style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", color: "rgba(226,232,240,0.4)", letterSpacing: "0.1em" }}>ФОНД СОДЕЙСТВИЯ ИННОВАЦИЯМ · AI ГЕНЕРАТОР</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", lineHeight: "1.2" }}>Генератор заявки ФСИ<br /><span style={{ color: "#3b82f6" }}>заполни грант за 10 минут</span></h1>
        </div>

        <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
          {["Выбор гранта", "Твои данные", "Генерация"].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: "8px", borderRadius: "8px", textAlign: "center", fontSize: "11px", fontWeight: "600", background: step === i ? "rgba(59,130,246,0.15)" : "transparent", border: `1px solid ${step === i ? "#3b82f6" : "rgba(255,255,255,0.07)"}`, color: step === i ? "#3b82f6" : "rgba(226,232,240,0.4)" }}>{s}</div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "rgba(226,232,240,0.4)" }}>Выбери программу ФСИ:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              {FSI_GRANTS.map(g => (
                <div key={g.id} onClick={() => g.ready && setSelectedGrant(g.id)} style={{ padding: "16px", borderRadius: "12px", cursor: g.ready ? "pointer" : "default", border: `1px solid ${selectedGrant === g.id ? "#3b82f6" : g.ready ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}`, background: selectedGrant === g.id ? "rgba(59,130,246,0.15)" : g.ready ? "#13161e" : "rgba(255,255,255,0.02)", opacity: g.ready ? 1 : 0.45, transition: "all 0.15s", position: "relative" }}>
                  {!g.ready && <span style={{ position: "absolute", top: "8px", right: "10px", fontSize: "9px", color: "rgba(226,232,240,0.4)", fontFamily: "monospace" }}>СКОРО</span>}
                  {selectedGrant === g.id && <span style={{ position: "absolute", top: "8px", right: "10px", color: "#3b82f6" }}>✓</span>}
                  <div style={{ fontSize: "14px", fontWeight: "700", color: g.ready ? "#e2e8f0" : "rgba(226,232,240,0.4)", marginBottom: "4px" }}>{g.label}</div>
                  <div style={{ fontSize: "11px", color: "rgba(226,232,240,0.4)" }}>{g.desc}</div>
                </div>
              ))}
            </div>
            {selectedGrant === "student_startup" && (
              <div style={{ marginBottom: "24px" }}>
                <p style={{ margin: "0 0 12px", fontSize: "13px", color: "rgba(226,232,240,0.4)" }}>Выбери направление:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {DIRECTIONS.map(d => (
                    <div key={d.id} onClick={() => setSelectedDir(d.id)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", cursor: "pointer", border: `1px solid ${selectedDir === d.id ? "#3b82f6" : "rgba(255,255,255,0.07)"}`, background: selectedDir === d.id ? "rgba(59,130,246,0.15)" : "#13161e", transition: "all 0.15s" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0, background: selectedDir === d.id ? "#3b82f6" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", fontFamily: "monospace", color: selectedDir === d.id ? "#fff" : "rgba(226,232,240,0.4)" }}>{d.label}</div>
                      <div style={{ fontSize: "13px", color: selectedDir === d.id ? "#e2e8f0" : "rgba(226,232,240,0.4)", fontWeight: selectedDir === d.id ? "600" : "400" }}>{d.full}</div>
                      {selectedDir === d.id && <div style={{ marginLeft: "auto", color: "#3b82f6" }}>✓</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => selectedGrant && (selectedGrant !== "student_startup" || selectedDir) && setStep(1)} disabled={!selectedGrant || (selectedGrant === "student_startup" && !selectedDir)} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", fontSize: "14px", fontWeight: "600", background: (selectedGrant && (selectedGrant !== "student_startup" || selectedDir)) ? "#3b82f6" : "rgba(255,255,255,0.05)", color: (selectedGrant && (selectedGrant !== "student_startup" || selectedDir)) ? "#fff" : "rgba(226,232,240,0.4)", cursor: (selectedGrant && (selectedGrant !== "student_startup" || selectedDir)) ? "pointer" : "not-allowed" }}>
              {!selectedGrant ? "Выбери программу" : selectedGrant === "student_startup" && !selectedDir ? "Выбери направление" : "Продолжить →"}
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#13161e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>✓ {FSI_GRANTS.find(g => g.id === selectedGrant)?.label}{selectedDir && ` · ${DIRECTIONS.find(d => d.id === selectedDir)?.label} ${DIRECTIONS.find(d => d.id === selectedDir)?.full}`}</div>
              <button onClick={() => setStep(0)} style={{ padding: "5px 12px", fontSize: "11px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "rgba(226,232,240,0.4)", cursor: "pointer" }}>← Изменить</button>
            </div>
            <div style={{ background: "#13161e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: "13px", color: "rgba(226,232,240,0.4)", lineHeight: "1.7" }}>Заполни кратко — AI сам развернёт все 18 разделов заявки.</p>
              <p style={{ margin: "0 0 20px", fontSize: "11px", color: "rgba(226,232,240,0.2)" }}>Рынок, конкурентов, монетизацию и технологии AI определит сам.</p>
              {USER_FIELDS.map(f => (<Inp key={f.key} label={f.label} value={userData[f.key] || ""} onChange={setField(f.key)} placeholder={f.placeholder} multiline={f.multiline} />))}
            </div>
            {!canProceed && <p style={{ fontSize: "12px", color: "rgba(226,232,240,0.4)", margin: "0 0 12px" }}>* Заполни все поля</p>}
            <button onClick={() => { if (canProceed) { setAllDone(false); setResults({}); setGenerating(false); setStep(2); } }} disabled={!canProceed} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", fontSize: "15px", fontWeight: "700", background: canProceed ? "#3b82f6" : "rgba(255,255,255,0.05)", color: canProceed ? "#fff" : "rgba(226,232,240,0.4)", cursor: canProceed ? "pointer" : "not-allowed", boxShadow: canProceed ? "0 0 20px rgba(59,130,246,0.3)" : "none" }}>⚡ Сгенерировать заявку</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#13161e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>{userData.title}</div>
                <div style={{ fontSize: "11px", color: "rgba(226,232,240,0.4)", marginTop: "2px" }}>{userData.name} · {userData.org}</div>
              </div>
              <button onClick={() => setStep(1)} style={{ padding: "5px 12px", fontSize: "11px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "rgba(226,232,240,0.4)", cursor: "pointer" }}>← Изменить</button>
            </div>

            <div style={{ background: "#13161e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", color: allDone ? "#10b981" : "#3b82f6", fontWeight: "600" }}>
                  {allDone ? "✓ Все разделы готовы!" : `Генерирую разделы... ${doneCount}/${sections.length}`}
                </span>
                {allDone && <button onClick={exportText} style={{ padding: "6px 16px", borderRadius: "6px", border: "none", background: "#10b981", color: "#fff", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}>↓ Скачать .txt</button>}
              </div>
              <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(doneCount / sections.length) * 100}%`, background: allDone ? "#10b981" : "#3b82f6", transition: "width 0.5s" }} />
              </div>
            </div>

            {sections.map(s => (<SectionCard key={s.id} section={s} result={results[s.id]} loading={!!loading[s.id]} onRegen={() => generateOne(s.id)} onDelete={() => deleteField(s.id)} isCustom={s.isCustom} />))}

            {allDone && !showAddField && (
              <button onClick={() => setShowAddField(true)} style={{ width: "100%", padding: "11px", borderRadius: "10px", marginTop: "8px", border: "1px dashed rgba(245,158,11,0.4)", background: "transparent", color: "#f59e0b", fontSize: "13px", cursor: "pointer" }}>+ Добавить своё поле</button>
            )}
            {showAddField && (
              <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "12px", padding: "18px", marginTop: "8px" }}>
                <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#f59e0b", fontWeight: "600" }}>★ Новое поле</p>
                <Inp label="Название поля *" value={newLabel} onChange={setNewLabel} placeholder="например: Экологический эффект проекта" />
                <Inp label="Подсказка (необязательно)" value={newHint} onChange={setNewHint} placeholder="Что нужно написать в этом разделе" />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={addAndGenerate} disabled={!newLabel.trim()} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: newLabel.trim() ? "#f59e0b" : "rgba(255,255,255,0.05)", color: newLabel.trim() ? "#000" : "rgba(226,232,240,0.4)", fontWeight: "600", fontSize: "13px", cursor: newLabel.trim() ? "pointer" : "not-allowed" }}>Добавить и сгенерировать</button>
                  <button onClick={() => { setShowAddField(false); setNewLabel(""); setNewHint(""); }} style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "rgba(226,232,240,0.4)", fontSize: "13px", cursor: "pointer" }}>Отмена</button>
                </div>
              </div>
            )}

            {allDone && (
              <div style={{ marginTop: "20px", padding: "20px", borderRadius: "12px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#10b981", marginBottom: "4px" }}>✓ Заявка готова!</div>
                <div style={{ fontSize: "12px", color: "rgba(226,232,240,0.4)", marginBottom: "14px" }}>Нажми на раздел чтобы открыть · ↺ чтобы перегенерировать</div>
                <button onClick={exportText} style={{ padding: "11px 32px", borderRadius: "8px", border: "none", background: "#10b981", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>↓ Скачать заявку .txt</button>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: "11px", color: "rgba(226,232,240,0.12)", textAlign: "center" }}>AI Grant Writer · Фонд содействия инновациям 2026</div>
      </div>
    </div>
  );
}