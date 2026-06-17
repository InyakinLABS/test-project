export const MATCH_MODES = [
  { value: "", label: "Все режимы" },
  { value: "competitive", label: "Соревновательный" },
  { value: "unrated", label: "Обычный" },
  { value: "deathmatch", label: "Deathmatch" },
  { value: "spikerush", label: "Spike Rush" },
  { value: "escalation", label: "Escalation" },
] as const;

interface ModeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModeFilter({ value, onChange }: ModeFilterProps) {
  return (
    <div className="filters">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="filters__select"
      >
        {MATCH_MODES.map((mode) => (
          <option key={mode.value || "all"} value={mode.value}>
            {mode.label}
          </option>
        ))}
      </select>
    </div>
  );
}
