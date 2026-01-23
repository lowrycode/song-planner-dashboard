type SelectOption = {
  id: number;
  name: string;
};

type AccessSelectProps = {
  value: number | "";
  placeholder: string;
  options: SelectOption[];
  onChange: (value: number | "") => void;
};

export default function AccessSelect({
  value,
  placeholder,
  options,
  onChange,
}: AccessSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value === "" ? "" : Number(e.target.value))
      }
      className="border border-gray-300 bg-white rounded px-2 py-1 w-60"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
}
