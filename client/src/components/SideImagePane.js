import React, { useEffect, useState } from 'react';
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
import SideImage from './SideImage';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
}));

function SideImagePane() {
    const classes = useStyles();
    const [random, setRandom] = useState(0);

    useEffect(() => {
        setRandom(Math.floor(Math.random() * Math.floor(5)) + 1);
    }, [])

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Hidden only='xs'>
                <Grid item xs={false} sm={4} md={7}>
                    <SideImage imageNumber={random} />
                </Grid>
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

export default React.memo(SideImagePane);