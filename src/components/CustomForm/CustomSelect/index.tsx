import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { forwardRef, useImperativeHandle, useState, useId, useEffect } from 'react';
import React from 'react';
interface IProps {
  label: string;
  value?: numOrStr;
  required?: boolean;
  optionLabelKey?: string;
  optionValueKey?: string;
  errorMessage?: string;
  options?: IOption[];
  onChange?: (e: SelectChangeEvent<any>) => void;
  variant?: 'filled' | 'standard' | 'outlined';
  disabled?: boolean;
}
type numOrStr = number | string;
type IOption = {
  [key: string]: any;
};
const CustomSelect = forwardRef((props: IProps, ref?) => {
  const [value, setValue] = useState<numOrStr>('');
  const [elementId] = useState(useId());
  const [options, setOptions] = useState<IOption[]>([]);
  const [inputError, setInputError] = useState({
    hasError: false,
    message: 'Boş buraxıla bilməz',
  });
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setValue: (value) => setValue(value),
    serError: () => {
      alert();
      setInputError((prev) => {
        return { ...prev, hasError: true };
      });
    },
    setError: (message?: string) => {
      setInputError({ hasError: true, message: message || inputError.message });
    },
    required: props.required,
    resetValue: () => {
      setValue('');
      setInputError((prev) => {
        return { ...prev, hasError: false };
      });
    },
    setOptions: (options: IOption[]) => {
      setOptions(options);
    },
  }));
  const handleChange = (e) => {
    setValue(() => {
      return e.target.value;
    });
  };
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
    props.options && setOptions(props.options);
  }, [props.options]);
  return (
    <>
      <FormControl fullWidth>
        <InputLabel color='primary' sx={{ mt: -1 }} id={elementId}>
          {props.label}
        </InputLabel>
        <Select
          error={inputError.hasError}
          labelId={elementId}
          id={elementId}
          value={ref ? value : props.value}
          label={props.label}
          variant={props.variant || 'filled'}
          disabled={props.disabled}
          onChange={(e) => {
            handleChange(e);
            props.onChange && props.onChange(e);
          }}
          required={props.required}
          onInvalid={(e: any) => {
            e.preventDefault();
            // e.target.setCustomValidity("Boş ola bilməz");
            if (props.required) {
              setInputError((prev) => {
                return { ...prev, hasError: true };
              });
            }
          }}
        >
          {options &&
            options.map((el, i) => (
              <MenuItem key={i} value={props.optionValueKey ? el[props.optionLabelKey] : el.id}>
                {props.optionLabelKey ? el[props.optionLabelKey] : el.name}
              </MenuItem>
            ))}
        </Select>
        {inputError.hasError && inputError.message && <FormHelperText sx={{ color: 'darkred' }}>{inputError.message}</FormHelperText>}
      </FormControl>
    </>
  );
});

export default CustomSelect;
