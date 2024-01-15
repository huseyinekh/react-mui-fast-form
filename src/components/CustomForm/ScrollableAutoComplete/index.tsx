import{
  useState,
  useEffect,
  memo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MuiAutocomplete from "@mui/material/Autocomplete";
import { useDebounce } from "usehooks-ts";
import "./style.scss";
import AddProductItemsDialog from "./AddProductItemsDialog";
import { Tooltip } from "@mui/material";
import React from "react";
interface IProps {
  label: string;
  freeSolo?: boolean;
  options?: Array<any>;
  onChange?: (e, val) => any;
  onInputChange?: (e, val) => any;
  onBlur?: (e, val) => any;
  getDataFromApi: (data?: any) => Promise<any>;
  searchFromApi?: boolean;
  register?: any;
  width?: string;
  directList?: boolean;
  toggleDialog?: (dialogName: string) => void;
  attr?: {
    required?: string | boolean;
    error?: string | boolean;
    message?: string | null;
    disabled?: boolean;
  };
  alternatviteOption?: boolean;
  defaultParams?: any;
  alternatviteOptionComponent?: any;

  scrollable?: boolean;
  searchParamName?: string;
  optionLabel?: string;
}
const defaultEventTarget = { e: { target: { type: "text" } } };
const ScrollableAutoComplete = forwardRef((props: IProps, ref) => {
  const productDialogRef = useRef<any>();
  let [_objValue] = useState<any>();
  let isExternalSetted = false;
  const [page, setPage] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const [refreshData,setRefreshData]=useState(true)

  const defaultOption = {
    [props.optionLabel || "name"]: "Digər",
    dialogName: "_",
  };
  const [searchParams, setSearchParams] = useState({});
  const [options, setOptions] = useState<any[]>([]);
  const autocompleteRef = useRef<any>(null);
  const [value, setValue] = useState<any>({
    [props.optionLabel || "name"]: "",
    id: null,
  });
  const [objValue, setObjValue] = useState<any>({
    [props.optionLabel || "name"]: "",
    id: null,
  });
  const debounceSearchValues = useDebounce<any>(objValue, 300);
  const [error, setError] = useState({
    hasError: false,
    message: "Boş ola bilməz",
  });

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
    setDisabled: (disabled: boolean) => {
      setDisabled(disabled !== undefined ? disabled : true);
    },
    clear: () => {
      setValue({ [props.optionLabel || "name"]: "" });
      setObjValue({ [props.optionLabel || "name"]: "" });
      _objValue = { [props.optionLabel || "name"]: "" };
      setError((prev) => ({ ...prev, hasError: false }));
    },
    resetValue: () => {
      setValue({ [props.optionLabel || "name"]: "" });
      setObjValue({ [props.optionLabel || "name"]: "" });
      _objValue = { [props.optionLabel || "name"]: "" };
      setError((prev) => ({ ...prev, hasError: false }));
    },
    search: (params: object) => {
      setSearchParams(params);
      fetchDataSearch(1,10,"",params)
    },
    refresh:()=>{
      setOptions([])
      setRefreshData(!refreshData)
    }
  }));
  const fetchDataPagination = async (page: number, perPage: number) => {
    let response;
    if (props.directList) {
      response = await props.getDataFromApi({ ...(props.defaultParams || {}) });
      setOptions([...options, ...(response?.data && [...response?.data])]);
    } else {
      response = await props.getDataFromApi({
        page,
        perPage,
        ...(props.defaultParams || {}),
        ...searchParams,
      });
      setOptions([
        ...options,
        ...(response?.data?.list && [...response?.data?.list]),
      ]);
    }
    // var opt = props?.alternatviteOption ? [defaultOption] : [];
  };
  const fetchDataSearch = async (
    page: number,
    perPage: number,
    name?: number | string,
    params?:object
  ) => {
    const response = await props.getDataFromApi({
      page,
      perPage,
      [props.searchParamName || "name"]: name,
      ...(props.defaultParams || {}),
      ...(params||searchParams)
    });
    setOptions(response?.data?.list ? [...response?.data?.list] : []);
  };
  const loadMoreResults = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const response = await props.getDataFromApi({
      page: nextPage,
      perPage: 20,
      ...(props.defaultParams || {}),
    });
    setOptions([...options, ...response.data.list]);
  };
  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    if (listboxNode.scrollHeight - position <= 1) {
      loadMoreResults();
    }
  };
  const handleSearchApi = (e, val) => {
    autocompleteRef.current.blur();
    if (e?.e?.target?.type === "text") {
      fetchDataSearch(1, 10, val);
    }
  };

  useEffect(() => {
    props.attr.disabled && setDisabled(props.attr.disabled);
  }, [props.attr.disabled]);
  const addAlternateValue = (val) => {
    if (typeof val === "string" || typeof val === "number") {
      setOptions((prev) => {
        return [{ [props.optionLabel || "name"]: val }, ...prev];
      });
      setObjValue({ [props.optionLabel || "name"]: val });
      setObjValue({ ...objValue, [props.optionLabel || "name"]: val });
      _objValue = { [props.optionLabel || "name"]: val, ...objValue };
      setValue({ [props.optionLabel || "name"]: val });
    } else {
      setOptions((prev) => {
        return [val, ...prev];
      });
      setObjValue(val);
      setObjValue(val);
      _objValue = val;
      setValue(val);
    }
    props.onBlur && props.onBlur(null, _objValue);
  };
  useEffect(() => {
    const perPage = props.scrollable !== false ? 20 : 10000;
    fetchDataPagination(1, perPage);
  }, [refreshData]);

  useEffect(() => {
    if (
      objValue?.[props.optionLabel || "name"] &&
      props.searchFromApi !== false
    ) {
      handleSearchApi(
        defaultEventTarget,
        objValue?.[props.optionLabel || "name"]
      );
      if (objValue?.[props.optionLabel || "name"].length > 0) {
        setError((prev) => {
          return { ...prev, hasError: false };
        });
      }
    }
  }, [debounceSearchValues]);
  return (
    <>
      <MuiAutocomplete
        disabled={disabled}
        value={{
          [props.optionLabel || "name"]:
            value?.[props.optionLabel || "name"] ?? "",
          id: value?.id ?? "",
        }}
        blurOnSelect
        onBlur={(e) => {
          props.onBlur && props.onBlur(e, _objValue);
          if (!_objValue) {
            setValue({ [props.optionLabel || "name"]: "" });
            setObjValue({ [props.optionLabel || "name"]: "" });
            _objValue = { [props.optionLabel || "name"]: "" };
            setError((prev) => ({ ...prev, hasError: false }));
          }
        }}
        ref={autocompleteRef}
        sx={{ width: props.width || "100%" }}
        options={[
          ...(props?.alternatviteOption ? [defaultOption] : []),
          ...options,
        ]}
        autoHighlight
        noOptionsText="Boşdur"
        clearText="sil"
        openText={null}
        getOptionLabel={(option) => option?.[props.optionLabel || "name"]}
        renderOption={(optProps, option) => {
          return (
            <Box
              key={option?.[props.optionLabel || "name"]}
              component="li"
              sx={{ minHeight: "50px", borderBottom: "1px solid lightgray" }}
              {...optProps}
            >
              <Tooltip placement="right-start" title={<h2>{option?.name}</h2>}>
                {option?.[props.optionLabel || "name"]?.length > 55
                  ? option?.[props.optionLabel || "name"].slice(0, 55) + "..."
                  : option?.[props.optionLabel || "name"]}
              </Tooltip>
            </Box>
          );
        }}
        onChange={(e, val) => {
          console.log("====================================");
          console.log(val);
          console.log("====================================");
          if (!val?.dialogName) {
            setObjValue(val);
            _objValue = val;
            _objValue = { [props.optionLabel || "name"]: val, ..._objValue };
            setValue({
              [props.optionLabel || "name"]:
                val?.[props.optionLabel || "name"] ?? "",
              id: value?.id ?? "",
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
            case "clear":
              props.onBlur(e, { [props.optionLabel || "name"]: "" });
              break;
          }
          if (props.freeSolo) {
            switch (type) {
              case "reset":
                if (!isExternalSetted) {
                  setObjValue({
                    ...objValue,
                    [props.optionLabel || "name"]: val,
                  });
                  _objValue = {
                    [props.optionLabel || "name"]: val,
                    ...objValue,
                  };
                  setValue({ [props.optionLabel || "name"]: val });
                } else {
                  isExternalSetted = true;
                }
                break;
              case "input":
                if (val == "") {
                  handleSearchApi(defaultEventTarget, val);
                }
                if (!isExternalSetted) {
                  setObjValue({ [props.optionLabel || "name"]: val });
                  _objValue = { [props.optionLabel || "name"]: val };
                  setValue({ [props.optionLabel || "name"]: val });
                } else {
                  isExternalSetted = true;
                }
                break;
              case "clear":
                handleSearchApi(defaultEventTarget, val);
                await setObjValue({ [props.optionLabel || "name"]: "" });
                _objValue = { [props.optionLabel || "name"]: "" };
                setValue({ [props.optionLabel || "name"]: "" });
                setError((prev) => {
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
            variant="outlined"
            error={error.hasError}
            helperText={error.hasError && error.message}
            onInvalid={(e: any) => {
              if (props.attr.required) {
                e.preventDefault();
                // e.target.setCustomValidity("Boş ola bilməz");
                setError({ hasError: true, message: "boş ola bilməz!" });
              }
            }}
            className="required-message"
            {...(props.attr ? props.attr : {})}
            required={props?.attr?.required ? true : false}
            {...params}
            label={props.label}
            {...(props.register && props.register)}
          />
        )}
        ListboxProps={{
          onScroll: props.scrollable !== false && handleScroll,
          className: "myCustomList",
        }}
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
export default memo(ScrollableAutoComplete);
