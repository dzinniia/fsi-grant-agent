import { useState } from "react";

// ─── Структура заявки ФСИ СТАРТ-1 ──────────────────────────────────────────
const SECTIONS = [
  {
    id: "summary",
    label: "Аннотация проекта",
    tag: "ЧТО МЫ ДЕЛАЕМ",
    hint: "Краткое описание: продукт, технология, результат (3–5 предложений)",
  },
  {
    id: "problem",
    label: "Проблема и актуальность",
    tag: "ЗАЧЕМ ЭТО НУЖНО",
    hint: "Какую боль рынка решаете? Почему сейчас? Каков масштаб проблемы?",
  },
  {
    id: "solution",
    label: "Техническое решение и новизна",
    tag: "КАК МЫ РЕШАЕМ",
    hint: "Суть разработки, научно-технический задел, патенты/ноу-хау, отличие от аналогов",
  },
  {
    id: "plan",
    label: "Техническое задание и план НИОКР",
    tag: "ЧТО БУДЕМ ДЕЛАТЬ",
    hint: "Этапы работ на 12 месяцев, измеримые результаты каждого этапа, конкретные числовые параметры",
  },
  {
    id: "market",
    label: "Рынок и коммерческий потенциал",
    tag: "КТО ЗАПЛАТИТ",
    hint: "TAM/SAM/SOM, целевые сегменты, конкурентное сравнение, бизнес-модель, каналы продаж",
  },
  {
    id: "team",
    label: "Команда проекта",
    tag: "КТО ДЕЛАЕТ",
    hint: "Состав команды, компетенции, роли, опыт в теме, планы найма",
  },
];

const DIRECTIONS = [
  { id: "N1", label: "Н1 · Цифровые технологии / ИИ" },
  { id: "N2", label: "Н2 · Медицина и здоровьесбережение" },
  { id: "N3", label: "Н3 · Новые материалы и химия" },
  { id: "N4", label: "Н4 · Приборы и производственные технологии" },
  { id: "N5", label: "Н5 · Биотехнологии" },
  { id: "N6", label: "Н6 · Ресурсосберегающая энергетика" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function buildPrompt(section, form, direction) {
  const dirLabel = DIRECTIONS.find(d => d.id === direction)?.label || direction;
  return `Ты эксперт по написанию заявок в Фонд содействия инновациям (ФСИ) по программе «Старт-1».

Информация о проекте:
- Название: ${form.title}
- Направление: ${dirLabel}
- Продукт/технология: ${form.product}
- Целевой рынок: ${form.market}
- Конкуренты и отличие: ${form.competitors}
- Задел / что уже есть: ${form.backlog}
- Команда: ${form.team}

Напиши раздел заявки: «${section.label}»

Требования к тексту:
- Язык: профессиональный русский, деловой стиль
- Конкретные факты, числа, параметры — не абстракции
- Без воды и общих фраз типа «актуальная разработка», «перспективный рынок»
- Объём: 200–350 слов
- Эксперты ФСИ оценивают: научно-технический уровень (40%), коммерческий потенциал (40%), команду (20%)

Напиши ТОЛЬКО текст раздела, без заголовка и пояснений.`;
}

// ─── UI Components ────────────────────────────────────────────────────────────
const colors = {
  bg: "#0d0f14",
  surface: "#13161e",
  border: "rgba(255,255,255,0.07)",
  accent: "#3b82f6",
  accentGlow: "rgba(59,130,246,0.15)",
  gold: "#f59e0b",
  text: "#e2e8f0",
  muted: "rgba(226,232,240,0.4)",
  success: "#10b981",
};

function Input({ label, value, onChange, placeholder, multiline, rows = 3 }) {
  const base = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    padding: "10px 14px",
    color: colors.text,
    fontSize: "13px",
    fontFamily: "'IBM Plex Mono', monospace",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: colors.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
        {label}
      </label>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
      }
    </div>
  );
}

