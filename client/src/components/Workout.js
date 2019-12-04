import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Title from './Title';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
    const [anchorUpper, setAnchorUpper] = React.useState(null);
    const [anchorLower, setAnchorLower] = React.useState(null);
    const [anchorCardio, setAnchorCardio] = React.useState(null);

    const handleClickUpper = event => {
        setAnchorUpper(event.currentTarget);
    };

    const handleCloseUpper = () => {
        setAnchorUpper(null);
    };
    const handleClickLower = event => {
        setAnchorLower(event.currentTarget);
    };

    const handleCloseLower = () => {
        setAnchorUpper(null);
        setAnchorLower(null);
        setAnchorCardio(null);
    };
    const handleClickCardio = event => {
        setAnchorCardio(event.currentTarget);
    };

    const handleCloseCardio = () => {
        setAnchorUpper(null);
        setAnchorLower(null);
        setAnchorCardio(null);
    };

    const openUpper = Boolean(anchorUpper);
    const openLower = Boolean(anchorLower);
    const openCardio = Boolean(anchorCardio);
    const idUpper = openUpper ? 'simple-popover' : undefined;
    const idLower = openLower ? 'simple-popover' : undefined;
    const idCardio = openCardio ? 'simple-popover' : undefined;
    return (
        <React.Fragment>
            <Title>Your Workout</Title>
            <Grid
                container
                justify="space-evenly"
                alignItems="center"
                className={classes.root}
            >
                <Grid item xs>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                            >
                                Monday
                            </Typography>
                            <Typography className={classes.pos} color="error">
                                Strength Training (Upper Body)
                            </Typography>
                            <Typography
                                variant="body2"
                                component="p"
                            ></Typography>
                        </CardContent>
                        <CardActions>
                            {/* <Button onClick={handleClickUpper} size="small">
                                View Workout
                            </Button> */}
                            <Popover
                                id={idUpper}
                                open={openUpper}
                                anchorEl={anchorUpper}
                                onClose={handleCloseUpper}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Typography className={classes.typography}>
                                    10 mins of warm up
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Bench Press
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Dips
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Pulldown
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Shoulder press
                                </Typography>
                                <Typography className={classes.typography}>
                                    10reps X 2 sets: Triceps extension
                                </Typography>
                            </Popover>
                        </CardActions>
                    </Card>
                </Grid>
                <Divider orientation="vertical" />
                <Grid item xs>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                            >
                                Tuesday
                            </Typography>
                            <Typography
                                className={classes.pos}
                                color="textSecondary"
                            >
                                Strength Training (Lower Body)
                            </Typography>
                            <Typography
                                variant="body2"
                                component="p"
                            ></Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={handleClickLower} size="small">
                                View Workout
                            </Button>
                            <Popover
                                id={idLower}
                                open={openLower}
                                anchorEl={anchorLower}
                                onClose={handleCloseLower}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Typography className={classes.typography}>
                                    10 mins of warm up
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Crunches
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Leg raises
                                </Typography>
                                {/* <Typography className={classes.typography}>
                                    12reps X 3 sets: Deadlifts
                                </Typography> */}
                                <Typography className={classes.typography}>
                                    10reps X 2 sets: Back extension
                                </Typography>
                            </Popover>
                        </CardActions>
                    </Card>
                </Grid>
                <Divider orientation="vertical" />
                <Grid item xs>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                            >
                                Wednesday
                            </Typography>
                            <Typography
                                className={classes.pos}
                                color="textSecondary"
                            >
                                Rest
                            </Typography>
                            <Typography
                                variant="body2"
                                component="p"
                            ></Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Divider orientation="vertical" />
                <Grid item xs>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                            >
                                Thursday
                            </Typography>
                            <Typography className={classes.pos} color="error">
                                Strength Training(Upper Body)
                            </Typography>
                            <Typography
                                variant="body2"
                                component="p"
                            ></Typography>
                        </CardContent>
                        <CardActions>
                            {/* <Button onClick={handleClickUpper} size="small">
                                View Workout
                            </Button> */}
                            <Popover
                                id={idUpper}
                                open={openUpper}
                                anchorEl={anchorUpper}
                                onClose={handleCloseUpper}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Typography className={classes.typography}>
                                    10 mins of warm up
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Bench Press
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Dips
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Pulldown
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Shoulder press
                                </Typography>
                                <Typography className={classes.typography}>
                                    10reps X 2 sets: Triceps extension
                                </Typography>
                            </Popover>
                        </CardActions>
                    </Card>
                </Grid>
                <Divider orientation="vertical" />
                <Grid item xs>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                            >
                                Friday
                            </Typography>
                            <Typography
                                className={classes.pos}
                                color="textSecondary"
                            >
                                Strength Training (Lower Body)
                            </Typography>
                            <Typography
                                variant="body2"
                                component="p"
                            ></Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={handleClickLower} size="small">
                                View Workout
                            </Button>
                            <Popover
                                id={idLower}
                                open={openLower}
                                anchorEl={anchorLower}
                                onClose={handleCloseLower}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Typography className={classes.typography}>
                                    10 mins of warm up
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Crunches
                                </Typography>
                                <Typography className={classes.typography}>
                                    12reps X 3 sets: Leg raises
                                </Typography>
                                {/* <Typography className={classes.typography}>
                                    12reps X 3 sets: Deadlifts
                                </Typography> */}
                                <Typography className={classes.typography}>
                                    10reps X 2 sets: Back extension
                                </Typography>
                            </Popover>
                        </CardActions>
                    </Card>
                </Grid>
                <Divider orientation="vertical" />
                <Grid item xs>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                            >
                                Saturday
                            </Typography>
                            <Typography
                                className={classes.pos}
                                color="textSecondary"
                            >
                                Rest
                            </Typography>
                            <Typography
                                variant="body2"
                                component="p"
                            ></Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Divider orientation="vertical" />
                <Grid item xs>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography
                                className={classes.title}
                                color="textPrimary"
                                gutterBottom
                            >
                                Sunday
                            </Typography>
                            <Typography
                                className={classes.pos}
                                color="textSecondary"
                            >
                                Cardio
                            </Typography>
                            <Typography
                                variant="body2"
                                component="p"
                            ></Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={handleClickCardio} size="small">
                                View Workout
                            </Button>
                            <Popover
                                id={idCardio}
                                open={openCardio}
                                anchorEl={anchorCardio}
                                onClose={handleCloseCardio}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Typography className={classes.typography}>
                                    30 mins of running/active sport
                                </Typography>
                            </Popover>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
