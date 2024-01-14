import React from "react";

interface IFormElement {
    name: string,
    type: "text" | "autoComplete" | "multipleAutoComplete" | "radio" | "date"| "select" | "component" | "tag" 
    ref?: React.MutableRefObject<any>,
    additionals:Record<string,any>
}
export default IFormElement
