import { useState } from "react";

const C = {
  bg: "#0d0f14",
  surface: "#13161e",
  border: "rgba(255,255,255,0.07)",
  accent: "#3b82f6",
  accentDim: "rgba(59,130,246,0.15)",
  text: "#e2e8f0",
  muted: "rgba(226,232,240,0.4)",
  success: "#10b981",
  danger: "#ef4444",
  warn: "#f59e0b",
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

// Все 19 текстовых полей из заявки ФСИ (пункты 16-34)
const FSI_SECTIONS = [
  { id: "keywords",       num: 16, label: "Ключевые слова",                                              hint: "5-10 ключевых слов через запятую, описывающих технологию и рынок" },
  { id: "nptl",           num: 17, label: "Обоснование соответствия приоритетам НПТЛ",                   hint: "Как проект соответствует национальным проектам технологического лидерства" },
  { id: "annotation",     num: 19, label: "Аннотация проекта",                                           hint: "Краткое описание: суть разработки, цель, ожидаемый результат (200-300 слов)" },
  { id: "goal",           num: 20, label: "Цель проекта",                                                hint: "Конкретная измеримая цель проекта" },
  { id: "problem",        num: 21, label: "Проблема, которую решает результат проекта",                  hint: "Развёрнутое обоснование проблемы: масштаб, последствия, почему важна" },
  { id: "solution_fit",   num: 22, label: "Каким образом результат проекта решает проблему",             hint: "Механизм решения — как именно продукт устраняет проблему" },
  { id: "product",        num: 23, label: "Описание конечного продукта проекта",                         hint: "Что именно будет создано: функции, характеристики, форм-фактор" },
  { id: "application",    num: 24, label: "Область применения продукта проекта",                         hint: "Где и кем будет использоваться продукт" },
  { id: "market",         num: 25, label: "Рынок, сегмент рынка",                                        hint: "Целевой рынок, объём, целевая аудитория, сегмент" },
  { id: "analogs",        num: 26, label: "Существующие аналоги",                                        hint: "Перечислите 3-5 конкурентов или аналогов на рынке" },
  { id: "advantages",     num: 27, label: "Конкурентные преимущества",                                   hint: "Чем ваш продукт лучше аналогов — конкретные параметры и числа" },
  { id: "resources",      num: 28, label: "Ресурсы проекта",                                             hint: "Оборудование, ПО, лаборатории, партнёры которые уже есть" },
  { id: "costs",          num: 29, label: "Затраты на реализацию проекта",                               hint: "Основные статьи расходов и их обоснование" },
  { id: "team_plan",      num: 30, label: "Планы по формированию команды проекта",                       hint: "Кого планируете нанять, какие компетенции нужны" },
  { id: "revenue",        num: 31, label: "Планируемый способ получения дохода",                         hint: "Бизнес-модель: как проект будет зарабатывать" },
  { id: "tech",           num: 32, label: "Техническое решение проекта",                                 hint: "Технологический стек, архитектура, методы реализации" },
  { id: "tech_advantages",num: 33, label: "Преимущества выбранного технического решения",                hint: "Почему выбрана именно эта технология, её преимущества" },
  { id: "backlog",        num: 34, label: "Имеющийся задел (в т.ч. научно-технический)",                 hint: "Прототип, патенты, публикации, испытания, расчёты — что уже сделано" },
];

// Поля которые пользователь заполняет вручную (входные данные для AI)
const USER_FIELDS = [
  { key: "name",        label: "Имя и фамилия *",              placeholder: "Иванова Данияр" },
  { key: "org",         label: "Университет / организация *",  placeholder: "МГУ им. Ломоносова" },
  { key: "title",       label: "Название проекта *",           placeholder: "AI-ассистент для написания грантов" },
  { key: "product",     label: "Что разрабатываете? *",        placeholder: "Опишите суть разработки и технологию", multiline: true },
  { key: "problem_raw", label: "Какую проблему решаете? *",    placeholder: "Кратко: боль рынка которую вы закрываете", multiline: true },
  { key: "market",      label: "Целевой рынок",                placeholder: "Кто покупатель, объём рынка", multiline: true },
  { key: "competitors", label: "Конкуренты и ваше отличие",    placeholder: "Аналоги и чем вы лучше (числа, параметры)" },
  { key: "backlog_raw", label: "Что уже сделано / задел",      placeholder: "Прототип, патенты, публикации, испытания" },
  { key: "team",        label: "Команда",                      placeholder: "ФИО, роли, компетенции" },
  { key: "budget",      label: "Запрашиваемый бюджет",         placeholder: "например: 1 млн рублей на 12 месяцев" },
  { key: "revenue_raw", label: "Бизнес-модель / монетизация",  placeholder: "Как проект будет зарабатывать" },
  { key: "tech_raw",    label: "Технологический стек",         placeholder: "Какие технологии используете" },
];

function Inp({ label, value, onChange, placeholder, multiline, rows = 3 }) {
  const s = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${C.border}`, borderRadius: "8px",
    padding: "10px 14px", color: C.text, fontSize: "13px",
    fontFamily: "'IBM Plex Mono', monospace", outline: "none",
    resize: "vertical", boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{label}</label>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />}
    </div>
  );
}

function SectionCard({ section, result, loading, onGenerate, onRegen, onDelete, isCustom }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const done = !!result && !loading;
  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{
      border: `1px solid ${done ? "rgba(59,130,246,0.35)" : isCustom ? "rgba(245,158,11,0.3)" : C.border}`,
      borderRadius: "12px", marginBottom: "10px", overflow: "hidden",
      background: done ? "rgba(59,130,246,0.04)" : isCustom ? "rgba(245,158,11,0.03)" : C.surface,
    }}>
      <div onClick={() => done && setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", cursor: done ? "pointer" : "default" }}>
        <div style={{
          width: "28px", height: "22px", borderRadius: "6px", flexShrink: 0,
          background: done ? C.accent : isCustom ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "10px", fontWeight: "700", fontFamily: "'IBM Plex Mono', monospace",
          color: done ? "#fff" : isCustom ? C.warn : C.muted,
        }}>
          {done ? "✓" : loading ? "…" : isCustom ? "★" : section.num || "·"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: done ? C.text : C.muted }}>{section.label}</div>
          {section.hint && <div style={{ fontSize: "11px", color: C.muted, marginTop: "2px", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{section.hint}</div>}
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          {done && <button onClick={e => { e.stopPropagation(); copy(); }} style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px", border: `1px solid ${C.border}`, background: "transparent", color: copied ? C.success : C.muted, cursor: "pointer" }}>{copied ? "✓" : "copy"}</button>}
          {done && <button onClick={e => { e.stopPropagation(); onRegen(); }} style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px", border: "1px solid rgba(59,130,246,0.3)", background: "transparent", color: C.accent, cursor: "pointer" }}>↺</button>}
          {!done && !loading && <button onClick={onGenerate} style={{ padding: "4px 12px", fontSize: "11px", borderRadius: "6px", border: "none", background: C.accent, color: "#fff", cursor: "pointer", fontWeight: "600" }}>Генерировать</button>}
          {loading && <span style={{ fontSize: "11px", color: C.accent, padding: "4px 10px" }}>генерирую...</span>}
          {isCustom && <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ padding: "4px 8px", fontSize: "11px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: C.danger, cursor: "pointer" }}>✕</button>}
        </div>
      </div>
      {done && open && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${C.border}`, paddingTop: "14px" }}>
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
  const [genAll, setGenAll] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHint, setNewHint] = useState("");

  const setField = key => val => setUserData(u => ({ ...u, [key]: val }));
  const canStep2 = userData.name && userData.org && userData.title && userData.product && userData.problem_raw;
  const doneCount = sections.filter(s => results[s.id]).length;

  const addCustomField = () => {
    if (!newLabel.trim()) return;
    const id = "custom_" + Date.now();
    setSections(s => [...s, { id, label: newLabel.trim(), hint: newHint.trim(), isCustom: true }]);
    setNewLabel(""); setNewHint(""); setShowAddField(false);
  };

  const deleteField = (id) => {
    setSections(s => s.filter(sec => sec.id !== id));
    setResults(r => { const n = { ...r }; delete n[id]; return n; });
  };

  const generateOne = async (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
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

Данные заявителя (краткие заметки, используй для написания полного текста):
- Имя: ${userData.name}
- Университет: ${userData.org || "не указано"}
- Название проекта: ${userData.title}
- Суть разработки: ${userData.product}
- Проблема (кратко от заявителя): ${userData.problem_raw}
- Рынок: ${userData.market || "не указано"}
- Конкуренты: ${userData.competitors || "не указано"}
- Задел: ${userData.backlog_raw || "не указано"}
- Команда: ${userData.team || "не указано"}
- Бюджет: ${userData.budget || "не указано"}
- Монетизация: ${userData.revenue_raw || "не указано"}
- Технологии: ${userData.tech_raw || "не указано"}

Напиши раздел заявки №${section.num || ""}: «${section.label}»
Подсказка: ${section.hint || ""}

Требования:
- Профессиональный деловой русский язык
- Конкретные факты, числа, без воды
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

  const generateAll = async () => {
    setGenAll(true);
    for (const s of sections) { if (!results[s.id]) await generateOne(s.id); }
    setGenAll(false);
  };

  const exportText = () => {
    const grant = FSI_GRANTS.find(g => g.id === selectedGrant);
    const dir = DIRECTIONS.find(d => d.id === selectedDir);
    const lines = sections.map(s =>
      `═══ ${s.num ? s.num + ". " : ""}${s.label.toUpperCase()} ═══\n\n${results[s.id] || "(не сгенерировано)"}\n`
    ).join("\n");
    const header = `ГРАНТОВАЯ ЗАЯВКА — ФСИ ${grant?.label?.toUpperCase() || ""}\nНаправление: ${dir ? dir.label + " — " + dir.full : ""}\nПроект: ${userData.title}\nЗаявитель: ${userData.name} | ${userData.org || ""}\n\n${"─".repeat(60)}\n\n`;
    const blob = new Blob([header + lines], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fsi_${selectedGrant}.txt`;
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Lora&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(226,232,240,0.2) !important; }
        textarea, input { caret-color: #3b82f6; }
        textarea:focus, input:focus { border-color: rgba(59,130,246,0.5) !important; outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.accent, boxShadow: `0 0 10px ${C.accent}` }} />
            <span style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", color: C.muted, letterSpacing: "0.1em" }}>ФОНД СОДЕЙСТВИЯ ИННОВАЦИЯМ · AI ГЕНЕРАТОР</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", lineHeight: "1.2" }}>
            Генератор заявки ФСИ<br /><span style={{ color: C.accent }}>заполни грант за 10 минут</span>
          </h1>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
          {["Выбор гранта", "Твои данные", "Генерация"].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: "8px", borderRadius: "8px", textAlign: "center",
              fontSize: "11px", fontWeight: "600",
              background: step === i ? C.accentDim : "transparent",
              border: `1px solid ${step === i ? C.accent : C.border}`,
              color: step === i ? C.accent : C.muted,
            }}>{s}</div>
          ))}
        </div>

        {/* ── STEP 0: Выбор гранта ── */}
        {step === 0 && (
          <div>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: C.muted }}>Выбери программу ФСИ под которую пишешь заявку:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              {FSI_GRANTS.map(g => (
                <div key={g.id} onClick={() => g.ready && setSelectedGrant(g.id)} style={{
                  padding: "16px", borderRadius: "12px", cursor: g.ready ? "pointer" : "default",
                  border: `1px solid ${selectedGrant === g.id ? C.accent : g.ready ? C.border : "rgba(255,255,255,0.04)"}`,
                  background: selectedGrant === g.id ? C.accentDim : g.ready ? C.surface : "rgba(255,255,255,0.02)",
                  opacity: g.ready ? 1 : 0.45, transition: "all 0.15s", position: "relative",
                }}>
                  {!g.ready && <span style={{ position: "absolute", top: "8px", right: "10px", fontSize: "9px", color: C.muted, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.05em" }}>СКОРО</span>}
                  {selectedGrant === g.id && <span style={{ position: "absolute", top: "8px", right: "10px", fontSize: "11px", color: C.accent }}>✓</span>}
                  <div style={{ fontSize: "14px", fontWeight: "700", color: g.ready ? C.text : C.muted, marginBottom: "4px" }}>{g.label}</div>
                  <div style={{ fontSize: "11px", color: C.muted }}>{g.desc}</div>
                </div>
              ))}
            </div>

            {selectedGrant === "student_startup" && (
              <div style={{ marginBottom: "24px" }}>
                <p style={{ margin: "0 0 12px", fontSize: "13px", color: C.muted }}>Выбери направление конкурса:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {DIRECTIONS.map(d => (
                    <div key={d.id} onClick={() => setSelectedDir(d.id)} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "12px 16px", borderRadius: "10px", cursor: "pointer",
                      border: `1px solid ${selectedDir === d.id ? C.accent : C.border}`,
                      background: selectedDir === d.id ? C.accentDim : C.surface,
                      transition: "all 0.15s",
                    }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                        background: selectedDir === d.id ? C.accent : "rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: "700", fontFamily: "'IBM Plex Mono', monospace",
                        color: selectedDir === d.id ? "#fff" : C.muted,
                      }}>{d.label}</div>
                      <div style={{ fontSize: "13px", color: selectedDir === d.id ? C.text : C.muted, fontWeight: selectedDir === d.id ? "600" : "400" }}>{d.full}</div>
                      {selectedDir === d.id && <div style={{ marginLeft: "auto", color: C.accent }}>✓</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => selectedGrant && (selectedGrant !== "student_startup" || selectedDir) && setStep(1)}
              disabled={!selectedGrant || (selectedGrant === "student_startup" && !selectedDir)}
              style={{
                width: "100%", padding: "13px", borderRadius: "10px", border: "none",
                fontSize: "14px", fontWeight: "600",
                background: (selectedGrant && (selectedGrant !== "student_startup" || selectedDir)) ? C.accent : "rgba(255,255,255,0.05)",
                color: (selectedGrant && (selectedGrant !== "student_startup" || selectedDir)) ? "#fff" : C.muted,
                cursor: (selectedGrant && (selectedGrant !== "student_startup" || selectedDir)) ? "pointer" : "not-allowed",
              }}
            >
              {!selectedGrant ? "Выбери программу" : selectedGrant === "student_startup" && !selectedDir ? "Выбери направление" : "Продолжить →"}
            </button>
          </div>
        )}

        {/* ── STEP 1: Данные ── */}
        {step === 1 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", color: C.success, fontWeight: "600" }}>
                ✓ {FSI_GRANTS.find(g => g.id === selectedGrant)?.label}
                {selectedDir && ` · ${DIRECTIONS.find(d => d.id === selectedDir)?.label} ${DIRECTIONS.find(d => d.id === selectedDir)?.full}`}
              </div>
              <button onClick={() => setStep(0)} style={{ padding: "5px 12px", fontSize: "11px", borderRadius: "6px", border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer" }}>← Изменить</button>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "24px", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 20px", fontSize: "13px", color: C.muted, lineHeight: "1.7" }}>
                Заполни данные кратко — AI сам развернёт их в полные разделы заявки.
              </p>
              {USER_FIELDS.map(f => (
                <Inp key={f.key} label={f.label} value={userData[f.key] || ""} onChange={setField(f.key)} placeholder={f.placeholder} multiline={f.multiline} />
              ))}
            </div>

            {!canStep2 && <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 12px" }}>* Заполни обязательные поля</p>}
            <button onClick={() => canStep2 && setStep(2)} disabled={!canStep2} style={{
              width: "100%", padding: "13px", borderRadius: "10px", border: "none",
              fontSize: "14px", fontWeight: "600",
              background: canStep2 ? C.accent : "rgba(255,255,255,0.05)",
              color: canStep2 ? "#fff" : C.muted,
              cursor: canStep2 ? "pointer" : "not-allowed",
            }}>Перейти к генерации →</button>
          </div>
        )}

        {/* ── STEP 2: Генерация ── */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: C.text }}>{userData.title}</div>
                <div style={{ fontSize: "11px", color: C.muted, marginTop: "2px" }}>{userData.name} · {userData.org}</div>
              </div>
              <button onClick={() => setStep(1)} style={{ padding: "5px 12px", fontSize: "11px", borderRadius: "6px", border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer" }}>← Изменить</button>
            </div>

            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: C.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(doneCount / sections.length) * 100}%`, background: C.accent, transition: "width 0.4s" }} />
              </div>
              <span style={{ fontSize: "12px", color: C.muted, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>{doneCount}/{sections.length} полей</span>
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <button onClick={generateAll} disabled={genAll} style={{
                flex: 1, padding: "11px", borderRadius: "8px", border: "none",
                background: genAll ? "rgba(59,130,246,0.2)" : C.accent,
                color: "#fff", fontWeight: "600", fontSize: "13px",
                cursor: genAll ? "not-allowed" : "pointer",
              }}>{genAll ? "⟳ Генерирую..." : "⚡ Сгенерировать всё"}</button>
              {doneCount > 0 && (
                <button onClick={exportText} style={{ padding: "11px 18px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "transparent", color: C.text, fontSize: "13px", cursor: "pointer" }}>↓ .txt</button>
              )}
            </div>

            {sections.map(s => (
              <SectionCard key={s.id} section={s} result={results[s.id]} loading={!!loading[s.id]}
                onGenerate={() => generateOne(s.id)} onRegen={() => generateOne(s.id)}
                onDelete={() => deleteField(s.id)} isCustom={s.isCustom} />
            ))}

            {!showAddField ? (
              <button onClick={() => setShowAddField(true)} style={{
                width: "100%", padding: "11px", borderRadius: "10px", marginTop: "8px",
                border: "1px dashed rgba(245,158,11,0.4)", background: "transparent",
                color: C.warn, fontSize: "13px", cursor: "pointer",
              }}>+ Добавить своё поле</button>
            ) : (
              <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "12px", padding: "18px", marginTop: "8px" }}>
                <p style={{ margin: "0 0 14px", fontSize: "12px", color: C.warn, fontWeight: "600" }}>★ Новое поле</p>
                <Inp label="Название поля *" value={newLabel} onChange={setNewLabel} placeholder="например: Экологический эффект проекта" />
                <Inp label="Подсказка (необязательно)" value={newHint} onChange={setNewHint} placeholder="Что нужно написать в этом разделе" />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={addCustomField} disabled={!newLabel.trim()} style={{
                    flex: 1, padding: "10px", borderRadius: "8px", border: "none",
                    background: newLabel.trim() ? C.warn : "rgba(255,255,255,0.05)",
                    color: newLabel.trim() ? "#000" : C.muted,
                    fontWeight: "600", fontSize: "13px",
                    cursor: newLabel.trim() ? "pointer" : "not-allowed",
                  }}>Добавить поле</button>
                  <button onClick={() => { setShowAddField(false); setNewLabel(""); setNewHint(""); }} style={{ padding: "10px 16px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: "13px", cursor: "pointer" }}>Отмена</button>
                </div>
              </div>
            )}

            {doneCount === sections.length && doneCount > 0 && (
              <div style={{ marginTop: "20px", padding: "20px", borderRadius: "12px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)", textAlign: "center" }}>
                <div style={{ fontSize: "18px", marginBottom: "6px" }}>✓</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: C.success }}>Все {sections.length} полей готовы!</div>
                <button onClick={exportText} style={{ marginTop: "12px", padding: "10px 28px", borderRadius: "8px", border: "none", background: C.success, color: "#fff", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>↓ Скачать заявку .txt</button>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: `1px solid ${C.border}`, fontSize: "11px", color: "rgba(226,232,240,0.12)", textAlign: "center" }}>
          AI Grant Writer · Фонд содействия инновациям 2026
        </div>
      </div>
    </div>
  );
}