function SectionCard({ section, result, loading, onGenerate, onRegen }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const done = !!result && !loading;

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      border: `1px solid ${done ? "rgba(59,130,246,0.35)" : colors.border}`,
      borderRadius: "12px",
      marginBottom: "10px",
      overflow: "hidden",
      background: done ? "rgba(59,130,246,0.04)" : colors.surface,
      transition: "all 0.2s",
    }}>
      {/* Header */}
      <div
        onClick={() => done && setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "14px 18px", cursor: done ? "pointer" : "default",
        }}
      >
        <div style={{
          width: "22px", height: "22px", borderRadius: "50%",
          background: done ? colors.accent : "rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", color: done ? "#fff" : colors.muted, flexShrink: 0,
        }}>
          {done ? "✓" : loading ? "…" : "·"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: done ? colors.text : colors.muted }}>{section.label}</div>
          <div style={{ fontSize: "11px", color: colors.muted, marginTop: "2px" }}>
            <span style={{ background: "rgba(245,158,11,0.12)", color: colors.gold, padding: "1px 7px", borderRadius: "4px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px" }}>{section.tag}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {done && (
            <button onClick={e => { e.stopPropagation(); copy(); }} style={{
              padding: "5px 11px", fontSize: "11px", borderRadius: "6px",
              border: `1px solid ${colors.border}`, background: "transparent",
              color: copied ? colors.success : colors.muted, cursor: "pointer",
            }}>{copied ? "✓" : "copy"}</button>
          )}
          {done && (
            <button onClick={e => { e.stopPropagation(); onRegen(); }} style={{
              padding: "5px 11px", fontSize: "11px", borderRadius: "6px",
              border: `1px solid rgba(59,130,246,0.3)`, background: "transparent",
              color: colors.accent, cursor: "pointer",
            }}>↺</button>
          )}
          {!done && !loading && (
            <button onClick={onGenerate} style={{
              padding: "5px 14px", fontSize: "11px", borderRadius: "6px",
              border: "none", background: colors.accent,
              color: "#fff", cursor: "pointer", fontWeight: "600",
            }}>Генерировать</button>
          )}
          {loading && (
            <span style={{ fontSize: "11px", color: colors.accent, padding: "5px 11px" }}>генерирую...</span>
          )}
        </div>
      </div>

      {/* Body */}
      {done && open && (
        <div style={{
          padding: "0 18px 18px 18px",
          borderTop: `1px solid ${colors.border}`,
          paddingTop: "14px",
        }}>
          <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.9", color: "rgba(226,232,240,0.8)", whiteSpace: "pre-wrap", fontFamily: "'Lora', serif" }}>
            {result}
          </p>
        </div>
      )}

      {!done && !loading && (
        <div style={{ padding: "0 18px 12px 52px" }}>
          <p style={{ margin: 0, fontSize: "12px", color: colors.muted, fontStyle: "italic" }}>{section.hint}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0); // 0 = форма, 1 = генерация
  const [direction, setDirection] = useState("N1");
  const [form, setForm] = useState({
    title: "",
    product: "",
    market: "",
    competitors: "",
    backlog: "",
    team: "",
  });
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [genAll, setGenAll] = useState(false);
  const [error, setError] = useState("");

  const setField = key => val => setForm(f => ({ ...f, [key]: val }));

  const canProceed = form.title && form.product && form.market;

  const generateOne = async (sectionId) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    setLoading(l => ({ ...l, [sectionId]: true }));
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Ты эксперт по написанию заявок в Фонд содействия инновациям (ФСИ). Пиши конкретно, без воды, деловым русским языком. Только текст раздела, без заголовков.",
          messages: [{ role: "user", content: buildPrompt(section, form, direction) }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.text || "").join("") || "";
      setResults(r => ({ ...r, [sectionId]: text }));
    } catch (e) {
      setError("Ошибка API: " + e.message);
    } finally {
      setLoading(l => ({ ...l, [sectionId]: false }));
    }
  };

  const generateAll = async () => {
    setGenAll(true);
    for (const s of SECTIONS) {
      await generateOne(s.id);
    }
    setGenAll(false);
  };

  const exportText = () => {
    const lines = SECTIONS.map(s =>
      `═══ ${s.label.toUpperCase()} ═══\n\n${results[s.id] || "(не сгенерировано)"}\n`
    ).join("\n");
    const header = `ЗАЯВКА ФСИ · ПРОГРАММА СТАРТ-1\n${form.title}\nНаправление: ${DIRECTIONS.find(d => d.id === direction)?.label}\n\n${"─".repeat(60)}\n\n`;
    const blob = new Blob([header + lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "FSI_START1_zaявка.txt"; a.click();
  };

  const doneCount = SECTIONS.filter(s => results[s.id]).length;

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "'Inter', sans-serif", color: colors.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Lora&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(226,232,240,0.2) !important; }
        textarea, input { caret-color: #3b82f6; }
        textarea:focus, input:focus { border-color: rgba(59,130,246,0.5) !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: colors.accent, boxShadow: `0 0 10px ${colors.accent}` }} />
            <span style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", color: colors.muted, letterSpacing: "0.12em" }}>
              ФСИ · ПРОГРАММА СТАРТ-1 · AI WRITER
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", lineHeight: "1.2", color: colors.text }}>
            Генератор заявки<br />
            <span style={{ color: colors.accent }}>Фонд содействия инновациям</span>
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: "13px", color: colors.muted, lineHeight: "1.6" }}>
            Грант до 5 млн ₽ · 12 месяцев · Без софинансирования · Одобряемость ~10%
          </p>
        </div>

        {step === 0 && (
          <div>
            {/* Направление */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: colors.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                Направление конкурса
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {DIRECTIONS.map(d => (
                  <div key={d.id} onClick={() => setDirection(d.id)} style={{
                    padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                    border: `1px solid ${direction === d.id ? colors.accent : colors.border}`,
                    background: direction === d.id ? colors.accentGlow : "transparent",
                    fontSize: "12px", color: direction === d.id ? colors.text : colors.muted,
                    transition: "all 0.15s", userSelect: "none",
                  }}>{d.label}</div>
                ))}
              </div>
            </div>

            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "14px", padding: "24px", marginBottom: "20px" }}>
              <Input label="Название проекта *" value={form.title} onChange={setField("title")} placeholder="например: AI-ассистент для написания научных грантов" />
              <Input label="Что разрабатываете? Какой продукт/технология? *" value={form.product} onChange={setField("product")} placeholder="Опишите суть разработки, принцип действия, ключевые технические параметры" multiline rows={3} />
              <Input label="Целевой рынок *" value={form.market} onChange={setField("market")} placeholder="Кто покупатель, объём рынка, почему сейчас есть спрос" multiline rows={2} />
              <Input label="Конкуренты и ваше отличие" value={form.competitors} onChange={setField("competitors")} placeholder="Назовите 2–3 аналога и конкретно чем вы лучше (числа, параметры)" multiline rows={2} />
              <Input label="Научно-технический задел" value={form.backlog} onChange={setField("backlog")} placeholder="Что уже сделано: прототип, патенты, публикации, испытания, результаты расчётов" multiline rows={2} />
              <Input label="Команда" value={form.team} onChange={setField("team")} placeholder="ФИО, роли, ключевые компетенции, опыт по теме проекта" multiline rows={2} />
            </div>

            {!canProceed && (
              <p style={{ fontSize: "12px", color: colors.muted, marginBottom: "16px" }}>
                * Заполните обязательные поля чтобы продолжить
              </p>
            )}

            <button
              onClick={() => canProceed && setStep(1)}
              disabled={!canProceed}
              style={{
                width: "100%", padding: "14px", borderRadius: "10px",
                border: "none", fontSize: "14px", fontWeight: "600",
                background: canProceed ? colors.accent : "rgba(255,255,255,0.05)",
                color: canProceed ? "#fff" : colors.muted,
                cursor: canProceed ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Перейти к генерации →
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Project badge */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: colors.surface, border: `1px solid ${colors.border}`,
              borderRadius: "10px", padding: "12px 16px", marginBottom: "24px",
            }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: colors.text }}>{form.title}</div>
                <div style={{ fontSize: "11px", color: colors.muted, marginTop: "2px" }}>
                  {DIRECTIONS.find(d => d.id === direction)?.label} · СТАРТ-1 · до 5 млн ₽
                </div>
              </div>
              <button onClick={() => setStep(0)} style={{
                padding: "5px 12px", fontSize: "11px", borderRadius: "6px",
                border: `1px solid ${colors.border}`, background: "transparent",
                color: colors.muted, cursor: "pointer",
              }}>← Изменить</button>
            </div>

            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: colors.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(doneCount / SECTIONS.length) * 100}%`, background: colors.accent, transition: "width 0.4s" }} />
              </div>
              <span style={{ fontSize: "12px", color: colors.muted, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                {doneCount}/{SECTIONS.length} секций
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <button onClick={generateAll} disabled={genAll} style={{
                flex: 1, padding: "11px", borderRadius: "8px", border: "none",
                background: genAll ? "rgba(59,130,246,0.2)" : colors.accent,
                color: "#fff", fontWeight: "600", fontSize: "13px",
                cursor: genAll ? "not-allowed" : "pointer",
              }}>
                {genAll ? "⟳ Генерирую все секции..." : "⚡ Сгенерировать всё"}
              </button>
              {doneCount > 0 && (
                <button onClick={exportText} style={{
                  padding: "11px 18px", borderRadius: "8px",
                  border: `1px solid ${colors.border}`, background: "transparent",
                  color: colors.text, fontSize: "13px", cursor: "pointer",
                }}>
                  ↓ Скачать .txt
                </button>
              )}
            </div>

            {error && (
              <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", color: "#f87171", fontSize: "12px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            {/* Sections */}
            {SECTIONS.map(s => (
              <SectionCard
                key={s.id}
                section={s}
                result={results[s.id]}
                loading={!!loading[s.id]}
                onGenerate={() => generateOne(s.id)}
                onRegen={() => generateOne(s.id)}
              />
            ))}

            {doneCount === SECTIONS.length && (
              <div style={{
                marginTop: "20px", padding: "20px", borderRadius: "12px",
                background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>✓</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: colors.success, marginBottom: "4px" }}>
                  Все секции готовы
                </div>
                <div style={{ fontSize: "12px", color: colors.muted }}>
                  Скачайте текст и перенесите в систему online.fasie.ru
                </div>
                <button onClick={exportText} style={{
                  marginTop: "14px", padding: "10px 28px", borderRadius: "8px",
                  border: "none", background: colors.success,
                  color: "#fff", fontWeight: "600", fontSize: "13px", cursor: "pointer",
                }}>
                  ↓ Скачать заявку .txt
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: `1px solid ${colors.border}`, fontSize: "11px", color: "rgba(226,232,240,0.2)", textAlign: "center" }}>
          Подача заявок: online.fasie.ru · Горячая линия ФСИ: +7 (495) 249-249-2
        </div>
      </div>
    </div>
  );
}
