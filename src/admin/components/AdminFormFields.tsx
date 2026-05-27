type FieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
};

export function Field({ label, value, onChange }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-poster text-[10px] uppercase tracking-[0.2em] text-ink/70">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border-2 border-ink bg-cream px-3 py-2 text-ink"
      />
    </label>
  );
}

export function Area({ label, value, onChange }: FieldProps) {
  return (
    <label className="sm:col-span-2 flex flex-col gap-1 text-sm">
      <span className="font-poster text-[10px] uppercase tracking-[0.2em] text-ink/70">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="rounded-xl border-2 border-ink bg-cream px-3 py-2 text-ink"
      />
    </label>
  );
}
