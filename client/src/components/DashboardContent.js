import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import StepsGoal from './StepsGoal';
import DistanceGoal from './DistanceGoal';
import FloorsGoal from './FloorsGoal';
import ActiveMinutesGoal from './ActiveMinutesGoal';
import Calories from './Calories';
import CaloriesGoal from './CaloriesGoal';
import HeartRateZones from './HeartRateZones';
import RestingHeartRate from './RestingHeartRate';
import Weight from './Weight';
import WeightGoal from './WeightGoal';
import BMI from './BMI';
import { Typography, Hidden, Button } from '@material-ui/core';
import SyncButton from './SyncButton';
// import ConnectDialog from './ConnectDialog';
import Joyride from 'react-joyride';
import { useHistory } from "react-router-dom";
import WorkoutRoutine from './WorkoutRoutine';

function toLocaleStringSupportsLocales() {
    try {
        new Date().toLocaleString('i');
    } catch (e) {
        return e instanceof RangeError;
    }
    return false;
}

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
        justifyContent: 'center',
    },
    syncPaper: {
        padding: '0 8px 0 16px',
        display: 'flex',
        overflow: 'auto',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    fixedHeight: {
        height: 240,
    },
    title: {
        flexGrow: 1,
    },
    blur: {
        filter: 'blur(5px)',
        'pointer-events': 'none',
    },
    minHeight: {
        minHeight: 240,
    },
}));

