type ValidationResult = {
  isValid: boolean;
  invalidFields: string[];
  values: any;
};

export const validateForm = (formFields: any[]): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    invalidFields: [],
    values: {},
  };

  for (const field of formFields) {
    let value = field.ref.current?.getValue();
    if (field?.additionals?.onGetValue) {
      value = field?.additionals?.onGetValue(value);
    }
    if (!field.exclude) {
      result.values[field.name] = value;
      if (
        field?.required &&
        (value === null || value === 0 || value === '' || value === undefined || value?.name === '' || value?.length === 0)
      ) {
        result.isValid = false;
        result.invalidFields.push(field.name);

        if (field.ref.current?.setError) {
          field.ref.current.setError();
        }
      }
    }
  }

  return result;
};

export const getValues = (formFields: any[]): Record<string, any> => {
  const result: ValidationResult = {
    isValid: true,
    invalidFields: [],
    values: {},
  };

  for (const field of formFields) {
    let value = field.ref.current?.getValue();
    if (field?.additionals?.onGetValue) {
      value = field?.additionals?.onGetValue(value);
    }
    if (!field.exclude) {
      result.values[field.name] = value;
    }
  }

  return result.values;
};
export const resetForm = (formFields: any[]) => {
  for (const field of formFields) {
    const { ref } = field;
    ref.current?.resetValue && ref.current?.resetValue();
  }
};

export const getRefByName = (name: string, formFields: any[]) => {
  return formFields.find((f) => f.name === name)?.ref?.current;
};

export const setValue = (name: string, val: any, formFields: any[]) => {
  const timeoutId = setTimeout(() => {
    const field = formFields.find((f) => f.name === name)?.ref?.current;
    field?.setValue?.(val);
    clearTimeout(timeoutId);
  }, 100);
  // Clear the timeout after setting the value
};
export const getValue = (name: string, formFields: any[]) => {
    const field = formFields.find((f) => f.name === name)?.ref?.current;
   return field?.getValue?.();
  // Clear the timeout after setting the value
};

export const uploadAsync = async (name: string, formFields: any[]) => {
  const field = formFields.find((f) => f.name === name)?.ref?.current;
  return await field.uploadAsync();
};

export function removeElementsStartingFromIndex<T>(originalArray: T[], startIndex: number, count: number): T[] {
  // Ensure startIndex is within the bounds of the original array
  if (startIndex >= 0 && startIndex < originalArray.length) {
    return [...originalArray.slice(0, startIndex), ...originalArray.slice(startIndex + count)];
  } else {
    // Handle the case where startIndex is out of bounds
    console.error('Error: Index out of bounds');
    return originalArray;
  }
}

export function appendArrayAfterNthElement<T>(originalArray: T[], arrayToAppend: T[], n: number): T[] {
  // Ensure n is within the bounds of the original array
  if (n >= 0 && n <= originalArray.length) {
    return [...originalArray.slice(0, n), ...arrayToAppend, ...originalArray.slice(n)];
  } else {
    // Handle the case where n is out of bounds
    console.error('Error: Index out of bounds');
    return originalArray;
  }
}

// export const getValues = (formFields: any[],returnAsArray?:boolean): Record<string, any> => {
//   const valuesArray: any = [];
//   console.log('====================================');

//   console.log(formFields[0].ref.current.getValue());
//   console.log('====================================');
//   if(returnAsArray){
//     let obj:any={}
//     for (let i = 0; i < formFields.length; i++) {
//       let field = formFields[i];
//       if (field.type === "text" || field.type === "date") {
//         const value = field.ref.current ? field.ref.current.getValue() : undefined;
//         // console.log('====================================');
//         // console.log(field.ref.current.getValue());
//         // console.log('====================================');
//         obj[field.name] = value;
//         if((i+1)%3===0){
//           valuesArray.push(obj)
//         }
//       }
//     }
//     return  valuesArray
//   }
//   const values: any = {};

//   for (const field of formFields) {
//     if (field.type === "text"||field.type === "date") {
//       const value = field.ref.current?.getValue();
//       values[field.name] = value;
//     }
//   }

//   return values;
// };
