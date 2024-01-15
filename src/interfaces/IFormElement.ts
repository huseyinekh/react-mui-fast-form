import React from "react";
import ICommonAdditionals from "./IAdditional";

interface IFormElement {
    name: string,
    type: "text" | "autoComplete" | "multipleAutoComplete" | "radio" | "date"| "select" | "component" | "tag" 
    ref?: React.MutableRefObject<any>,
    additionals?:ICommonAdditionals,
    [key:string]:any
}
export default IFormElement
