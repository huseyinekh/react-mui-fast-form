import { TextFieldVariants } from "@mui/material";
import { DatePicker, DateView } from "@mui/x-date-pickers";
import { error } from "console";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
type stringOrDate = string | Date;
interface IProps {
  value?: stringOrDate;
  label: string;
  format?: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  onChange?: (value: stringOrDate) => void;
  views?: DateView[];
  variant?:TextFieldVariants
}
interface IInputError {
  hasError?: boolean;
  message: string;
}

const Index = forwardRef((props: IProps, ref?) => {
  const [defaultDateFormat, setDefaultDateFormat] = useState("YYYY-MM-DD");
  const [inputError, setInputError] = useState<IInputError>({
    hasError: false,
    message: "boş ola bilməz",
  });
  const [value, setValue] = useState<any>();
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setValue: (val) => {
      const date = dayjs(val);
      setValue(date);
    },
    resetValue: () => {
      setInputError((prev) => ({ ...prev, hasError: false }));
    },
    setError: (error: IInputError) => {
      setInputError((prev) => ({ ...prev, hasError: true }));
    },
  }));

  useEffect(() => {
    if (props.views) {
      setDefaultDateFormat("YYYY");
    }
  }, []);
  useEffect(() => {
    if (props.value || value) {
      setInputError((prev) => {
        return { ...prev, hasError: false };
      });
    }
  }, [props.value, value]);
  useEffect(() => {
    if (props.errorMessage) {
      setInputError((prev) => {
        return { ...prev, message: props.errorMessage };
      });
    }
  }, [props.errorMessage]);
  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  });
  return (
    <>
      <DatePicker
        views={props.views}
        
        disableFuture
        className="short"
        label={props.label}
        
        format={props.format ?? defaultDateFormat}
        value={ ()=>dayjs(value).format(props.format ?? defaultDateFormat)}
        disabled={props.disabled}
        slotProps={{
          textField: {
            
            variant: props.variant||"outlined",
            required: props.required,
            helperText: inputError.hasError && inputError.message,
            error: inputError.hasError,
            onInvalid: (e) => {
            
              setInputError({ hasError: true, message: "Tarix seçilməyib" });
            },
          },
        }}
        onChange={(value: any) => {
          if (value.isValid()) {
            const date = dayjs(value).format(props.format ?? defaultDateFormat);
            setValue((prevValue) => date);
            props.onChange && props.onChange(value);
          }
        }}
      />
    </>
  );
});
export default Index;
