import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import clsx from 'clsx';
import WorkoutDialog from './WorkoutDialog';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles({
    todayCard: {
        border: '2px solid gray',
    },
});

export default function Workout(props) {
    const classes = useStyles();
    const today = props.day === moment().format('dddd');
    const [showExerciseDialog, setShowExerciseDialog] = useState(false);

    const handleClickOpen = () => {
        setShowExerciseDialog(true);
    };
    const handleClose = () => {
        setShowExerciseDialog(false);
    };

    return (
        <Tooltip title={props.type}>
            <Card
                raised={today}
                className={clsx(today && classes.todayCard)}
            >
                <CardContent>
                    <Typography variant='h6' gutterBottom>
                        {props.day}
                    </Typography>
                    <Typography variant="body2" color={props.name === 'Rest' ? 'secondary' : 'inherit'} style={{ minHeight: 40 }}>
                        {props.name}
                    </Typography>
                </CardContent>
                <CardActions style={{ visibility: props.name === 'Rest' ? 'hidden' : '' }}>
                    <Button size="small" onClick={handleClickOpen}>View workout</Button>
                </CardActions>
                {props.exercises ?
                    <WorkoutDialog
                        open={showExerciseDialog}
                        handleClose={handleClose}
                        name={props.name}
                        exercises={props.exercises}
                    /> :
                    null}
            </Card >
        </Tooltip>
    );
}