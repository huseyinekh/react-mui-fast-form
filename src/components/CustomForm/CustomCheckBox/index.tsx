import { Checkbox, FormControlLabel } from "@mui/material";
import { useState, useImperativeHandle, forwardRef } from "react";
import React from 'react'
interface IProps {
  label: string;
  onChange?: (val: boolean) => void;
}
const Index = forwardRef((props: IProps, ref) => {
  const [value, setValue] = useState(false);
  const handleChange = (val) => {
    setValue(val);
  };
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setValue: (value: boolean) => {
      setValue(value);
    },
  }));
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          onChange={(_e, val) => {
            props.onChange && props.onChange(val);
            handleChange(val);
          }}
        />
      }
      label={props.label}
    />
  );
});
export default Index;
