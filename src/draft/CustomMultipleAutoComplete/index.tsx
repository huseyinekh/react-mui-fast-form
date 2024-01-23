import * as React from 'react';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { isSuccessStatusCode } from '@source/helpers/statusCheck';
import AddProductItemsDialog from '../ScrollableAutoComplete/AddProductItemsDialog';

const defaultError = { hasError: false, message: 'Boş buraxıla bilməz' };
const defaultLabelName = 'name';

interface IProps {
  optionLabel?: string;
  required?: boolean;
  options?: any;
  label?: string;
  style?: React.CSSProperties;
  alternatviteOption?: boolean;
  alternatviteOptionComponent?: any;
  getDataFromApi?: any;
  excludeOption?: (opt: any) => boolean;
  dataPath?: string;
}
const CustomMultipleAutoComplete = React.forwardRef((props: IProps, ref) => {
  const [value, setValue] = React.useState([]);
  const [inputError, setInputError] = React.useState(defaultError);
  const [disabled, setDisabled] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const productDialogRef = React.useRef<any>();

  const defaultOption = {
    [props.optionLabel || 'name']: 'Digər',
    dialogName: '_',
  };

  const addAlternateValue = (val) => {
    if (typeof val === 'string' || typeof val === 'number') {
      const newOpt = { [props.optionLabel || 'name']: val };
      setOptions((prev) => {
        return [newOpt, ...prev];
      });
      setValue((prev) => [...prev, newOpt]);
    } else if (val?.length) {
      setOptions((prev) => {
        return [...val, ...prev];
      });
      setValue((prev) => [...prev, ...val]);
    } else {
      setOptions((prev) => {
        setValue((prev) => [...prev, val]);
        return [val, ...prev];
      });
    }
  };

  React.useEffect(() => {
    if (value) {
      setInputError((prev) => ({ ...prev, hasError: false }));
    }
  }, [value]);
  React.useImperativeHandle(ref, () => ({
    required: props.required,
    getValue: () => value,
    setValue: (valueObj: any) => setValue(valueObj),
    resetValue: () => {
      setValue([]);
      setInputError(defaultError);
    },
    setError: (message?: string) => {
      setInputError({ hasError: true, message: message || inputError.message });
    },
    setOptions: (options: any) => {},
    setDisabled: (disable: boolean) => {
      setDisabled(disable);
    },
  }));

  const handleFetch = async () => {
    const res = await props.getDataFromApi();
    if (res && isSuccessStatusCode(res.status)) {
      const updatedResponse = (props.dataPath ? res.data[props.dataPath] : res.data) || [];
      setOptions(updatedResponse);
    }
  };
  React.useEffect(() => {
    if (props.getDataFromApi) {
      handleFetch();
    }
  }, [props?.getDataFromApi]);

  const mergedStyle = {
    ...props.style,
  };
  let combinedOptions = [...(props?.alternatviteOption ? [defaultOption] : []), ...(options || [])];
  if (props.excludeOption) combinedOptions = combinedOptions.filter((x) => props.excludeOption(x));

  return (
    <>
      <Autocomplete
        disabled={disabled}
        multiple
        value={value}
        onChange={(event, newValue) => {
          if (newValue.filter((v) => v.dialogName !== undefined).length) {
            productDialogRef.current.toggleDialog(true);
          } else setValue([...newValue]);
        }}
        options={combinedOptions}
        getOptionLabel={(option) => `${option[props.optionLabel || defaultLabelName]} ${option?.surname || ''}`}
        onInvalid={(e) => {
          e.preventDefault();
          setInputError((prev) => ({ ...prev, hasError: true }));
        }}
        noOptionsText='Boşdur'
        openText='Seç'
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip label={`${option[props.optionLabel || defaultLabelName]} ${option?.surname || ''}`} {...getTagProps({ index })} />
          ))
        }
        style={mergedStyle}
        renderInput={(params) => (
          <TextField
            variant='outlined'
            required={value.length === 0 && props.required}
            helperText={inputError.hasError && inputError.message}
            error={inputError.hasError}
            {...params}
            label={props.label || 'İcraçılar'}
            // placeholder="Axtar..."
          />
        )}
      />
      {props.alternatviteOptionComponent ? (
        <props.alternatviteOptionComponent
          title={props.label}
          whenClose={(answer, valueObj?) => {
            if (answer && valueObj) addAlternateValue(valueObj);
          }}
          ref={productDialogRef}
        />
      ) : (
        <AddProductItemsDialog
          title={props.label}
          whenClose={(answer, textVal?) => {
            if (answer && textVal) addAlternateValue(textVal);
          }}
          ref={productDialogRef}
        />
      )}
    </>
  );
});

export default CustomMultipleAutoComplete;
