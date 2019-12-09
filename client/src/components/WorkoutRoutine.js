import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Title from './Title';
import CircularProgress from '@material-ui/core/CircularProgress';
import Workout from './Workout';

const useStyles = makeStyles(theme => ({
    workout: {
        padding: theme.spacing(0.5),
    },
}));


export default function WorkoutRoutine(props) {
    const classes = useStyles();
    const [workoutRoutine] = useState(props.workoutRoutine);

    if (props.loading) {
        return (<CircularProgress style={{ alignSelf: 'center' }} />);
    }
    else {
        return (
            <React.Fragment>
                <span>
                    <Title>Your Workout</Title>
                </span>
                <Grid container>
                    {workoutRoutine.map((workout, index) => {
                        return (
                            <Grid item xs={12} md className={classes.workout} key={index}>
                                <Workout day={workout.day} name={workout.name} type={workout.type} exercises={workout.exercises} />
                            </Grid>
                        );
                    })}
                </Grid>
            </React.Fragment>
        );
    }

}
