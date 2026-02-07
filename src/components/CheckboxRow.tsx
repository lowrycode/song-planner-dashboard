interface CheckboxRowProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (name: string, value: boolean) => void;
}

export default function CheckboxRow({
  id,
  name,
  label,
  checked,
  onChange,
}: CheckboxRowProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        name={name}
        type="checkbox"
        className="w-4 h-4 accent-purple-700 border border-purple-950 hover:cursor-pointer"
        checked={checked}
        onChange={(e) => onChange(name, e.currentTarget.checked)}
      />
      <label
        htmlFor={id}
        className="text-purple-950 font-semibold text-sm whitespace-nowrap hover:cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}