export default function DashboardContent(props) {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const minHeightPaper = clsx(classes.paper, classes.minHeight);
    const history = useHistory();
    const dataColor = '#BB86FC';

    const [connectionStatus, setConnectionStatus] = useState(true);
    const [completed, setCompleted] = useState(0);
    const [syncError, setSyncError] = useState(false);
    const [syncMessage, setSyncMessage] = useState('Retrieving data');
    const [loading, setLoading] = useState({
        steps: true,
        distance: true,
        floors: true,
        activeMinutes: true,
        caloriesBurnedData: true,
        calories: true,
        heartRateData: true,
        weightData: true,
        weight: true,
        currentBMI: true,
        workoutRoutine: true,
    });

    const [steps, setSteps] = useState({
        current: 0,
        goal: 10000,
    });
    const [distance, setDistance] = useState({
        current: 0,
        goal: 5,
    });
    const [floors, setFloors] = useState({
        current: 0,
        goal: 10,
    });
    const [activeMinutes, setActiveMinutes] = useState({
        current: 0,
        goal: 30,
    });
    const [caloriesBurnedData, setCaloriesBurnedData] = useState([
        { dateTime: '', value: 0 },
    ]);
    const [calories, setCalories] = useState({
        current: 0,
        goal: 5000,
    });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [workoutRoutine, setWorkoutRoutine] = useState([
        {
            day: days[0],
            name: `Strength Training (Upper Body)`,
            type: `light`,
            exercises: [
                {
                    "exercise": {
                        "name": "Warm Up",
                        "duration": "10 minutes",
                        "url": "https://greatist.com/fitness/full-body-dynamic-warm-up#The-benefits-of-dynamic-stretching"
                    }
                },
                {
                    "exercise": {
                        "name": "Bench Press",
                        "duration": "12 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Bench_press"
                    }
                },
                {
                    "exercise": {
                        "name": "Dips",
                        "duration": "12 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Dip_(exercise)"
                    }
                },
                {
                    "exercise": {
                        "name": "Pulldown",
                        "duration": "12 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Pulldown_exercise"
                    }
                },
                {
                    "exercise": {
                        "name": "Overhead Press",
                        "duration": "12 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Overhead_press"
                    }
                },
                {
                    "exercise": {
                        "name": "Triceps extension",
                        "duration": "10 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Lying_triceps_extensions"
                    }
                }
            ],
        },
        {
            day: days[1],
            name: `Strength Training (Lower Body)`,
            type: `normal`,
            exercises: [
                {
                    "exercise": {
                        "name": "Warm Up",
                        "duration": "10 minutes",
                        "url": "https://greatist.com/fitness/full-body-dynamic-warm-up#The-benefits-of-dynamic-stretching"
                    }
                },
                {
                    "exercise": {
                        "name": "Leg raise",
                        "duration": "6 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Leg_raise"
                    }
                },
                {
                    "exercise": {
                        "name": "Leg raises",
                        "duration": "6 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Leg_raise"
                    }
                },
                {
                    "exercise": {
                        "name": "Lunge",
                        "duration": "6 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Lunge_(exercise)"
                    }
                },
                {
                    "exercise": {
                        "name": "Leg extension",
                        "duration": "6 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Leg_extension"
                    }
                }
            ],
        },
        {
            day: days[2],
            name: `Rest`,
            type: null,
            exercises: [],
        },
        {
            day: days[3],
            name: `Strength Training (Upper Body)`,
            type: `light`,
            exercises: [
                {
                    "exercise": {
                        "name": "Warm Up",
                        "duration": "10 minutes",
                        "url": "https://greatist.com/fitness/full-body-dynamic-warm-up#The-benefits-of-dynamic-stretching"
                    }
                },
                {
                    "exercise": {
                        "name": "Bench Press",
                        "duration": "12 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Bench_press"
                    }
                },
                {
                    "exercise": {
                        "name": "Dips",
                        "duration": "12 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Dip_(exercise)"
                    }
                },
                {
                    "exercise": {
                        "name": "Pulldown",
                        "duration": "12 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Pulldown_exercise"
                    }
                },
                {
                    "exercise": {
                        "name": "Overhead Press",
                        "duration": "12 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Overhead_press"
                    }
                },
                {
                    "exercise": {
                        "name": "Triceps extension",
                        "duration": "10 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Lying_triceps_extensions"
                    }
                }
            ],
        },
        {
            day: days[4],
            name: `Strength Training (Lower Body)`,
            type: `normal`,
            exercises: [
                {
                    "exercise": {
                        "name": "Warm Up",
                        "duration": "10 minutes",
                        "url": "https://greatist.com/fitness/full-body-dynamic-warm-up#The-benefits-of-dynamic-stretching"
                    }
                },
                {
                    "exercise": {
                        "name": "Leg raise",
                        "duration": "6 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Leg_raise"
                    }
                },
                {
                    "exercise": {
                        "name": "Leg raises",
                        "duration": "6 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Leg_raise"
                    }
                },
                {
                    "exercise": {
                        "name": "Lunge",
                        "duration": "6 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Lunge_(exercise)"
                    }
                },
                {
                    "exercise": {
                        "name": "Leg extension",
                        "duration": "6 x 3 reps",
                        "url": "https://en.wikipedia.org/wiki/Leg_extension"
                    }
                }
            ],
        },
        {
            day: days[5],
            name: `Rest`,
            type: null,
            exercises: [],
        },
        {
            day: days[6],
            name: `Cardio`,
            type: `normal`,
            exercises: [
                {
                    "exercise": {
                        "name": "Warm Up",
                        "duration": "10 minutes",
                        "url": "https://greatist.com/fitness/full-body-dynamic-warm-up#The-benefits-of-dynamic-stretching"
                    }
                },
                {
                    "exercise": {
                        "name": "Elliptical",
                        "duration": "10 minutes",
                        "url": "https://en.wikipedia.org/wiki/Elliptical_trainer"
                    }
                },
                {
                    "exercise": {
                        "name": "Treadmill",
                        "duration": "10 minutes",
                        "url": "https://en.wikipedia.org/wiki/Treadmill"
                    }
                },
                {
                    "exercise": {
                        "name": "Running",
                        "duration": "10 minutes",
                        "url": "https://en.wikipedia.org/wiki/Deadlift"
                    }
                }
            ],
        },
    ]);
    const [heartRateData, setHeartRateData] = useState([
        {
            dateTime: '',
            value: {
                customHeartRateZones: [],
                heartRateZones: [
                    {
                        caloriesOut: 0,
                        max: 0,
                        min: 0,
                        minutes: 0,
                        name: 'Out of Range',
                    },
                    {
                        caloriesOut: 0,
                        max: 0,
                        min: 0,
                        minutes: 0,
                        name: 'Fat Burn',
                    },
                    {
                        caloriesOut: 0,
                        max: 0,
                        min: 0,
                        minutes: 0,
                        name: 'Cardio',
                    },
                    {
                        caloriesOut: 0,
                        max: 0,
                        min: 0,
                        minutes: 0,
                        name: 'Peak',
                    },
                ],
                restingHeartRate: 0,
            },
        },
    ]);
    const [weightData, setWeightData] = useState([
        { dateTime: '', value: 135 },
    ]);
    const [weight, setWeight] = useState({});
    const [currentBMI, setCurrentBMI] = useState(0);

    const handleConnect = () => {
        history.push('/user/connecttracker');
    };

    const [joyrideSteps] = useState([
        {
            target: '#syncButton',
            // title: 'Connect Fitbit',
            content: (
                <div>
                    <Typography>
                        Connect Fitbit account to sync data to the dashboard.
                    </Typography>
                    <Button onClick={handleConnect} color="primary">
                        Connect
                    </Button>
                </div>
            ),
            placement: 'auto',
            disableBeacon: true,
            disableOverlayClose: true,
        },
    ]);

    const headers = {
        'x-access-token': localStorage.getItem('access-token'),
    };

    function incrementCompleted() {
        setCompleted(completed => {
            // console.log(`load status: ${completed} -> ${completed + (100 / 6)}`);
            return completed + 100 / 7;
        });
    }

    async function checkTokenStatus() {
        try {
            const res = await axios.get('/api/checkOAuthTokenStatus', {
                headers,
            });
            if (res.data.status === 'success') {
                setConnectionStatus(true);
                return true;
            } else {
                setConnectionStatus(false);
                return false;
            }
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            setSyncError(true);
        }
    }

    async function getCaloriesBurnedData() {
        try {
            const res = await axios.get('/api/getcaloriesburned', { headers });
            if (res.data.status === 'success') {
                const caloriesBurnedData = res.data.data;
                setCaloriesBurnedData(
                    caloriesBurnedData['activities-calories']
                );
            } else {
                setSyncError(true);
            }
            setLoading(loading => {
                return {
                    ...loading,
                    caloriesBurnedData: false,
                };
            });
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            setSyncError(true);
        }
        incrementCompleted();
    }

    async function getActivitySummary() {
        try {
            const res = await axios.get('/api/getactivitysummary', {
                headers,
            });
            if (res.data.status === 'success') {
                const activitySummary = res.data.data;
                setCalories({
                    current: activitySummary.summary.caloriesOut,
                    goal: activitySummary.goals.caloriesOut,
                });
                setSteps({
                    current: activitySummary.summary.steps,
                    goal: activitySummary.goals.steps,
                });
                setDistance({
                    current: activitySummary.summary.distances[0].distance,
                    goal: activitySummary.goals.distance,
                });
                setFloors({
                    current: activitySummary.summary.floors,
                    goal: activitySummary.goals.floors,
                });
                setActiveMinutes({
                    current:
                        activitySummary.summary.fairlyActiveMinutes +
                        activitySummary.summary.veryActiveMinutes,
                    goal: activitySummary.goals.activeMinutes,
                });
            } else {
                setSyncError(true);
            }
            setLoading(loading => {
                return {
                    ...loading,
                    calories: false,
                    steps: false,
                    distance: false,
                    floors: false,
                    activeMinutes: false,
                };
            });
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            setSyncError(true);
        }
        incrementCompleted();
    }

    async function getHeartRateData() {
        try {
            const res = await axios.get('/api/getheartrate', { headers });
            if (res.data.status === 'success') {
                const heartRateData = res.data.data;
                setHeartRateData(heartRateData['activities-heart']);
            } else {
                setSyncError(true);
            }
            setLoading(loading => {
                return {
                    ...loading,
                    heartRateData: false,
                };
            });
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            setSyncError(true);
        }
        incrementCompleted();
    }

    async function getWeightData() {
        try {
            const res = await axios.get('/api/getweightdata', { headers });
            if (res.data.status === 'success') {
                const weightData = res.data.data;
                setWeightData(weightData['body-weight']);
            } else {
                setSyncError(true);
            }
            setLoading(loading => {
                return {
                    ...loading,
                    weightData: false,
                };
            });
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            setSyncError(true);
        }
        incrementCompleted();
    }

    async function getWeightGoal() {
        try {
            const res = await axios.get('/api/getweightgoal', { headers });
            if (res.data.status === 'success') {
                const weightGoal = res.data.data;
                setWeight({
                    goalType: weightGoal.goal['goalType'],
                    start: weightGoal.goal['startWeight'],
                    current: weightGoal.goal['current'],
                    goal: weightGoal.goal['weight'],
                });
            } else {
                setSyncError(true);
            }
            setLoading(loading => {
                return {
                    ...loading,
                    weight: false,
                };
            });
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            setSyncError(true);
        }
        incrementCompleted();
    }

    async function getBMIData() {
        try {
            const res = await axios.get('/api/getbmidata', { headers });
            if (res.data.status === 'success') {
                const bmiData = res.data.data;
                setCurrentBMI(bmiData['body-bmi'][0].value);
            } else {
                setSyncError(true);
            }
            setLoading(loading => {
                return {
                    ...loading,
                    currentBMI: false,
                };
            });
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            setSyncError(true);
        }
        incrementCompleted();
    }
    async function getWorkoutRoutine() {
        try {
            await axios.get('/api/getWorkoutPrediction', {
                headers,
            });
            console.log('Phase 1 compelte');
        } catch (err) {
            console.log(err);
        }
    }

    async function getAllData() {
        setCompleted(0);
        setSyncError(false);
        getActivitySummary();
        getCaloriesBurnedData();
        getHeartRateData();
        getWeightData();
        getWeightGoal();
        getBMIData();
        // getWorkoutRoutine();
        setTimeout(() => {
            setLoading(loading => {
                return {
                    ...loading,
                    workoutRoutine: false,
                };
            });
            incrementCompleted();
        }, 0);
    }

    const handleSync = () => {
        getAllData();
    };

    useEffect(() => {
        async function initialLoad() {
            const status = await checkTokenStatus();
            if (status) {
                getAllData();
            } else {
                setCompleted(100);
                setLoading({
                    steps: false,
                    distance: false,
                    floors: false,
                    activeMinutes: false,
                    caloriesBurnedData: false,
                    calories: false,
                    heartRateData: false,
                    weightData: false,
                    weight: false,
                    currentBMI: false,
                    workoutRoutine: false,
                });
            }
        }
        initialLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!connectionStatus) {
            setSyncMessage('Not connected');
        } else if (syncError) {
            setSyncMessage('Error retrieving data');
        } else if (completed < 100) {
            setSyncMessage('Retrieving data');
        } else if (completed >= 100) {
            let ts = new Date();
            if (toLocaleStringSupportsLocales()) {
                const options = {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                };
                setSyncMessage(ts.toLocaleString('en-US', options));
            } else {
                setSyncMessage(ts.toLocaleString());
            }
        }
    }, [connectionStatus, completed, syncError]);

    return (
        <Container maxWidth="lg" className={classes.container}>
            {/* <ConnectDialog connection={connectionStatus} /> */}
            <Joyride
                steps={joyrideSteps}
                run={!connectionStatus}
                disableScrolling={true}
                styles={
                    {
                        buttonClose: {
                            display: 'none',
                        },
                        tooltipFooter: {
                            display: 'none',
                        },
                        overlay: {
                            'pointer-events': 'none',
                        },
                    }
                }
            />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.syncPaper}>
                        <Hidden smDown>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                className={classes.title}
                            >
                                Fitbit Data
                            </Typography>
                        </Hidden>
                        <Typography
                            component="h1"
                            variant="subtitle2"
                            color="inherit"
                        >
                            {`LAST FITBIT SYNC: ${syncMessage}`}
                        </Typography>
                        <span id='syncButton'>
                            <SyncButton
                                connectionStatus={connectionStatus}
                                syncError={syncError}
                                completed={completed}
                                onSyncButtonPress={handleSync}
                            />
                        </span>
                    </Paper>
                    <LinearProgress
                        variant="determinate"
                        value={completed}
                        style={{ display: completed <= 100 ? '' : 'none' }}
                    />
                </Grid>
                {/* Exercise */}
                <Grid item xs={12}>
                    <Paper className={clsx((!connectionStatus) && classes.blur, minHeightPaper)}>
                        <WorkoutRoutine
                            loading={loading.workoutRoutine}
                            workoutRoutine={workoutRoutine}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Calories */}
                <Grid item xs={12} md={8} lg={9}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <Calories
                            loading={loading.caloriesBurnedData}
                            caloriesBurnedData={caloriesBurnedData}
                            color={dataColor}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Calories Goal */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <CaloriesGoal
                            loading={loading.calories}
                            current={calories.current}
                            goal={calories.goal}
                            color={dataColor}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Steps Goal */}
                <Grid item xs={12} md={3} lg={3}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <StepsGoal
                            loading={loading.steps}
                            current={steps.current}
                            goal={steps.goal}
                            color={dataColor}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Distance Goal */}
                <Grid item xs={12} md={3} lg={3}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <DistanceGoal
                            loading={loading.distance}
                            current={distance.current}
                            goal={distance.goal}
                            color={dataColor}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Floors Goal */}
                <Grid item xs={12} md={3} lg={3}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <FloorsGoal
                            loading={loading.floors}
                            current={floors.current}
                            goal={floors.goal}
                            color={dataColor}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Active Minutes Goal */}
                <Grid item xs={12} md={3} lg={3}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <ActiveMinutesGoal
                            loading={loading.activeMinutes}
                            current={activeMinutes.current}
                            goal={activeMinutes.goal}
                            color={dataColor}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Heart Rate */}
                <Grid item xs={12} md={6} lg={6}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <HeartRateZones
                            loading={loading.heartRateData}
                            heartRateData={heartRateData}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Resting Heart Rate */}
                <Grid item xs={12} md={6} lg={6}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <RestingHeartRate
                            loading={loading.heartRateData}
                            heartRateData={heartRateData}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Weight */}
                <Grid item xs={12} md={6} lg={6}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <Weight
                            loading={loading.weightData}
                            weightData={weightData}
                            color={dataColor}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* Weight goal */}
                <Grid item xs={12} md={3} lg={3}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <WeightGoal
                            loading={loading.weight}
                            goalType={weight.goalType}
                            start={weight.start}
                            current={weight.current}
                            goal={weight.goal}
                            color={dataColor}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
                {/* BMI */}
                <Grid item xs={12} md={3} lg={3}>
                    <Paper className={clsx((!connectionStatus || syncError) && classes.blur, fixedHeightPaper)}>
                        <BMI
                            loading={loading.currentBMI}
                            current={currentBMI}
                            prefersDarkMode={props.prefersDarkMode}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
