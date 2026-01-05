import Switch from "@mui/material/Switch";

interface SliderSwitchProps {
  ariaLabel: string;
  label?: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

export default function SliderSwitch({
  ariaLabel,
  label = "",
  checked,
  setChecked,
}: SliderSwitchProps) {
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="flex gap-1 items-center">
      <Switch
        slotProps={{ input: { "aria-label": ariaLabel } }}
        checked={checked}
        onChange={handleChange}
      />

      <div>{label}</div>
    </div>
  );
}
