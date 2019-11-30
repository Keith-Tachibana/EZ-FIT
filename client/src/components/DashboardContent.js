import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
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
import BMI from './BMI';

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
        justifyContent: 'center'
    },
    fixedHeight: {
        height: 240,
    },
}));

export default function DashboardContent() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const dataColor = '#BB86FC';

    const [connectionStatus, setConnectionStatus] = useState(true);
    const [completed, setCompleted] = useState(0);
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
    })

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
    const [currentBMI, setCurrentBMI] = useState(0);

    const headers = {
      'x-access-token': sessionStorage.getItem("access-token"),
    };

    function incrementCompleted() {
      setCompleted((completed) => {
        console.log(`load status: ${completed} -> ${completed + (100 / 6)}`);
        return completed + (100 / 6);
      });
    }
    
    async function checkTokenStatus() {
      try {
          const res = await axios.get('/user/checkOAuthTokenStatus',{ headers });
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
      }
    };

    async function getCaloriesBurnedData() {
      try {
        const res = await axios.get('/user/getcaloriesburned', { headers });
        if (res.data.status === 'success') {
          const caloriesBurnedData = res.data.data;
          setCaloriesBurnedData(caloriesBurnedData['activities-calories']);
          setLoading(loading => {
            return {
              ...loading,
              caloriesBurnedData: false,
            }
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
      incrementCompleted();
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
          setLoading(loading => {
            return {
              ...loading,
              calories: false,
              steps: false,
              distance: false,
              floors: false,
              activeMinutes: false,
            }
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
      incrementCompleted();
    };

    async function getHeartRateData() {
      try {
        const res = await axios.get('/user/getheartrate', {headers});
        if (res.data.status === 'success') {
          const heartRateData = res.data.data;
          setHeartRateData(heartRateData['activities-heart']);
          setLoading(loading => {
            return {
              ...loading,
              heartRateData: false,
            }
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
      incrementCompleted();
    }

    async function getWeightData() {
      try {
        const res = await axios.get('/user/getweightdata', {headers});
        if (res.data.status === 'success') {
          const weightData = res.data.data;
          setWeightData(weightData['body-weight']);
          setLoading(loading => {
            return {
              ...loading,
              weightData: false,
            }
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
      incrementCompleted();
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
          setLoading(loading => {
            return {
              ...loading,
              weight: false,
            }
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
      incrementCompleted();
    }

    async function getBMIData() {
      try {
        const res = await axios.get('/user/getbmidata', {headers});
        console.log(res);
        if (res.data.status === 'success') {
          const bmiData = res.data.data;
          setCurrentBMI(bmiData['body-bmi'][0].value);
          setLoading(loading => {
            return {
              ...loading,
              currentBMI: false,
            }
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
      incrementCompleted();
    }

    async function getAllData() {
      setCompleted(0);
      getActivitySummary();
      getCaloriesBurnedData();
      getHeartRateData();
      getWeightData();
      getWeightGoal();
      getBMIData();
    }

    // useEffect(() => {
    //   console.log(loading);
    // }, [loading])
    
    useEffect(() => {
      async function initialLoad() {
        const status = await checkTokenStatus();
        if (status) {
          getAllData();
        } else {
          setCompleted(100);
        }
      }
      initialLoad();
    }, []);

    return (
        <Container maxWidth="lg" className={classes.container}>
          <LinearProgress variant="determinate" value={completed} style={{display: (completed <= 100) ? '' : 'none' }}/>
          <ConnectDialog connection={connectionStatus} />
          <Grid container spacing={2}>
            {/* Steps Goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <StepsGoal loading={loading.steps} current={steps.current} goal={steps.goal} color={dataColor} />
              </Paper>
            </Grid>
            {/* Distance Goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <DistanceGoal loading={loading.distance} current={distance.current} goal={distance.goal} color={dataColor} />
              </Paper>
            </Grid>
            {/* Floors Goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                  <FloorsGoal loading={loading.floors} current={floors.current} goal={floors.goal} color={dataColor} />
              </Paper>
            </Grid>
            {/* Active Minutes Goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <ActiveMinutesGoal loading={loading.activeMinutes} current={activeMinutes.current} goal={activeMinutes.goal} color={dataColor} />
              </Paper>
            </Grid>
            {/* Calories */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Calories loading={loading.caloriesBurnedData} caloriesBurnedData={caloriesBurnedData} color={dataColor} />
              </Paper>
            </Grid>
            {/* Calories Goal */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <CaloriesGoal loading={loading.calories} current={calories.current} goal={calories.goal} color={dataColor} />
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
                <HeartRateZones loading={loading.heartRateData} heartRateData={heartRateData} />
              </Paper>
            </Grid>
            {/* Resting Heart Rate */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <RestingHeartRate loading={loading.heartRateData} heartRateData={heartRateData} />
              </Paper>
            </Grid>
            {/* Weight */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <Weight loading={loading.weightData} weightData={weightData} color={dataColor} />
              </Paper>
            </Grid>
            {/* Weight goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <WeightGoal loading={loading.weight} goalType={weight.goalType} start={weight.start} current={weight.current} goal={weight.goal} color={dataColor} />
              </Paper>
            </Grid>
            {/* BMI */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <BMI loading={loading.currentBMI} current={currentBMI} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
    );
}