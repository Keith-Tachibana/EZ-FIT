import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Title from './Title';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(theme => ({
    root: {
        width: 'fit-width',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        '& svg': {
            margin: theme.spacing(2),
        },
        '& hr': {
            margin: theme.spacing(0, 0.5),
        },
    },
}));
export default function Workout() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Title>Workout</Title>
            <Grid container alignItems="center" className={classes.root}>
                <ListItem alignItems="flex-start">
                    <ListItemText alignItems="center" primary="Exercise 1" />
                    <Divider orientation="vertical" />
                    <ListItemText primary="Exercise 2" />
                    <Divider orientation="vertical" />
                    <ListItemText primary="Exercise 3" />
                    <Divider orientation="vertical" />
                    <ListItemText primary="Exercise 4" />
                </ListItem>
            </Grid>
        </React.Fragment>
    );
}
