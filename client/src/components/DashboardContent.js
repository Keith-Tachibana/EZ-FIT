import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import StepsGoal from './StepsGoal';
import Calories from './Calories';
import CaloriesGoal from './CaloriesGoal';
import FloorsGoal from './FloorsGoal';
import ActiveMinutesGoal from './ActiveMinutesGoal';
import DistanceGoal from './DistanceGoal';
import Title from './Title';

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
    const [weight, setWeight] = useState({
      start: 130,
      current: 130,
      goal: 135,
    });

    const headers = {
      'x-access-token': sessionStorage.getItem("access-token"),
    };
    
    const checkTokenStatus = async () => {
      try {
          const res = await axios.get('/user/checkOAuthTokenStatus',{ headers });
          if (res.data.status === 'success')
              setConnectionStatus(true);
          else {
              setConnectionStatus(false);
          }
      } catch (err) {
          console.log(err.response.data.errors);
      }
  };

    async function getCaloriesBurnedData() {
      try {
        const res = await axios.get('/user/getcalories', { headers });
        if (res.data.status === 'success') {
          const caloriesBurnedData = res.data.data;
          setCaloriesBurnedData(caloriesBurnedData['activities-calories']);
        }
      } catch (err) {
        console.log(err.response);
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
        console.log(err.response);
      }
    };
    
    useEffect(() => {
      checkTokenStatus();
      getActivitySummary();
      getCaloriesBurnedData();

      // setTimeout(function(){
      //   setSteps({
      //     current: 5121,
      //     goal: 25000,
      //   });
      // }, 2000);
      // setTimeout(function(){
      //   setDistance({
      //     current: 5.5,
      //     goal: 10,
      //   });
      // }, 2000);
      // setTimeout(function(){
      //   setFloors({
      //     current: 7,
      //     goal: 10,
      //   });
      // }, 2000);
      // setTimeout(function(){
      //   setActiveMinutes({
      //     current: 21,
      //     goal: 30,
      //   });
      // }, 2000);
      // setTimeout(function(){
      //   setCalories({
      //     current: 1845,
      //     goal: 2950,
      //   });
      // }, 2000);

      // setTimeout(function(){
      //   setCaloriesBurnedData([
      //     {"dateTime":"2011-04-27","value":5490},
      //     {"dateTime":"2011-04-28","value":2344},
      //     {"dateTime":"2011-04-29","value":2779},
      //     {"dateTime":"2011-04-30","value":9196},
      //     {"dateTime":"2011-05-01","value":15828},
      //     {"dateTime":"2011-05-02","value":1945},
      //     {"dateTime":"2011-05-03","value":366},
      //     {"dateTime":"2011-05-04","value":10102},
      //     {"dateTime":"2011-05-05","value":803},
      //     {"dateTime":"2011-05-06","value":450},
      //     {"dateTime":"2011-05-07","value":2010},
      //     {"dateTime":"2011-05-08","value":1600},
      //     {"dateTime":"2011-05-09","value":5050},
      //     {"dateTime":"2011-05-10","value":300},
      //     {"dateTime":"2011-05-11","value":11020},
      //     {"dateTime":"2011-05-12","value":1800},
      //     {"dateTime":"2011-05-13","value":1472},
      //     {"dateTime":"2011-05-14","value":3414},
      //     {"dateTime":"2011-05-15","value":9752},
      //     {"dateTime":"2011-05-16","value":4542},
      //     {"dateTime":"2011-05-17","value":121},
      //     {"dateTime":"2011-05-18","value":12452},
      //     {"dateTime":"2011-05-19","value":10101},
      //     {"dateTime":"2011-05-20","value":2457},
      //     {"dateTime":"2011-05-21","value":242},
      //     {"dateTime":"2011-05-22","value":3671},
      //     {"dateTime":"2011-05-23","value":214},
      //     {"dateTime":"2011-05-24","value":707},
      //     {"dateTime":"2011-05-25","value":247},
      //     {"dateTime":"2011-05-26","value":2101},
      //     {"dateTime":"2011-05-27","value":14080},
      //   ]);
      // }, 5000);

      setTimeout(function(){
        setHeartRateData([
          {
              "dateTime": "2015-08-04",
              "value": {
                  "customHeartRateZones": [],
                  "heartRateZones": [
                      {
                          "caloriesOut": 740.15264,
                          "max": 94,
                          "min": 30,
                          "minutes": 593,
                          "name": "Out of Range"
                      },
                      {
                          "caloriesOut": 249.66204,
                          "max": 132,
                          "min": 94,
                          "minutes": 46,
                          "name": "Fat Burn"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 160,
                          "min": 132,
                          "minutes": 0,
                          "name": "Cardio"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 220,
                          "min": 160,
                          "minutes": 0,
                          "name": "Peak"
                      }
                  ],
                  "restingHeartRate": 68
              }
          },
          {
              "dateTime": "2015-08-05",
              "value": {
                  "customHeartRateZones": [],
                  "heartRateZones": [
                      {
                          "caloriesOut": 740.15264,
                          "max": 94,
                          "min": 30,
                          "minutes": 150,
                          "name": "Out of Range"
                      },
                      {
                          "caloriesOut": 249.66204,
                          "max": 132,
                          "min": 94,
                          "minutes": 20,
                          "name": "Fat Burn"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 160,
                          "min": 132,
                          "minutes": 0,
                          "name": "Cardio"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 220,
                          "min": 160,
                          "minutes": 30,
                          "name": "Peak"
                      }
                  ],
                  "restingHeartRate": 70
              }
          },
          {
              "dateTime": "2015-08-06",
              "value": {
                  "customHeartRateZones": [],
                  "heartRateZones": [
                      {
                          "caloriesOut": 740.15264,
                          "max": 94,
                          "min": 30,
                          "minutes": 30,
                          "name": "Out of Range"
                      },
                      {
                          "caloriesOut": 249.66204,
                          "max": 132,
                          "min": 94,
                          "minutes": 200,
                          "name": "Fat Burn"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 160,
                          "min": 132,
                          "minutes": 250,
                          "name": "Cardio"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 220,
                          "min": 160,
                          "minutes": 100,
                          "name": "Peak"
                      }
                  ],
                  "restingHeartRate": 51
              }
          },
          {
              "dateTime": "2015-08-07",
              "value": {
                  "customHeartRateZones": [],
                  "heartRateZones": [
                      {
                          "caloriesOut": 740.15264,
                          "max": 94,
                          "min": 30,
                          "minutes": 700,
                          "name": "Out of Range"
                      },
                      {
                          "caloriesOut": 249.66204,
                          "max": 132,
                          "min": 94,
                          "minutes": 20,
                          "name": "Fat Burn"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 160,
                          "min": 132,
                          "minutes": 10,
                          "name": "Cardio"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 220,
                          "min": 160,
                          "minutes": 25,
                          "name": "Peak"
                      }
                  ],
                  "restingHeartRate": 80
              }
          },
          {
              "dateTime": "2015-08-08",
              "value": {
                  "customHeartRateZones": [],
                  "heartRateZones": [
                      {
                          "caloriesOut": 740.15264,
                          "max": 94,
                          "min": 30,
                          "minutes": 0,
                          "name": "Out of Range"
                      },
                      {
                          "caloriesOut": 249.66204,
                          "max": 132,
                          "min": 94,
                          "minutes": 11,
                          "name": "Fat Burn"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 160,
                          "min": 132,
                          "minutes": 15,
                          "name": "Cardio"
                      },
                      {
                          "caloriesOut": 0,
                          "max": 220,
                          "min": 160,
                          "minutes": 120,
                          "name": "Peak"
                      }
                  ],
                  "restingHeartRate": 55
              }
          }
      ])
      }, 8000);

      setTimeout(function(){
        setWeightData([
          {"dateTime":"2011-04-27","value":175},
          {"dateTime":"2011-04-28","value":174},
          {"dateTime":"2011-04-29","value":173},
          {"dateTime":"2011-04-30","value":175},
          {"dateTime":"2011-05-01","value":180},
          {"dateTime":"2011-05-02","value":174},
          {"dateTime":"2011-05-03","value":173},
        ]);
      }, 3000);

      setTimeout(() => {
        setWeight({
          start: 160,
          current: 143,
          goal: 135,
        })
      }, 2000);
    }, []);
    return (
        <Container maxWidth="lg" className={classes.container}>
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
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <Title>Exercise</Title>
              </Paper>
            </Grid>
            {/* Heart Rate */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <Title>Heart Rate</Title>
                {/* <HeartRateZones heartRateData={heartRateData} /> */}
              </Paper>
            </Grid>
            {/* Resting Heart Rate */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <Title>Resting Heart Rate</Title>
                {/* <RestingHeartRate heartRateData={heartRateData} /> */}
              </Paper>
            </Grid>
            {/* Weight */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={fixedHeightPaper}>
                <Title>Weight</Title>
                {/* <Weight weightData={weightData} /> */}
              </Paper>
            </Grid>
            {/* Weight goal */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Title>Weight goal</Title>
                {/* <WeightGoal start={weight.start} current={weight.current} goal={weight.goal} /> */}
              </Paper>
            </Grid>
            {/* BMI */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Title>BMI</Title>
                {/* <BMI /> */}
              </Paper>
            </Grid>
          </Grid>
        </Container>
    );
}