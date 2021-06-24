import MuiAlert, {AlertProps} from "@material-ui/lab/Alert";
import React from "react";
import {Snackbar} from "@material-ui/core";

interface InfoSnackbarProps extends AlertProps {
    message: string | ''
}


export default function InfoSnackbar(props: InfoSnackbarProps) {
    return (<Snackbar open={props.message.length !== 0} autoHideDuration={6000} onClose={props.onClose}>
        <Alert onClose={props.onClose} severity="error">
            {props.message}
        </Alert>
    </Snackbar>)
}


function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
