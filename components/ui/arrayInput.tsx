import React, { useState } from "react";
import { Label } from "./label";
import { Plus, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { capitalizeFirstLetter } from "@/lib/utils";

type ArrayInputProps = {
  defaultArray?: string[];
  options: {
    minLength?: number;
    maxLength?: number;
    name: string;
    icon: React.ReactNode;
  };
} & React.InputHTMLAttributes<HTMLInputElement>;

export const ArrayInput = ({
  defaultArray,
  options,
  ...props
}: ArrayInputProps) => {
  const [currentValue, setCurrentValue] = useState("");
  const [array, setArray] = useState<string[]>(defaultArray || []);
  const updateArray = (newArray: string[]) => {
    setArray(newArray);

    props.onChange?.({
      target: {
        name: props.name,
        value: newArray.join(","),
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const addValue = () => {
    const trimmedValue = currentValue.trim();
    if (trimmedValue && !array.includes(trimmedValue)) {
      if (
        trimmedValue.length >= (options?.minLength || 2) &&
        trimmedValue.length <= (options?.maxLength || 50)
      ) {
        updateArray([...array, trimmedValue]);
        setCurrentValue("");
      }
    }
  };

  const removeValue = (valueToRemove: string) => {
    updateArray(array.filter((value) => value !== valueToRemove));
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={options.name} className="flex items-center gap-2">
          {options.icon}
          {capitalizeFirstLetter(options.name)}
        </Label>
        <div className="flex gap-2">
          <Input
            id={options.name}
            placeholder={`Add ${options.name} (10-100 characters)`}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addValue();
              }
            }}
            className={array.length === 0 ? "border-destructive" : ""}
          />
          <Button
            type="button"
            onClick={addValue}
            variant="outline"
            size="icon"
            disabled={
              !currentValue.trim() ||
              currentValue.length < (options?.minLength || 2) ||
              currentValue.length > (options?.maxLength || 50)
            }
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {array.length === 0 && (
          <p className="text-sm text-destructive">
            At least one {options.name} is required.
          </p>
        )}
        {array.map((value) => (
          <div
            key={value}
            className="inline-flex w-full items-center justify-between gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded truncate text-sm font-medium border border-primary/20 animate-in fade-in-0 zoom-in-95"
          >
            {value}
            <button
              type="button"
              onClick={() => removeValue(value)}
              className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <Input {...props} type="hidden" value={array.join(",")} />
    </>
  );
};
