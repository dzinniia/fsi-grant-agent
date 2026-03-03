import { useState } from "react";

const colors = {
  bg: "#0d0f14",
  surface: "#13161e",
  border: "rgba(255,255,255,0.07)",
  accent: "#3b82f6",
  accentGlow: "rgba(59,130,246,0.15)",
  text: "#e2e8f0",
  muted: "rgba(226,232,240,0.4)",
  success: "#10b981",
  warning: "#f59e0b",
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
      <div onClick={() => done && setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "14px 18px", cursor: done ? "pointer" : "default",
      }}>
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
          {section.hint && (
            <div style={{ fontSize: "11px", color: colors.muted, marginTop: "2px", fontStyle: "italic" }}>{section.hint}</div>
          )}
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

      {done && open && (
        <div style={{ padding: "0 18px 18px 18px", borderTop: `1px solid ${colors.border}`, paddingTop: "14px" }}>
          <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.9", color: "rgba(226,232,240,0.8)", whiteSpace: "pre-wrap", fontFamily: "'Lora', serif" }}>
            {result}
          </p>
        </div>
      )}
    </div>
  );
}

const USER_FIELDS = [
  { key: "name", label: "Имя и фамилия *", placeholder: "Иванова Данияр Алексеевна" },
  { key: "org", label: "Организация *", placeholder: "МГУ им. Ломоносова / ООО Стартап" },
  { key: "region", label: "Регион", placeholder: "Москва" },
  { key: "title", label: "Название проекта *", placeholder: "AI-ассистент для написания научных грантов" },
  { key: "product", label: "Что разрабатываете? *", placeholder: "Опишите суть разработки, технологию, принцип действия", multiline: true },
  { key: "problem", label: "Какую проблему решаете? *", placeholder: "Какую боль рынка решаете? Почему это важно?", multiline: true },
  { key: "market", label: "Целевой рынок", placeholder: "Кто покупатель, объём рынка, спрос", multiline: true },
  { key: "competitors", label: "Конкуренты и ваше отличие", placeholder: "Назовите аналоги и чем вы лучше (числа, параметры)" },
  { key: "backlog", label: "Что уже сделано / задел", placeholder: "Прототип, патенты, публикации, испытания, расчёты" },
  { key: "team", label: "Команда", placeholder: "ФИО, роли, компетенции, опыт по теме" },
  { key: "budget", label: "Запрашиваемый бюджет", placeholder: "например: 5 млн рублей на 12 месяцев" },
];

