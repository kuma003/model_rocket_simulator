import React from "react";
import { NumberInput, type NumberInputProps } from "@mantine/core";
import { getUnitLabel, toSILength, fromSILength } from "~/utils/units";

interface UnitNumberInputProps
  extends Omit<NumberInputProps, "label" | "onChange"> {
  label: string;
  unitType: "length" | "mass" | "volume";
  value: number; // SI unit value
  onChange: (value: number) => void; // Callback with SI unit value
}

/**
 * NumberInput component with unit label and automatic unit conversion
 * Displays in user-friendly units but stores in SI units
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

  // Convert SI value to display value
  const displayValue = unitType === "length" ? fromSILength(value) : value;

  const handleChange = (val: string | number) => {
    const numValue = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(numValue)) {
      onChange(0);
      return;
    }

    // Convert display value to SI value
    let siValue = unitType === "length" ? toSILength(numValue) : numValue;
    onChange(siValue);
  };

  return (
    <NumberInput
      label={displayLabel}
      value={displayValue}
      onChange={handleChange}
      stepHoldDelay={500}
      stepHoldInterval={(t) => Math.max(1000 / t ** 2, 100)}
      min={0}
      step={0.1}
      decimalScale={1}
      fixedDecimalScale
      {...props}
    />
  );
};

export default UnitNumberInput;
