import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import clsx from 'clsx';
import WorkoutDialog from './WorkoutDialog';

const useStyles = makeStyles({
    todayCard: {
        border: '2px solid gray',
    },
    lightWorkout: {
        color: 'orange',
    },
    restDay: {
        color: 'red',
    },
});

export default function Workout(props) {
    const classes = useStyles();
    const today = props.day === moment().format('dddd');
    const [showExerciseDialog, setShowExerciseDialog] = useState(false);
    const [shadow, setShadow] = useState(1);

    const onMouseOver = () => {
        if (props.name !== 'Rest day') {
            setShadow(shadow => {
                setShadow(shadow + 7);
            });
        }
    };

    const onMouseOut = () => {
        if (props.name !== 'Rest day') {
            setShadow(shadow => {
                setShadow(shadow - 7);
            });
        }
    };

    const handleClickOpen = () => {
        setShowExerciseDialog(true);
    };
    const handleClose = () => {
        setShowExerciseDialog(false);
    };

    useEffect(() => {
        if (today) {
            setShadow(8);
        } else {
            setShadow(1);
        }
    }, [today]);

    return (
        <Card
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            elevation={shadow}
            className={clsx(today && classes.todayCard)}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {props.day}
                </Typography>
                <Typography
                    variant="body2"
                    style={{ minHeight: 40 }}
                    className={clsx(
                        !props.type && classes.restDay,
                        props.type === 'light' && classes.lightWorkout
                    )}
                >
                    {props.name}
                    {props.type === 'light' ? '(Light)' : ''}
                </Typography>
            </CardContent>
            <CardActions
                style={{
                    visibility: props.name === 'Rest day' ? 'hidden' : '',
                }}
            >
                <Button size="small" onClick={handleClickOpen}>
                    View workout
                </Button>
            </CardActions>
            {props.exercises ? (
                <WorkoutDialog
                    open={showExerciseDialog}
                    handleClose={handleClose}
                    name={props.name}
                    exercises={props.exercises}
                />
            ) : null}
        </Card>
    );
}
