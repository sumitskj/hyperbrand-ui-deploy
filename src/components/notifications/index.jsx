import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Snackbar, Alert as MuiAlert, Slide } from "@mui/material";

import { closeNotification } from "./slice/notification";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

const Notification = () => {
  const dispatch = useDispatch();
  const notif = useSelector((state) => state.notif);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(closeNotification());
  };

  return (
    <Snackbar
      open={notif.open}
      autoHideDuration={6000}
      onClose={handleClose}
      key={notif.key}
      TransitionComponent={TransitionLeft}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={notif.severity}
        sx={{ width: "100%" }}
      >
        {notif.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
