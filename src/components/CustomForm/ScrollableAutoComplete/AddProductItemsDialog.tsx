import * as React from "react";
import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../../CustomForm/CustomTextField";
import { Box, Typography } from "@mui/material";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
interface IPorps {
  whenClose?: (answer: boolean, value?: string | number) => void;
  title: string;
}
const AddProductItemsDialog = forwardRef((props: IPorps, ref) => {
  const textRef = useRef<any>();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    props.whenClose && props.whenClose(false);
  };
  const handleConfirm = () => {
    setOpen(false);
    props.whenClose && props.whenClose(true, textRef.current.getValue());
  };
  useImperativeHandle(ref, () => ({
    toggleDialog: (toggle: boolean) => {
      setOpen(toggle);
    },
  }));

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        style={{ display: "fex" }}
      >
        <Box
          pb={1}
          sx={{ bgcolor: (theme) => theme.palette.primary.main }}
          display={"fex"}
          justifyContent={"space-between"}
        >
          <Typography sx={{paddingTop:1.4,paddingLeft:2}} fontWeight={"bold"} color={"white"}>{props.title}</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers>
          <Box px={3} py={1.6}>
            <CustomTextField   placeholder="Daxil edin"  label="" ref={textRef} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            autoFocus
            onClick={handleClose}
          >
            Bağla
          </Button>
          <Button
            variant="contained"
            autoFocus
            onClick={handleConfirm}
          >
            Əlavə et
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
});

export default AddProductItemsDialog;
