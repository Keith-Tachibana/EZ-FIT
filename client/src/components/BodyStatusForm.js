import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  CardHeader,
  Divider,
  Container,
  Grid,
  LinearProgress,
  CircularProgress,
} from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useHistory } from "react-router-dom";
import axios from "axios";
import ProgressiveImage from "react-progressive-image";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  root: {},
  wrapper: {
    position: 'relative',
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  submit: {},
  buttonProgress: {
    color: 'primary',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function BodyStatusForm(props) {
  const classes = useStyles();
  const history = useHistory();

  const [values, setValues] = useState({
    general: '',
    arms: '',
    legs: '',
  });

  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [errors, setErrors] = useState({
    general: {
      status: false,
      message: null,
    },
    arms: {
      status: false,
      message: null,
    },
    legs: {
      status: false,
      message: null,
    },
  });

  const [status, setStatus] = useState(0);

  const headers = {
    'x-access-token': localStorage.getItem("access-token"),
  };

  async function getBodyStatus() {
    setLoading(true);
    try {
      const res = await axios.get('/api/getbodystatus', { headers });
      console.log(res);
      if (res.data.status === "error") {
        setStatus(0);
        if (res.data.message === "jwt expired") {
          //pass
        }
        localStorage.removeItem("access-token");
        history.push("/");
      } else {
        let bodyStatus = res.data.data;
        let currentBodyStatus = {
          ...values,
        };
        Object.assign(currentBodyStatus, bodyStatus);
        setValues(currentBodyStatus);
      }
      setLoading(false);
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
      setLoading(false);
    }
  }

  async function updateBodyStatus() {
    setButtonLoading(true);
    try {
      const res = await axios.post('/api/updatebodystatus', values, { headers });
      console.log(res);
      if (res.data.status === "error") {
        setStatus(0);
        if (res.data.message === "jwt expired") {
          //pass
        }
        localStorage.removeItem("access-token");
        history.push("/");
      } else {
        setStatus(res.data.message);
        setErrors({
          general: {
            status: false,
            message: null,
          },
          arms: {
            status: false,
            message: null,
          },
          legs: {
            status: false,
            message: null,
          },
        });
      }
      setButtonLoading(false);
    } catch (err) {
      setStatus(0);
      setButtonLoading(false);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errs = err.response.data.errors;
        let currentErrors = {
          general: {
            status: false,
            message: null,
          },
          arms: {
            status: false,
            message: null,
          },
          legs: {
            status: false,
            message: null,
          },
        };
        if (errs instanceof Array) {
          let error;
          for (error of errs) {
            Object.assign(currentErrors, {
              [error.param]: {
                status: true,
                message: error.msg,
              },
            });
          }
        }
        setErrors(currentErrors);
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

  useEffect(() => {
    getBodyStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = name => event => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };

  const submitHandler = e => {
    e.preventDefault();
    updateBodyStatus();
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Card className={classes.root}>
        <LinearProgress style={{ display: loading ? '' : 'none' }} />
        <form
          className={classes.form}
          onSubmit={submitHandler}
          action="updateBodyStatus"
          method="post"
          noValidate
        >
          <CardHeader title="Body Status" subheader="Update body status" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl} error={errors.general.status}>
                    <InputLabel htmlFor="general-native-error">General</InputLabel>
                    <NativeSelect
                      value={values.general}
                      onChange={handleChange('general')}
                      name="general"
                      inputProps={{
                        id: 'general-native-error',
                      }}
                    >
                      <option value="" />
                      <option value="normal">Normal</option>
                      <option value="light">Light</option>
                      <option value="severe">Severe</option>
                    </NativeSelect>
                    <FormHelperText>{errors.general.message}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl} error={errors.arms.status}>
                    <InputLabel htmlFor="arms-native-error">Arms</InputLabel>
                    <NativeSelect
                      value={values.arms}
                      onChange={handleChange('arms')}
                      name="arms"
                      inputProps={{
                        id: 'arms-native-error',
                      }}
                    >
                      <option value="" />
                      <option value="normal">Normal</option>
                      <option value="light">Light</option>
                      <option value="severe">Severe</option>
                    </NativeSelect>
                    <FormHelperText>{errors.arms.message}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl} error={errors.legs.status}>
                    <InputLabel htmlFor="legs-native-error">Legs</InputLabel>
                    <NativeSelect
                      value={values.legs}
                      onChange={handleChange('legs')}
                      name="legs"
                      inputProps={{
                        id: 'legs-native-error',
                      }}
                    >
                      <option value="" />
                      <option value="normal">Normal</option>
                      <option value="light">Light</option>
                      <option value="severe">Severe</option>
                    </NativeSelect>
                    <FormHelperText>{errors.legs.message}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={7}>
                <ProgressiveImage
                  src='/body_injury.jpg'
                  placeholder='/body_injury-min.jpg'
                >
                  {(src, loading) => <img src={src} alt='body injury' width={'100%'} style={{ filter: loading ? 'blur(5px)' : 'none', transition: 'all 0.3s ease-in-out', 'pointer-events': 'none' }} />}
                </ProgressiveImage>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography id="Description" variant="subtitle1" display="inline">
                Normal: Body part is fine.
                <br />
                Light: Strains, Sprains, Cramps.
                <br />
                Severe: Broken Bones, Unusable.
                </Typography>
            </Grid>
            <span id="status" style={{ display: status ? 'inline' : 'none' }}>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <CheckCircleIcon color="primary" />
                </Grid>
                <Grid item>
                  <Typography id="statusMessage" variant="subtitle1" display="inline">
                    {status}
                  </Typography>
                </Grid>
              </Grid>
            </span>
          </CardContent>
          <Divider />
          <CardActions>
            <div className={classes.wrapper}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={buttonLoading}
                className={classes.submit}
              >
                Update
              </Button>
              {buttonLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
}
