import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgetPasswordForm from './ForgetPasswordForm';
import Verify from './Verify';
import TOS from './TOS';
import Policy from './Policy';
import { Hidden } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(model${Math.floor(Math.random() * Math.floor(5)) +
            1}.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        // backgroundPosition: 'center',
        width: '100%',
    },
}));

export default function SideImagePane() {
    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Hidden only='xs'>
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
            </Hidden>
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <Switch>
                    <Route path="/signin" component={SignIn} />
                    <Route path="/register" component={SignUp} />
                    <Route path="/verify" component={Verify} />
                    <Route
                        path="/forgetpassword"
                        component={ForgetPasswordForm}
                    />
                    <Route path="/tos" component={TOS} />
                    <Route path="/policy" component={Policy} />
                </Switch>
            </Grid>
        </Grid>
    );
}
