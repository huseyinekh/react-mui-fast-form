import React, { useImperativeHandle, useState } from 'react'
import { TextField } from "@mui/material"

interface IProps {

}

const FastField = (_props: IProps, ref) => {
    const [state, setState] = useState("")
    useImperativeHandle(ref, () => ({
        getValue: () => state,
        setValue: (val: string) => setState(val)
    }))
    return (
        <TextField value={state} onChange={(e) => setState(e.target.value)} />
    )
}

export default FastField