import React from "react";
import { NumberInput, type NumberInputProps } from "@mantine/core";
import { getUnitLabel } from "~/utils/units";

interface UnitNumberInputProps extends Omit<NumberInputProps, 'label' | 'onChange'> {
  label: string;
  unitType: 'length' | 'mass' | 'volume';
  value: number;
  onChange: (value: number) => void;
}

/**
 * NumberInput component with unit label
 * Displays the appropriate unit label based on the unit type
 */
const UnitNumberInput: React.FC<UnitNumberInputProps> = ({
  label,
  unitType,
  value,
  onChange,
  ...props
}) => {
  const unitLabel = getUnitLabel(unitType);
  const displayLabel = `${label} (${unitLabel})`;

  const handleChange = (val: string | number) => {
    const numValue = typeof val === 'string' ? parseFloat(val) : val;
    onChange(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <NumberInput
      label={displayLabel}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};

export default UnitNumberInput;