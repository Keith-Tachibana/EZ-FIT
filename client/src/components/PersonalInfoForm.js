import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Button, CardHeader, Divider, TextField, Grid } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {},
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
    submit: {},
}));

export default function PersonalInfoForm(){
    const history = useHistory();
    const classes = useStyles();
    
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        postal: '',
        country: '',
        additionalInfo: '',
    });

    const [status, setStatus] = useState(0);

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    }

    const headers = {
        'x-access-token': sessionStorage.getItem("access-token"),
    };

    useEffect(() => {
        async function fetchPersonalInfo(){
            try{
                const res = await axios.get('/user/getpersonalinfo', {headers});
                // console.log(res.data);
                if (res.data.status === "error"){
                    if (res.data.message === "jwt expired"){
                        //pass
                    }
                sessionStorage.removeItem("access-token");
                history.push("/");
                } else {
                    let info = res.data.data;
                    let currentInfo = {
                        ...values,
                    };
                    Object.assign(currentInfo, info);
                    setValues(currentInfo);
                }
            }
            catch (err) {
                console.log(err.response);
            }
        };
        fetchPersonalInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        async function updatePersonalInfo(){
            try {
                const res = await axios.post('/user/updatepersonalinfo', values, {headers});
                // console.log(res.data);
                if (res.data.status === "error"){
                    setStatus(0);
                    if (res.data.message === "jwt expired"){
                        //pass
                    }
                sessionStorage.removeItem("access-token");
                history.push("/");
                } else {
                    setStatus(res.data.message);
                }
            }
            catch (err) {
                console.log(err.response);
            }
        }
        updatePersonalInfo();
    };

    return (
        <Card className={classes.root}>
            <form
                className={classes.form}
                onSubmit={submitHandler}
                action="updatepersonalinfo"
                method="post"
                noValidate>
                <CardHeader 
                    title="Personal Information"
                    subheader="Update personal information"
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="First name"
                                type="text"
                                name="firstName"
                                autoComplete="given-name"
                                value={values.firstName}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="lastName"
                                label="Last name"
                                type="text"
                                id="lastName"
                                autoComplete="family-name"
                                value={values.lastName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={values.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="phoneNumber"
                                label="Phone"
                                type="tel"
                                id="phoneNumber"
                                autoComplete="tel"
                                value={values.phoneNumber}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="street"
                                label="Street"
                                type="text"
                                name="street"
                                autoComplete="street-address"
                                value={values.street}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="city"
                                label="City"
                                type="text"
                                id="city"
                                autoComplete="address-level2"
                                value={values.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="state"
                                id="state"
                                label="State"
                                type="text"
                                autoComplete="address-level1"
                                value={values.state}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="postal"
                                label="Postal"
                                type="text"
                                id="postal"
                                autoComplete="postal-code"
                                value={values.postal}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="country"
                                label="Country"
                                type="text"
                                id="country"
                                autoComplete="country-name"
                                value={values.country}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="additionalInfo"
                                label="Additional Information"
                                type="text"
                                id="additionalInfo"
                                autoComplete="new-password"
                                multiline
                                rows={3}
                                value={values.additionalInfo}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <span id="status" style={{display: status ? 'inline' : 'none' }}>
                        <Grid container direction="row" alignItems="center">
                            <Grid item>
                                <CheckCircleIcon color="primary"/>
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
                    <Button 
                        type="submit"
                        color="primary"
                        variant="contained"
                        className={classes.submit}>
                        Update
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
}