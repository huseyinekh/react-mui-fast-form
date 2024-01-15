import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SxProps, TextFieldVariants, Theme } from "@mui/material";

interface IProps {
  value?: any;
  label: string;
  variant?: TextFieldVariants;
  required?: boolean;
  sx?: SxProps<Theme>;
  minDate?: any;
  disabled?:boolean
}
interface IInputError {
  hasError?: boolean;
  message: string;
}
export default React.forwardRef(function DatePickerValue(props: IProps, ref) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [inputError, setInputError] = React.useState<IInputError>({
    hasError: false,
    message: "boş ola bilməz",
  });
  React.useImperativeHandle(ref, () => ({
    setValue: (val) => {
      setValue(dayjs(val));
    },
    getValue: () => value.format("YYYY-MM-DD"),
  }));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        sx={{ overflow: "hidden" ,mt:-1}}
        components={["DatePicker", "DatePicker"]}
      >
        <DatePicker
          minDate={dayjs(props.minDate)}
          format="DD.MM.YYYY"
          label={props.label}
          disabled={props.disabled}
          value={value}
          sx={props.sx}
          slotProps={{
            textField: {
              variant: props.variant || "outlined",
              required: props.required,
              helperText: inputError.hasError && inputError.message,
              error: inputError.hasError,
              onInvalid: (_e) => {
                setInputError({ hasError: true, message: "Tarix seçilməyib" });
              },
            },
          }}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
});