export default function App() {
  const [step, setStep] = useState(0); // 0=url, 1=userdata, 2=results
  const [url, setUrl] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [sections, setSections] = useState([]);
  const [grantName, setGrantName] = useState("");
  const [userData, setUserData] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [genAll, setGenAll] = useState(false);

  const setField = key => val => setUserData(u => ({ ...u, [key]: val }));

  const canProceedStep1 = url.startsWith("http");
  const canProceedStep2 = userData.name && userData.title && userData.product && userData.problem;
  const doneCount = sections.filter(s => results[s.id]).length;

  // Шаг 1 — парсинг URL
  const parseUrl = async () => {
    setParsing(true);
    setParseError("");
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.sections || data.sections.length === 0) throw new Error("Не удалось найти секции. Попробуй другую ссылку.");
      setSections(data.sections);
      // Пробуем определить название гранта из URL
      const urlObj = new URL(url);
      setGrantName(urlObj.hostname.replace("www.", ""));
      setStep(1);
    } catch (e) {
      setParseError(e.message);
    } finally {
      setParsing(false);
    }
  };

  // Шаг 3 — генерация одной секции
  const generateOne = async (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    setLoading(l => ({ ...l, [sectionId]: true }));
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Ты эксперт по написанию грантовых заявок. 

Данные заявителя:
- Имя: ${userData.name}
- Организация: ${userData.org || "не указано"}
- Регион: ${userData.region || "не указано"}
- Название проекта: ${userData.title}
- Описание разработки: ${userData.product}
- Проблема: ${userData.problem}
- Рынок: ${userData.market || "не указано"}
- Конкуренты: ${userData.competitors || "не указано"}
- Задел: ${userData.backlog || "не указано"}
- Команда: ${userData.team || "не указано"}
- Бюджет: ${userData.budget || "не указано"}

Напиши раздел заявки: «${section.label}»
Подсказка по разделу: ${section.hint || ""}

Требования:
- Профессиональный деловой русский язык
- Конкретные факты и числа, без воды
- Объём 150-300 слов
- Только текст раздела, без заголовка`
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setResults(r => ({ ...r, [sectionId]: text }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(l => ({ ...l, [sectionId]: false }));
    }
  };

  const generateAll = async () => {
    setGenAll(true);
    for (const s of sections) {
      await generateOne(s.id);
    }
    setGenAll(false);
  };

  const exportText = () => {
    const lines = sections.map(s =>
      `═══ ${s.label.toUpperCase()} ═══\n\n${results[s.id] || "(не сгенерировано)"}\n`
    ).join("\n");
    const header = `ГРАНТОВАЯ ЗАЯВКА\nИсточник: ${url}\nПроект: ${userData.title}\nЗаявитель: ${userData.name}\n\n${"─".repeat(60)}\n\n`;
    const blob = new Blob([header + lines], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "grant_application.txt";
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "'Inter', sans-serif", color: colors.text }}>
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
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: colors.accent, boxShadow: `0 0 10px ${colors.accent}` }} />
            <span style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", color: colors.muted, letterSpacing: "0.12em" }}>
              УНИВЕРСАЛЬНЫЙ AI ПОМОЩНИК ПО ГРАНТАМ
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", lineHeight: "1.2" }}>
            Заполни любой грант<br />
            <span style={{ color: colors.accent }}>по ссылке</span>
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: "13px", color: colors.muted }}>
            РНФ · ФСИ · УМНИК · Президентский · любой другой
          </p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
          {["Ссылка на грант", "Твои данные", "Генерация"].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: "8px", borderRadius: "8px", textAlign: "center",
              fontSize: "11px", fontWeight: "600",
              background: step === i ? colors.accentGlow : "transparent",
              border: `1px solid ${step === i ? colors.accent : colors.border}`,
              color: step === i ? colors.accent : colors.muted,
            }}>{s}</div>
          ))}
        </div>

        {/* ── STEP 0: URL ── */}
        {step === 0 && (
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "14px", padding: "28px" }}>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: colors.muted, lineHeight: "1.7" }}>
              Вставь ссылку на страницу гранта — агент прочитает требования и автоматически определит какие секции нужно заполнить.
            </p>
            <Input
              label="Ссылка на грант *"
              value={url}
              onChange={setUrl}
              placeholder="https://fasie.ru/programs/programma-start/"
            />

            {parseError && (
              <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", color: "#f87171", fontSize: "12px", marginBottom: "16px" }}>
                {parseError}
              </div>
            )}

            <button
              onClick={parseUrl}
              disabled={!canProceedStep1 || parsing}
              style={{
                width: "100%", padding: "13px", borderRadius: "10px", border: "none",
                fontSize: "14px", fontWeight: "600",
                background: canProceedStep1 && !parsing ? colors.accent : "rgba(255,255,255,0.05)",
                color: canProceedStep1 && !parsing ? "#fff" : colors.muted,
                cursor: canProceedStep1 && !parsing ? "pointer" : "not-allowed",
              }}
            >
              {parsing ? "⟳ Читаю страницу гранта..." : "Анализировать грант →"}
            </button>

            <p style={{ margin: "16px 0 0", fontSize: "11px", color: colors.muted, textAlign: "center" }}>
              Примеры: fasie.ru · rscf.ru · grants.extech.ru · любой другой сайт
            </p>
          </div>
        )}

        {/* ── STEP 1: USER DATA ── */}
        {step === 1 && (
          <div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: colors.surface, border: `1px solid ${colors.border}`,
              borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
            }}>
              <div>
                <div style={{ fontSize: "12px", color: colors.success, fontWeight: "600" }}>✓ Грант прочитан</div>
                <div style={{ fontSize: "11px", color: colors.muted, marginTop: "2px" }}>
                  Найдено секций: {sections.length} · {grantName}
                </div>
              </div>
              <button onClick={() => setStep(0)} style={{
                padding: "5px 12px", fontSize: "11px", borderRadius: "6px",
                border: `1px solid ${colors.border}`, background: "transparent",
                color: colors.muted, cursor: "pointer",
              }}>← Изменить</button>
            </div>

            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "14px", padding: "24px", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 20px", fontSize: "13px", color: colors.muted }}>
                Заполни свои данные — агент использует их чтобы написать персональный текст для каждой секции.
              </p>
              {USER_FIELDS.map(f => (
                <Input
                  key={f.key}
                  label={f.label}
                  value={userData[f.key] || ""}
                  onChange={setField(f.key)}
                  placeholder={f.placeholder}
                  multiline={f.multiline}
                  rows={3}
                />
              ))}
            </div>

            {!canProceedStep2 && (
              <p style={{ fontSize: "12px", color: colors.muted, marginBottom: "12px" }}>* Заполни обязательные поля</p>
            )}

            <button
              onClick={() => canProceedStep2 && setStep(2)}
              disabled={!canProceedStep2}
              style={{
                width: "100%", padding: "13px", borderRadius: "10px", border: "none",
                fontSize: "14px", fontWeight: "600",
                background: canProceedStep2 ? colors.accent : "rgba(255,255,255,0.05)",
                color: canProceedStep2 ? "#fff" : colors.muted,
                cursor: canProceedStep2 ? "pointer" : "not-allowed",
              }}
            >
              Перейти к генерации →
            </button>
          </div>
        )}

        {/* ── STEP 2: RESULTS ── */}
        {step === 2 && (
          <div>
            {/* Badge */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: colors.surface, border: `1px solid ${colors.border}`,
              borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
            }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: colors.text }}>{userData.title}</div>
                <div style={{ fontSize: "11px", color: colors.muted, marginTop: "2px" }}>{userData.name} · {grantName}</div>
              </div>
              <button onClick={() => setStep(1)} style={{
                padding: "5px 12px", fontSize: "11px", borderRadius: "6px",
                border: `1px solid ${colors.border}`, background: "transparent",
                color: colors.muted, cursor: "pointer",
              }}>← Изменить</button>
            </div>

            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: colors.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(doneCount / sections.length) * 100}%`, background: colors.accent, transition: "width 0.4s" }} />
              </div>
              <span style={{ fontSize: "12px", color: colors.muted, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                {doneCount}/{sections.length} секций
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
                {genAll ? "⟳ Генерирую..." : "⚡ Сгенерировать всё"}
              </button>
              {doneCount > 0 && (
                <button onClick={exportText} style={{
                  padding: "11px 18px", borderRadius: "8px",
                  border: `1px solid ${colors.border}`, background: "transparent",
                  color: colors.text, fontSize: "13px", cursor: "pointer",
                }}>↓ .txt</button>
              )}
            </div>

            {/* Sections */}
            {sections.map(s => (
              <SectionCard
                key={s.id}
                section={s}
                result={results[s.id]}
                loading={!!loading[s.id]}
                onGenerate={() => generateOne(s.id)}
                onRegen={() => generateOne(s.id)}
              />
            ))}

            {doneCount === sections.length && doneCount > 0 && (
              <div style={{
                marginTop: "20px", padding: "20px", borderRadius: "12px",
                background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>✓</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: colors.success, marginBottom: "4px" }}>
                  Все секции готовы!
                </div>
                <button onClick={exportText} style={{
                  marginTop: "12px", padding: "10px 28px", borderRadius: "8px",
                  border: "none", background: colors.success,
                  color: "#fff", fontWeight: "600", fontSize: "13px", cursor: "pointer",
                }}>↓ Скачать заявку .txt</button>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: `1px solid ${colors.border}`, fontSize: "11px", color: "rgba(226,232,240,0.15)", textAlign: "center" }}>
          AI Grant Writer · Работает с любым грантом
        </div>
      </div>
    </div>
  );
}