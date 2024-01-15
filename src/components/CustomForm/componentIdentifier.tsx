import { Button, Grid } from '@mui/material';
import CustomTextField from '../CustomForm/CustomTextField';
import CustomDatePicker from './CustomDatePicker';
import CustomRadio from './CustomRadio';
import CustomAutoComplete from './CustomAutoComplete';
import CustomSelect from './CustomSelect';
import CustomMultipleAutoComplete from './CustomMultipleAutoComplete';
import React from 'react';

interface IProps {
  key: string | number;
  component?: JSX.Element;
  input: any;
}
const ComponentIdentifier = (props: IProps) => {
  let input = <></>;
  switch (props.input.type) {
    case 'date':
      input = (
        <Grid item xs={props.input.gridSize}>
          <CustomDatePicker
            variant={props.input.variant || 'outlined'}
            required={props.input.required}
            ref={props.input.ref}
            key={props.input.name}
            label={props.input.label}
            disabled={props.input.disabled}
          />
        </Grid>
      );
      break;
    case 'radio':
      input = (
        <Grid item xs={props.input.gridSize}>
          <CustomRadio
            required={props.input.required}
            label={props.input.label}
            ref={props.input.ref}
            key={props.input.name}
            options={props.input.options}
            {...props.input.additionals}
            variant={props.input.variant || 'outlined'}
            disabled={props.input.disabled}
          />
        </Grid>
      );
      break;
    case 'select':
      input = (
        <Grid item xs={props.input.gridSize}>
          <CustomSelect
            required={props.input.required}
            ref={props.input.ref}
            key={props.input.name}
            label={props.input.label}
            variant={props.input.variant || 'outlined'}
            disabled={props.input.disabled}
            options={props.input.options}
          />
        </Grid>
      );
      break;
    case 'component':
      // write
      break;
    case 'button':
      input = (
        <Grid item xs={props.input.gridSize}>
          <Button
            variant={props.input?.variant || 'contained'}
            {...(props.input.additionals && props.input.additionals)}
          >
            {props.input.label}
          </Button>
        </Grid>
      );
      break;
    case 'autoComplete':
      input = (
        <Grid item xs={props.input.gridSize}>
          <CustomAutoComplete
            getDataFromApi={props.input?.api}
            attr={{
              required: props.input.required,
            }}
            ref={props.input.ref}
            key={props.input.name}
            label={props.input.label}
            variant={props.input.variant || 'outlined'}
            disabled={props.input.disabled}
            {...props.input.additionals}
          />
        </Grid>
      );
      break;
    case 'MultipleAutoComplete':
      input = (
        <Grid item xs={props.input.gridSize}>
          <CustomMultipleAutoComplete
            getDataFromApi={props.input?.api}
            attr={{
              required: props.input.required,
            }}
            ref={props.input.ref}
            key={props.input.name}
            label={props.input.label}
            variant={props.input.variant || 'outlined'}
            disabled={props.input.disabled}
            {...props.input.additionals}
          />
        </Grid>
      );
      // write
      break;
    case 'scrollableAutoComplete':
      // write
      break;
    case 'custom':
      input = (
        <Grid item xs={props.input.gridSize}>
          {props.input.component}
        </Grid>
      );

      break;
    default:
      input = (
        <Grid item xs={props.input.gridSize}>
          <CustomTextField
            required={props.input.required}
            ref={props.input.ref}
            key={props.input.name}
            label={props.input.label}
            variant={props.input.variant || 'outlined'}
            disabled={props.input.disabled}
            {...props.input?.additionals}
          />
        </Grid>
      );
      break;
  }
  return input;
};

export default ComponentIdentifier;
