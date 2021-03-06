import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  CardHeader,
  Divider,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {},
  wrapper: {
    position: 'relative',
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {},
  buttonProgress: {
    color: 'primary',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function PasswordForm(){
   const classes = useStyles();

   const [buttonLoading, setButtonLoading] = useState(false);
   const [password, setPassword] = useState({
        password: '',
        confirmPassword: '',
   });
  const [status, setStatus] = useState(0);
  const [error, setError] = useState(0);
  const [values, setValues] = useState({
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const headers = {
    'x-access-token': localStorage.getItem("access-token"),
  };
  useEffect(() => {
    if (password.password === password.confirmPassword) {
      setError(null);
    } else {
      setStatus(0);
      setError("Passwords do not match");
    }
  }, [password]);

  const handlePasswordChange = e => {
    setPassword({
        ...password,
        [e.target.name]: e.target.value,
    });
  };

  const handleClickShowOldPassword = () => {
    setValues({
      ...values, 
      showOldPassword: !values.showOldPassword,
    });
  };

  const handleClickShowNewPassword = () => {
    setValues({
      ...values, 
      showNewPassword: !values.showNewPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values, 
      showConfirmPassword: !values.showConfirmPassword,
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const submitHandler = e => {
    e.preventDefault();
    setButtonLoading(true);

    const oldPasswordValue  = e.target.oldPassword.value;
    const passwordValue = e.target.password.value;
    const confirmPasswordValue = e.target.confirmPassword.value;

    if (passwordValue !== confirmPasswordValue) {
      setStatus(0);
      setError("Passwords do not match");
      setButtonLoading(false);
      return;
    }
    if(passwordValue === oldPasswordValue){
      setStatus(0);
      setError("New password can't match current password");
      setButtonLoading(false);
      return;
    }

    axios.post("/api/updatePassword", {
      oldPassword: oldPasswordValue,
      password: passwordValue,
    }, {headers}).then(res => {
      console.log(res);
      if (res.data.status === "error"){
        if (res.data.message === "jwt expired"){
          //pass
        }
        setStatus(0);
        setError(res.data.message);
      } else if (res.data.status === "success") {
        setError(0);
        setStatus(res.data.message);
      }
      setButtonLoading(false);
    }).catch(err =>{
      setStatus(0);
      setButtonLoading(false);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        setError(err.response.data.message);
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
    })
  };

  return (
    <Card className={classes.root}>
      <form
        className={classes.form}
        onSubmit={submitHandler}
        action="updatePassword"
        method="post"
        noValidate
      >
        <CardHeader title="Password" subheader="Update password" />
        <Divider />
        <CardContent>
        <Grid container spacing={2}>
        <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="oldPassword"
                label="Old Password"
                type={values.showOldPassword ? 'text' : 'password'}
                name="oldPassword"
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowOldPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>    
          </Grid>  
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type={values.showNewPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={values.showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          <span id="error" style={{ display: error ? "inline" : "none" }}>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <ErrorIcon color="error" />
              </Grid>
              <Grid item>
                <Typography
                  id="errorMessage"
                  variant="subtitle1"
                  color="error"
                  display="inline"
                >
                  {error}
                </Typography>
              </Grid>
            </Grid>
          </span>
          <span id="status" style={{display: status ? 'inline' : 'none' }}>
              <Grid container direction="row" alignItems="center">
                  <Grid item>
                      <CheckCircleIcon color="primary"/>
                  </Grid>
                  <Grid item>
                      <Typography id="statusMessage" variant="subtitle1" display="inline">
                          {status}
                      </Typography>
                  </Grid>
              </Grid>
          </span>
        </CardContent>
        <Divider />
        <CardActions>
          <div className={classes.wrapper}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={buttonLoading}
              className={classes.submit}
            >
              Update
            </Button>
            {buttonLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </CardActions>
      </form>
    </Card>
  );
}
