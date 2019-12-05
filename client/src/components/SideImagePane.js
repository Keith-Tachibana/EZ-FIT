import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgetPasswordForm from './ForgetPasswordForm';
import bg from '../../src/signsidebg.jpg';
import Verify from './Verify';
import TOS from "./TOS"
import Policy from "./Policy"

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SideImagePane() {
    const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Switch>
          <Route path='/signin' component={SignIn}/>
          <Route path='/register' component={SignUp}/>
          <Route path='/verify' component={Verify}/>
          <Route path='/forgetpassword' component={ForgetPasswordForm}/>
          <Route path='/tos' component={TOS}/>
          <Route path='/policy' component={Policy}/>
        </Switch>
      </Grid>
    </Grid>
  );
}
