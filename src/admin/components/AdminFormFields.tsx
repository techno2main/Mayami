type FieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
};

type MediaFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  onUpload: (file: File) => Promise<string>;
  helperText?: string;
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

export function MediaField({ label, value, onChange, onUpload, helperText }: MediaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-poster text-[10px] uppercase tracking-[0.2em] text-ink/70">{label}</span>
      <div className="flex flex-col gap-2 rounded-xl border-2 border-ink bg-cream p-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://... or upload below"
          className="rounded-xl border-2 border-ink bg-cream px-3 py-2 text-ink"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            try {
              const uploadedUrl = await onUpload(file);
              onChange(uploadedUrl);
            } catch (error) {
              window.alert(error instanceof Error ? error.message : "Upload failed");
            } finally {
              event.target.value = "";
            }
          }}
          className="rounded-xl border-2 border-ink bg-cream px-3 py-2 text-xs text-ink"
        />
      </div>
      {helperText ? <span className="text-xs text-ink/60">{helperText}</span> : null}
    </label>
  );
}
