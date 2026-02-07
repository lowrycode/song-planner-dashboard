import CheckboxRow from "./CheckboxRow";

interface UsageRangeCheckboxesProps {
  filterUsedInRange: boolean;
  filterFirstUsedInRange: boolean;
  filterLastUsedInRange: boolean;
  onChange: (name: string, value: boolean) => void;
}

export default function UsageRangeCheckboxes({
  filterUsedInRange,
  filterFirstUsedInRange,
  filterLastUsedInRange,
  onChange,
}: UsageRangeCheckboxesProps) {
  return (
    <div>
      <CheckboxRow
        id="filter-used-in-range"
        name="filterUsedInRange"
        label="Filter used in range"
        checked={filterUsedInRange}
        onChange={onChange}
      />

      <CheckboxRow
        id="filter-first-used-in-range"
        name="filterFirstUsedInRange"
        label="Filter first used in range"
        checked={filterFirstUsedInRange}
        onChange={onChange}
      />

      <CheckboxRow
        id="filter-last-used-in-range"
        name="filterLastUsedInRange"
        label="Filter last used in range"
        checked={filterLastUsedInRange}
        onChange={onChange}
      />
    </div>
  );
}
