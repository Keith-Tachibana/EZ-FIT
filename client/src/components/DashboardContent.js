import React, {useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Steps from './Steps';
import Calories from './Calories';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    fixedHeightDouble: {
        height: 480,
    },
}));

export default function DashboardContent() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightDoublePaper = clsx(classes.paper, classes.fixedHeight)

    return (
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Calories */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Calories />
              </Paper>
            </Grid>
            {/* Calories Goal */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <p>Calories Goal</p>
              </Paper>
            </Grid>
            {/* Exercise */}
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <p>Exercise</p>
              </Paper>
            </Grid>
            {/* Heart Rate */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <p>Heart Rate</p>
              </Paper>
            </Grid>
            {/* Resting Heart Rate */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <p>Resting Heart Rate</p>
              </Paper>
            </Grid>
            {/* Steps */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                  <Steps />
              </Paper>
            </Grid>
            {/* Weight */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <p>Weight</p>
              </Paper>
            </Grid>
            {/* Weight goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <p>Weight goal</p>
              </Paper>
            </Grid>
            {/* BMI */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <p>BMI</p>
              </Paper>
            </Grid>
          </Grid>
        </Container>
    );
}