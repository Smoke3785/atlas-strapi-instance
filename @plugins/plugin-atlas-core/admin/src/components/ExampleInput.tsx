import * as React from "react";

type ChangeHandler = (event: {
  target: { name: string; type: string; value: string };
}) => void;

interface InputProps {
  intlLabel: { id: string; defaultMessage: string };
  attribute: { type: string };
  required?: boolean;
  disabled?: boolean;
  value?: string;
  name: string;
  onChange?: ChangeHandler;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onChange = () => {}, // Default to a no-op function
      disabled = false,
      required = false,
      value = "",
      attribute,
      intlLabel,
      name,
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        target: { name, type: attribute.type, value: e.currentTarget.value },
      });
    };

    return (
      <label>
        {/* {formatMessage(intlLabel)} */}
        Fart!
        <input
          ref={ref}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          onChange={handleChange}
        />
      </label>
    );
  }
);

export default Input;
