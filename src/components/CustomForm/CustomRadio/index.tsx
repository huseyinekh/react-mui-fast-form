import {
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
interface IProps {
  value?: string;
  onChange?: (e, val?) => void;
  options: IOption[];
  label?: string;
  sx?: SxProps<Theme>;
  required?: boolean;
}
type IOption = {
  [key: string]: any;
};
const CustomRadio = forwardRef((props: IProps, ref) => {
  const [value, setValue] = useState<string>('');
  const [inputError, setInputError] = useState({
    hasError: false,
    message: '',
  });
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setValue: (val) => {
      setValue(() => {
        return val;
      });
    },
    resetValue: () => {
      setValue(null);
    },
    setError: () => {
      setInputError((prev) => {
        return { ...prev, hasError: true };
      });
    },
  }));

  const inputChangeHandler = (e) => {
    setValue(() => {
      return e.target.value;
    });
    props.onChange && props.onChange(e, e.target.value);
  };
  useEffect(() => {
    props.value && setValue(props.value);
  }, [props.value]);
  return (
    <>
      <RadioGroup sx={props.sx} className='radio-group'>
        {props.label && (
          <Typography sx={{ color: 'gray' }}>{props.label}</Typography>
        )}
        {props.options &&
          props.options.map((element, i) => {
            return (
              <FormControlLabel
                style={{ color: 'gray' }}
                key={i}
                onChange={(e: React.ChangeEvent<any>) => {
                  setInputError((prev) => ({ ...prev, hasError: false }));
                  inputChangeHandler(e);
                }}
                value={element?.name}
                control={<Radio color='success' />}
                color='red'
                required={props.required !== undefined ? props.required : false}
                onInvalid={(e: any) => {
                  e.preventDefault();
                  // e.target.setCustomValidity("Boş ola bilməz");
                  setInputError({ hasError: true, message: 'Boş ola bilməz' });
                }}
                label={element?.value}
                checked={value ? value === element?.name : false}
              />
            );
          })}
        {inputError.hasError && inputError.message && (
          <FormHelperText sx={{ color: (t) => t.palette.error.main }}>
            {inputError.message}
          </FormHelperText>
        )}
      </RadioGroup>
    </>
  );
});

export default CustomRadio;
