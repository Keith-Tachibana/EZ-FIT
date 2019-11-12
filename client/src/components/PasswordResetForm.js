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
  Container,
  Grid,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

const Link1 = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const useStyles = makeStyles(theme => ({
  root: {},
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {}
}));

export default function PasswordResetForm(props){
   const classes = useStyles();

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
  const query = new URLSearchParams(props.location.search);

  useEffect(() => {
    if (password.password === password.confirmPassword) {
      setError(null);
    } else {
      setStatus(null);
      setError("Passwords do not match");
    }
  }, [password]);

  const handlePasswordChange = e => {
    setPassword({
        ...password,
        [e.target.name]: e.target.value,
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
    let passwordValue = password.password;
    if (passwordValue !== password.confirmPassword) {
      setStatus(0);
      setError("Passwords do not match");
      return;
    }

    axios.post("/resetpassword", {
      password: passwordValue,
    }, { params: {
      id: query.get('id'),
      token: query.get('token'),
    },}).then(res => {
      if (res.data.status === "error"){
        setStatus(0);
        setError(res.data.message);
      } else if (res.data.status === "success") {
        setError(0);
        setStatus(res.data.message);
      }
    }).catch(err =>{
      setError(err.response.data.errors[0].msg);
    })
    };

  return (
    <Container maxWidth="sm">
      <Card className={classes.root}>
        <form
          className={classes.form}
          onSubmit={submitHandler}
          action="resetPassword"
          method="post"
          noValidate
        >
          <CardHeader title="Password" subheader="Reset password" />
          <Divider />
          <CardContent>
          <Grid container spacing = {2}>
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
                <Grid container>
                  <Link component={Link1} to="/signin" variant="subtitle1">
                      Click here to return to sign in page.
                  </Link>
                </Grid>
            </span>
          </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.submit}
            >
              Reset
            </Button>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
}
