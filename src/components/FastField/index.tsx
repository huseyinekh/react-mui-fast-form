import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { TextField } from "@mui/material"


interface IProps {
    label: string
}
const FastField = forwardRef((props: IProps, ref?: any) => {
    const [val, setVal] = useState<string>("ELAS")
    useImperativeHandle(ref, () => ({
        getValue: () => val,
        setValue: (val: string) => setVal(val)
    }))
    return (
        <TextField label={props.label} value={val} onChange={(e: any) => setVal(e.target.value)} />
    )
}
)
export default FastField