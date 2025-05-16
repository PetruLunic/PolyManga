import { useRef } from "react";
import { Button, ButtonProps } from "@heroui/react"; // Assuming ButtonProps is exported
import React from 'react'; // Import React for CSSProperties

interface Props extends Omit<ButtonProps, "onChange"> {
  onChange: (value: string) => void;
  value?: string;
}

// CSS properties for visually hiding the input
const visuallyHiddenStyle: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px', // To ensure it's not taking up 1px of space visually
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export function ColorPickerButton({ onChange, value, children, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openColorPicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <Button
        onPress={openColorPicker} // onPress is fine if HeroUI handles it
        aria-label="Pick a color"
        className="relative"
        endContent={value &&
            <span style={{
              backgroundColor: value,
              width: "10px", // Consider using theme units or rem/em if available
              height: "10px",
              borderRadius: "50%", // For a perfect circle
              display: 'inline-block', // Ensures it takes up space
              border: '1px solid rgba(0,0,0,0.1)' // Optional: slight border for light colors
            }}>
          </span>
        }
        {...props}
      >
        {children}
        <input
          ref={inputRef}
          type="color"
          value={value || '#000000'} // Native color input needs a valid hex value
          onChange={handleChange}
          style={visuallyHiddenStyle}
          aria-hidden="true" // Indicate it's hidden for assistive technologies (button is the control)
          tabIndex={-1} // Remove from tab order
        />
      </Button>
    </>
  );
}
