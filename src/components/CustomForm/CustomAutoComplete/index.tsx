import {
  useState,
  useEffect,
  memo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MuiAutocomplete from '@mui/material/Autocomplete';
import AddProductItemsDialog from '../ScrollableAutoComplete/AddProductItemsDialog';

let isExternalSetted = false;
let _objValue: any;
interface IProps {
  label: string;
  freeSolo?: boolean;
  options?: Array<any>;
  onChange?: (e, val) => any;
  onInputChange?: (e, val) => any;
  onBlur?: (e, val) => any;
  getDataFromApi: (data: any) => Promise<any>;
  register?: any;
  width?: string;
  attr?: {
    required?: string | boolean;
    error?: string | boolean;
    message?: string | null;
  };
  variant?: string;
  disabled?: boolean;
  dataPath?: string;
  apiRequestOnyWithParams?: boolean;
  alternatviteOption?: boolean;
  alternatviteOptionComponent?: any;
  optionLabel?: string;
}

const CustomAutoComplete = forwardRef((props: IProps, ref) => {
  const [options, setOptions] = useState([]);
  const [apiParams, setApiParams] = useState(undefined);
  const autocompleteRef = useRef<any>(null);
  const [value, setValue] = useState<any>({ name: '', id: null });
  const [objValue, setObjValue] = useState<any>({ name: '', id: null });
  const productDialogRef = useRef<any>();
  const [inputError, setInputError] = useState({
    hasError: false,
    message: 'boş ola bilməz',
  });
  const defaultOption = {
    [props.optionLabel || 'name']: 'Digər',
    dialogName: '_',
  };

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return objValue;
    },
    setValue: (product) => {
      isExternalSetted = true;
      if (product) {
        setObjValue(product);
        _objValue = product;
        setValue(product);
      }
    },
    resetValue: () => {
      setValue({ name: '' });
      setObjValue({ name: '' });
      _objValue = { name: '' };
    },
    required: props.attr.required,
    setApiParams: (params: any) => {
      setApiParams(params);
    },
    setError: (message?: string) => {
      setInputError({ hasError: true, message: message || inputError.message });
    },
  }));
  const fetchData = async (val?) => {
    let response;
    if (val) {
      response = await props.getDataFromApi(apiParams || {});
    } else {
      response = await props.getDataFromApi(
        apiParams ? { ...apiParams, name: val } || { name: val } : {},
      );
    }
    const updatedResponse =
      (props.dataPath ? response.data[props.dataPath] : response.data) || [];

    setOptions([...options, ...(updatedResponse && [...updatedResponse])]);
  };

  const addAlternateValue = (val) => {
    if (typeof val === 'string' || typeof val === 'number') {
      setOptions((prev) => {
        return [{ [props.optionLabel || 'name']: val }, ...prev];
      });
      setObjValue({ [props.optionLabel || 'name']: val });
      setObjValue({ ...objValue, [props.optionLabel || 'name']: val });
      _objValue = { [props.optionLabel || 'name']: val, ...objValue };
      setValue({ [props.optionLabel || 'name']: val });
    } else {
      setOptions((prev) => {
        return [val, ...prev];
      });
      setObjValue(val);
      setObjValue(val);
      _objValue = val;
      setValue(val);
    }
    props?.onBlur?.(null, _objValue);
  };

  useEffect(() => {});
  useEffect(() => {
    if (props.apiRequestOnyWithParams == true && apiParams !== undefined) {
      fetchData();
    } else if (!props.apiRequestOnyWithParams && !apiParams) {
      fetchData();
    }
  }, [apiParams]);
  useEffect(() => {
    if (objValue?.name) {
      if (objValue.name.length > 0) {
        setInputError((prev) => {
          return { ...prev, hasError: false };
        });
      }
    }
  }, [objValue]);
  return (
    <>
      <MuiAutocomplete
        value={{ name: value.name, id: value.id }}
        blurOnSelect
        onBlur={(e) => {
           props?.onBlur?.(e, _objValue);
        }}
        ref={autocompleteRef}
        options={[
          ...(props?.alternatviteOption ? [defaultOption] : []),
          ...options,
        ]}
        // freeSolo={props.freeSolo}
        autoHighlight
        getOptionLabel={(option) => option.name}
        noOptionsText="Boşdur"
        renderOption={(props, option) => {
          return (
            <Box
              component='li'
              sx={{ minHeight: '40px', borderBottom: '1px solid lightgray' }}
              {...props}
            >
              {option?.name}
            </Box>
          );
        }}
        onChange={(e, val) => {
          if (!val?.dialogName) {
            setObjValue(val);
            _objValue = val;
            _objValue = { [props.optionLabel || 'name']: val, ..._objValue };
            setValue({
              [props.optionLabel || 'name']:
                val?.[props.optionLabel || 'name'] ?? '',
              id: value?.id ?? '',
            });
            props.onChange && props.onChange(e, val);
          } else {
            if (val?.dialogName) {
              productDialogRef.current?.toggleDialog(true);
            }
          }
        }}
        onInputChange={async (e, val, type) => {
          switch (type) {
            case 'clear':
              props?.onBlur?.(e, { [props.optionLabel || 'name']: '' });
              break;
          }
          if (props.freeSolo) {
            switch (type) {
              case 'reset':
                if (!isExternalSetted) {
                  setObjValue({
                    ...objValue,
                    [props.optionLabel || 'name']: val,
                  });
                  _objValue = {
                    [props.optionLabel || 'name']: val,
                    ...objValue,
                  };
                  setValue({ [props.optionLabel || 'name']: val });
                } else {
                  isExternalSetted = true;
                }
                break;
              case 'input':
                if (val == '') {
                  fetchData(val);
                }
                if (!isExternalSetted) {
                  setObjValue({ [props.optionLabel || 'name']: val });
                  _objValue = { [props.optionLabel || 'name']: val };
                  setValue({ [props.optionLabel || 'name']: val });
                } else {
                  isExternalSetted = true;
                }
                break;
              case 'clear':
                fetchData(val);
                await setObjValue({ [props.optionLabel || 'name']: '' });
                _objValue = { [props.optionLabel || 'name']: '' };
                setValue({ [props.optionLabel || 'name']: '' });
                setInputError((prev) => {
                  return { ...prev, hasError: false };
                });
                break;
              default:
                break;
            }
          }
          if (props.onInputChange) {
            props.onInputChange(e, _objValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            variant={props.variant || 'outlined'}
            error={inputError.hasError}
            helperText={inputError.hasError && inputError.message}
            onInvalid={(e: any) => {
              e.preventDefault();
              // e.target.setCustomValidity("Boş ola bilməz");
              setInputError({ hasError: true, message: 'Boş ola bilməz' });
            }}
            className='required-message'
            {...props.attr}
            required={props?.attr?.required ? true : false}
            {...params}
            label={props.label}
            {...(props.register && props.register)}
          />
        )}
        disabled={props.disabled}
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
export default memo(CustomAutoComplete);
