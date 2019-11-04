import React, {useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ErrorIcon from '@material-ui/icons/Error';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';

const Link1 = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
));
  
function Copyright() {
return (
        <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://material-ui.com/">
            EZ-PHR
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
      height: "100vh"
    },
    image: {
      backgroundImage: "url(https://source.unsplash.com/random)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center"
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1)
    },
    submit: {
      margin: theme.spacing(3, 0, 2)
    }
}));

export default function SignIn() {
    const history = useHistory();

    const [values, setValues] = useState({
      email: '',
      password: '',
      showPassword: false,
    });
  
    const [errors, setErrors] = useState({
      email: {
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
    }
  
    const handleClickShowPassword = () => {
      setValues({
        ...values, 
        showPassword: !values.showPassword 
      });
    };
  
    const handleMouseDownPassword = event => {
      event.preventDefault();
    };
  
    const submitHandler = (e) => {
      e.preventDefault();
      axios.post('/signin', {
        email: values.email,
        password: values.password,
      })
      .then(res => {
        if (res.data.status === "error"){
          setStatus(res.data.message);
        } else if (res.data.status === "success") {
          setStatus(null);
          sessionStorage.setItem("access-token", res.data.data.token);
          history.push('/user');
        }
      })
      .catch(err => {
        const errs = err.response.data.errors;
        let currentErrors = {
          email: {
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
        console.log(err.response);
      })
    };
  
    if (sessionStorage.getItem("access-token") !== null){
      history.push('/user');
    }
  

    return (
    <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          onSubmit={submitHandler}
          action="signin"
          method="post"
          noValidate
        >
          <TextField
            variant="outlined"
            margin="normal"
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleChange}
            error={errors.email.status}
            helperText={errors.email.message}
            required
            fullWidth
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="password"
            label="Password"
            id="password"
            autoComplete="current-password"
            type={values.showPassword ? 'text' : 'password'}
            onChange={handleChange}
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              {/* Add forgot password functionality */}
              <Link component={Link1} to="/forgetpassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={Link1} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Copyright />
          </Box>
        </form>
    </div>
    );
}