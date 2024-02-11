import { SxProps, TextField } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
interface IProps {
  value?: string | number;
  onChange?: (e: any, val?: any) => void;
  label: string;
  errorMessage?: string;
  required?: boolean;
  inputProps?: any;
  minLength?: number;
  className?: string;
  inputAttr?: { type: string; [key: string]: string | any };
  disabled?: boolean;
  variant?: "outlined" | "filled" | "standard";
  placeholder?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  enableMinusNumber?: boolean;
  disablePointerNumber?: boolean;
  multiline?: boolean;
  minRows?: number;
}
type numOrStr = number | string;
const defaultVariant = "outlined";
const CustomTextField = forwardRef((props: IProps, ref?) => {
  let minLength = props.minLength || 1;
  const [inputError, setInputError] = useState({
    hasError: false,
    message: "Boş ola bilməz",
  });
  const [value, setValue] = useState<numOrStr>("");
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setValue: (value) => setValue(value),
    required:props.required,
    rerender: () => {
      props.onChange && props.onChange({ target: { value: value } }, value);
      setValue((prev) => {
        const newVal = prev;
        return newVal;
      });
    },
    resetValue: () => {
      setValue("");
      setInputError((prev) => {
        return { ...prev, hasError: false };
      });
    },
    setError: (message?) => {
      setInputError((prev) => ({
        ...prev,
        message: message || prev.message,
        hasError: true,
      }));
    },
  }));
  useEffect(() => {
    if (props.errorMessage) {
      setInputError((prev) => {
        return { ...prev, message: props.errorMessage };
      });
    }
  }, [props.errorMessage]);
  useEffect(() => {
    const isNumberInput = props?.inputAttr?.type === "number";
    const hasValidValue =
      ((value || props?.value) ?? "").toString().length >= minLength;
    const isRequired = props?.required;

    if (!isNumberInput && hasValidValue && isRequired) {
      setInputError((prev) => ({ ...prev, hasError: false }));
    }
    if (!props?.value && value && hasValidValue && isRequired) {
      setInputError((prev) => ({ ...prev, hasError: false }));
    }
    if (isNumberInput && props?.value !== 0 && isRequired) {
      setInputError((prev) => ({ ...prev, hasError: false }));
    }
  }, [props?.value, value]);
  return (
    <TextField
      minRows={props.minRows}
      multiline={props.multiline}
      className={props.className ? props.className : ""}
      required={props.required}
      value={(ref ? value : props.value) || ""}
      label={props.label}
      error={inputError.hasError}
      helperText={inputError.hasError && inputError.message}
      disabled={props.disabled}
      variant={props.variant ?? defaultVariant}
      placeholder={props.placeholder}
      style={{width:"100%",...props.style}}
      sx={props.sx}
      onInvalid={(e: any) => {
        e.preventDefault();
        // e.target.setCustomValidity("Boş ola bilməz");
        if (props.required) {
          setInputError((prev) => {
            return { ...prev, hasError: true };
          });
        }
      }}
      InputProps={{
        ...props.inputProps,
        inputProps: {
          step: "0.01",
          min: 0,
        },
      }}
      onKeyDown={(evt) => {
        if (props?.inputAttr?.type == "number") {
          (evt.key === "+" || evt.key === "-" || evt.key === "e") &&
            evt.preventDefault();
          props.disablePointerNumber && evt.key === "." && evt.preventDefault();
        }
      }}
      onChange={(e) => {
        console.log(e.target.value);
        if (
          (props?.inputAttr?.type === "number" &&
            parseInt(e.target.value) < 0) ||
          e.target.value.startsWith("-")
        ) {
        } else {
          setValue(e.target.value);
          props.onChange && props.onChange(e);
        }
      }}
      {...(props.required ? props.inputAttr : {})}
    />
  );
});
export default CustomTextField;
