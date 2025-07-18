import React from "react";
import { NumberInput, type NumberInputProps } from "@mantine/core";
import {
  getUnitLabel,
  toSILength,
  fromSILength,
  toSIVolume,
  toSIMass,
  fromSIVolume,
  fromSIMass,
} from "~/utils/units";

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
  let displayValue = value;
  if (unitType === "length") {
    displayValue = fromSILength(value, "cm");
  } else if (unitType === "mass") {
    displayValue = fromSIMass(value, "g"); // Mass is already in SI (grams)
  } else if (unitType === "volume") {
    displayValue = fromSIVolume(value, "cm³");
  }

  const handleChange = (val: string | number) => {
    const numValue = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(numValue)) {
      onChange(0.1);
      return;
    }

    let siValue = 0;
    // Convert display value to SI value
    if (unitType === "length") {
      siValue = toSILength(numValue, "cm");
    } else if (unitType === "mass") {
      siValue = toSIMass(numValue, "g"); // No conversion needed
    } else if (unitType === "volume") {
      siValue = toSIVolume(numValue, "cm³");
    }
    onChange(siValue);
  };

  return (
    <NumberInput
      label={displayLabel}
      value={displayValue}
      onChange={handleChange}
      stepHoldDelay={500}
      stepHoldInterval={(t) => Math.max(1000 / t ** 2, 75)}
      clampBehavior="strict"
      allowNegative={false}
      min={0.1}
      step={0.1}
      max={100}
      decimalScale={1}
      fixedDecimalScale
      {...props}
    />
  );
};

export default UnitNumberInput;
