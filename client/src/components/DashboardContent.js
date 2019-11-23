import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Title from './Title';
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
import ConnectDialog from './ConnectDialog';

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
}));

export default function DashboardContent() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [connectionStatus, setConnectionStatus] = useState(true);

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
      {"dateTime":"","value":0},
    ]);
    const [calories, setCalories] = useState({
      current: 0,
      goal: 5000,
    })
    const [heartRateData, setHeartRateData] = useState([
      {
        "dateTime": "",
        "value": {
            "customHeartRateZones": [],
            "heartRateZones": [
                {
                    "caloriesOut": 0,
                    "max": 0,
                    "min": 0,
                    "minutes": 0,
                    "name": "Out of Range"
                },
                {
                    "caloriesOut": 0,
                    "max": 0,
                    "min": 0,
                    "minutes": 0,
                    "name": "Fat Burn"
                },
                {
                    "caloriesOut": 0,
                    "max": 0,
                    "min": 0,
                    "minutes": 0,
                    "name": "Cardio"
                },
                {
                    "caloriesOut": 0,
                    "max": 0,
                    "min": 0,
                    "minutes": 0,
                    "name": "Peak"
                }
            ],
            "restingHeartRate": 0
        }
    }]);
    const [weightData, setWeightData] = useState([
      {"dateTime":"","value":135},
    ]);
    const [weight, setWeight] = useState({});

    const headers = {
      'x-access-token': sessionStorage.getItem("access-token"),
    };
    
    async function checkTokenStatus() {
      try {
          const res = await axios.get('/user/checkOAuthTokenStatus',{ headers });
          if (res.data.status === 'success')
              setConnectionStatus(true);
          else {
              setConnectionStatus(false);
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
      }
  };

    async function getCaloriesBurnedData() {
      try {
        const res = await axios.get('/user/getcaloriesburned', { headers });
        if (res.data.status === 'success') {
          const caloriesBurnedData = res.data.data;
          setCaloriesBurnedData(caloriesBurnedData['activities-calories']);
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
      }
    };

    async function getActivitySummary() {
      try {
        const res = await axios.get('/user/getactivitysummary', {headers});
        if (res.data.status === 'success') {
          const activitySummary = res.data.data;
          setCalories({
            current: activitySummary.summary.caloriesOut,
            goal: activitySummary.goals.caloriesOut,
          })
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
            current: activitySummary.summary.fairlyActiveMinutes + activitySummary.summary.veryActiveMinutes,
            goal: activitySummary.goals.activeMinutes,
          });
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
      }
    };

    async function getHeartRateData() {
      try {
        const res = await axios.get('/user/getheartrate', {headers});
        if (res.data.status === 'success') {
          const heartRateData = res.data.data;
          setHeartRateData(heartRateData['activities-heart']);
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
      }
    }

    async function getWeightData() {
      try {
        const res = await axios.get('/user/getweightdata', {headers});
        if (res.data.status === 'success') {
          const weightData = res.data.data;
          setWeightData(weightData['body-weight']);
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
      }
    }

    async function getWeightGoal() {
      try {
        const res = await axios.get('/user/getweightgoal', {headers});
        if (res.data.status === 'success') {
          const weightGoal = res.data.data;
          setWeight({
            goalType: weightGoal.goal['goalType'],
            start: weightGoal.goal['startWeight'],
            current: weightGoal.goal['current'],
            goal: weightGoal.goal['weight'],
          });
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
      }
    }

    async function getAllData() {
      getActivitySummary();
      getCaloriesBurnedData();
      getHeartRateData();
      getWeightData();
      getWeightGoal();
    }

    useEffect(() => {
      console.log(weight);
    }, [weight])
    
    useEffect(() => {
      async function initialLoad() {
        await checkTokenStatus();
        getAllData();
      }
      initialLoad();
    }, []);

    return (
        <Container maxWidth="lg" className={classes.container}>
          <ConnectDialog connection={connectionStatus} />
          <Grid container spacing={2}>
            {/* Steps Goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <StepsGoal current={steps.current} goal={steps.goal} />
              </Paper>
            </Grid>
            {/* Distance Goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <DistanceGoal current={distance.current} goal={distance.goal} />
              </Paper>
            </Grid>
            {/* Floors Goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                  <FloorsGoal current={floors.current} goal={floors.goal} />
              </Paper>
            </Grid>
            {/* Active Minutes Goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <ActiveMinutesGoal current={activeMinutes.current} goal={activeMinutes.goal} />
              </Paper>
            </Grid>
            {/* Calories */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Calories caloriesBurnedData={caloriesBurnedData} />
              </Paper>
            </Grid>
            {/* Calories Goal */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <CaloriesGoal current={calories.current} goal={calories.goal} />
              </Paper>
            </Grid>
            {/* Exercise */}
            {/* <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <Title>Exercise</Title>
              </Paper>
            </Grid> */}
            {/* Heart Rate */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <HeartRateZones heartRateData={heartRateData} />
              </Paper>
            </Grid>
            {/* Resting Heart Rate */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <RestingHeartRate heartRateData={heartRateData} />
              </Paper>
            </Grid>
            {/* Weight */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <Weight weightData={weightData} />
              </Paper>
            </Grid>
            {/* Weight goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <WeightGoal goalType={weight.goalType} start={weight.start} current={weight.current} goal={weight.goal} />
              </Paper>
            </Grid>
            {/* BMI */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Title>BMI</Title>
              </Paper>
            </Grid>
          </Grid>
        </Container>
    );
}