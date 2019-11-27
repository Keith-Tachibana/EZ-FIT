import React, {useState, useEffect} from "react";
import Avatar from "@material-ui/core/Avatar";
import Link from "@material-ui/core/Link";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';
import Copyright from "./Copyright";

const Link1 = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
));
  
const useStyles = makeStyles(theme => ({
    root: {
      height: "100vh"
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
    placeholder: {
        margin: 10,
    },
}));

export default function Verify(props) {
    const history = useHistory();
    
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
 
    const classes = useStyles();

    const query = new URLSearchParams(props.location.search);

    useEffect(() => {
        let id = query.get('id');
        let token = query.get('token');
        if (!id || !token){
            setLoading(false);
            setStatus("Verification link error")
        } else {
            async function getVerification() {
                const res = await axios.get('/verify', {
                    params: {
                        id: id,
                        token: token,
                    }
                });
                try {
                    console.log(res);
                    setLoading(false);
                    if (res.data.status === "error"){
                        setStatus(res.data.message);
                    } else {
                        setStatus(res.data.message);
                    }
                }
                catch (err) {
                    console.log(err.response);
                    setLoading(false);
                    setStatus("Verification link error")
                }
            }
            getVerification();
        }
    }, []);

    return (
    <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Verification
        </Typography>
        <div className={classes.placeholder}>
            <Fade
                in={loading}
                style={{
                    transitionDelay: loading ? '800ms' : '0ms',
                }}
                unmountOnExit
            >
                <CircularProgress />
            </Fade>
        </div>
        <Grid container display={status ? 'inline' : 'none'} className={classes.placeholder}>
            <Typography 
                id="statusMessage" 
                variant="subtitle1"   
            >
                {status}
            </Typography>
        </Grid>
        <Grid container className={classes.placeholder}>
            <Link component={Link1} to="/signin" variant="subtitle1">
                Click here to return to sign in page.
            </Link>
        </Grid>
        <Box mt={2}>
            <Copyright />
        </Box>
    </div>
    );
}