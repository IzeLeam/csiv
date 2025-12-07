"use client";

type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
};

export function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <label className="flex max-w-[100px] flex-col gap-1 text-[11px] text-zinc-300">
      <span className="mb-0.5 line-clamp-1 font-medium text-zinc-300/90">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
