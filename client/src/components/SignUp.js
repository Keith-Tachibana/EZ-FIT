import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ErrorIcon from '@material-ui/icons/Error';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';

const Link1 = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        EZ-PHR
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const history = useHistory();
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    showPassword: false,
  });

  const [errors, setErrors] = useState({
    firstName: {
      status: false,
      message: null,
    },
    lastName: {
      status: false,
      message: null,
    },
    email: {
      status: false,
      message: null,
    },
    password: {
      status: false,
      message: null,
    },
  });

  const [status, setStatus] = useState(0);
  const classes = useStyles();

  const handleChange = (e) => {
    setValues({
        ...values,
        [e.target.name]: e.target.value,
    });
  };
  
  const handleClickShowPassword = () => {
    setValues({
      ...values, 
      showPassword: !values.showPassword 
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  // React.useEffect(() => {
  //   console.log(errors);
  // }, [errors])

  const submitHandler = (e) => {
    e.preventDefault();
    axios.post('/register', {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    })
    .then(res => {
      console.log(res);
      if (res.data.status === "error"){
        setStatus(res.data.message);
      } else if (res.data.status === "success") {
        setStatus(null);
        history.push('/signin');
      }
    })
    .catch(err => {
      const errs = err.response.data.errors;
      let currentErrors = {
        firstName: {
          status: false,
          message: null,
        },
        lastName: {
          status: false,
          message: null,
        },
        email: {
          status: false,
          message: null,
        },
        password: {
          status: false,
          message: null,
        },
      };
      let error;
      for (error of errs){
        Object.assign(currentErrors, {
          [error.param]: {
            status: true,
            message: error.msg,
          },
        });
      }
      setErrors(currentErrors);
      // console.log(err.response);
    })
  };

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form 
          className={classes.form}
          onSubmit={submitHandler}
          action="register" 
          method="post" 
          noValidate
          >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                variant="outlined"
                id="firstName"
                label="First Name"
                autoComplete="fname"
                onChange={handleChange}
                error={errors.firstName.status}
                helperText={errors.firstName.message}
                required
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={handleChange}
                error={errors.lastName.status}
                helperText={errors.lastName.message}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                error={errors.email.status}
                helperText={errors.email.message}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                name="password"
                label="Password"
                id="password"
                autoComplete="new-password"
                type={values.showPassword ? 'text' : 'password'}
                onChange={handleChange}
                error={errors.password.status}
                helperText={errors.password.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
                fullWidth
              />
            </Grid>
            <span id="error" style={{display: status ? 'inline' : 'none' }}>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <ErrorIcon color="error" />
                </Grid>
                <Grid item>
                  <Typography id="errorMessage" variant="subtitle1" color="error" display="inline">
                    {status}
                  </Typography>
                </Grid>
              </Grid>
            </span>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={Link1} to="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}