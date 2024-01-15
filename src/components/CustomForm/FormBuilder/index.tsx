import { Grid } from '@mui/material';
import ComponentIdentifier from '../componentIdentifier';
import React from 'react';
// import IFormElement from '../../../interfaces/IFormElement';
interface IProps {
  elements: any[];
  spacing?: number;
}
const FormBuilder = (props: IProps) => {
  return (
    <Grid container spacing={props.spacing || 2}>
      {props.elements.map((input, index) => (
        <ComponentIdentifier key={index} input={input} />
      ))}
    </Grid>
  );
};

export default FormBuilder;
