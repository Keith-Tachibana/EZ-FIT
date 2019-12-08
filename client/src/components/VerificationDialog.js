import React, { useEffect } from 'react';
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { green, red } from "@material-ui/core/colors";
import ErrorIcon from '@material-ui/icons/Error';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center"
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative"
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700]
    }
  },
  buttonFailure: {
    backgroundColor: red[700],
    "&:hover": {
      backgroundColor: red[900]
    }
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VerificationDialog(props) {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [failure, setFailure] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const resendButton = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonFailure]: failure,
  });

  const handleClose = () => {
    props.onCloseVerificationDialog();
  };

  async function resendVerificationEmail(userEmail) {
    try {
      const res = await axios.post('/resendverificationemail', {
        email: userEmail,
      });
      if (res.data.status === 'success') {
        setFailure(false);
        setSuccess(true);
        setLoading(false);
      } else {
        setSuccess(false);
        setFailure(true);
        setLoading(false);
        setMessage(res.data.message);
      }

    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
      }
      console.log(err.config);
      setSuccess(false);
      setFailure(true);
      setLoading(false);
      setMessage(err.message);
    }
  }

  const handleResendVerificationEmail = () => {
    setLoading(true);
    resendVerificationEmail(props.email);
  };

  return (
    <Dialog
      open={props.showVerificationDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {"Connect Fitbit account"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Your account is unverified.  Please check your email to verify your account.  Click the button below to resend the verification email.
                </DialogContentText>
        <DialogContentText id="alert-message" color='secondary' style={{ display: failure ? 'inline' : 'none' }}>
          <ErrorIcon />
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={handleClose} >
          Cancel
                </Button>
        <Button
          autoFocus
          variant='contained'
          color='primary'
          className={resendButton}
          disabled={loading}
          onClick={handleResendVerificationEmail}
        >
          Resend Verification Email
                </Button>
      </DialogActions>
    </Dialog>
  );
}