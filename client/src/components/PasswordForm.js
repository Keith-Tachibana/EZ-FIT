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
  Grid
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {},
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {}
}));

export default function PasswordForm(){
   const classes = useStyles();

   const [password, setPassword] = useState({
        password: '',
        confirmPassword: '',
   });
  const [status, setStatus] = useState(0);
  const [error, setError] = useState(0);

  const handlePasswordChange = e => {
    setPassword({
        ...password,
        [e.target.name]: e.target.value,
    });
  };

  const headers = {
    'x-access-token': sessionStorage.getItem("access-token"),
  };
  useEffect(() => {
    if (password.password === password.confirmPassword) {
      setError(null);
    } else {
      setError("Passwords do not match");
    }
  }, [password]);

  const submitHandler = e => {
    e.preventDefault();
    const oldPasswordValue  = e.target.oldPassword.value;

    const passwordValue = e.target.password.value;
    const confirmPasswordValue = e.target.confirmPassword.value;
    if (passwordValue !== confirmPasswordValue) {
      setError("Passwords do not match");
      return;
    }
    if(passwordValue === oldPasswordValue){
      setError("New password cannot be the same as the current password");
      return;
    }
    const accessToken = sessionStorage.getItem("access-token")
    axios.post("/user/updatePassword", {
      oldPassword: oldPasswordValue,
      password: passwordValue,
    }, {headers}).then(res => {
      console.log(res);
      if (res.data.status !== "error"){
        setError(res.data.message);
        // setStatus(res.data.message);
      } else if (res.data.status === "success") {
        setError(res.data.message);
      }
    }).catch(err =>{
      setError(err.response.data.message);
      console.log(err.response);
    })
    };

  return (
    <Container maxWidth="sm">
      <Card className={classes.root}>
        <form
          className={classes.form}
          onSubmit={submitHandler}
          action="updatePassword"
          method="post"
          noValidate
        >
          <CardHeader title="Update Password" />
          <Divider />
          <CardContent>
          <CardHeader subheader="Enter your old password" />
          <Grid container spacing = {2}>
          <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="oldPassword"
                  label="Old Password"
                  type="password"
                  name="oldPassword"
                  autoFocus
                />
              </Grid>    
            </Grid>  
          <CardHeader subheader="Enter the new password" />
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  onChange={handlePasswordChange}
                />
              </Grid>
          <CardHeader subheader="Reenter the new password" />
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={handlePasswordChange}
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
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.submit}
            >
              Update
            </Button>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
}
