import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Button, CardHeader, Divider, TextField, Container, Grid } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {},
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
    submit: {},
}));

export default function PasswordForm(props){
    const classes = useStyles();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState(0);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
    
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    useEffect(() => {
        if (password === confirmPassword){
            setError(null);
        } else {
            setError("Password do not match")
        }
    }, [password, confirmPassword]);

    const submitHandler = (e) => {
        e.preventDefault();
        const passwordValue = e.target.password.value;
        const confirmPasswordValue = e.target.confirmPassword.value;
        if (passwordValue !== confirmPasswordValue){
            setError("Password do not match");
            return;
        }
        axios.post('/updatepassword', {
          password: passwordValue,
        })
    };

    return (
        <Container maxWidth="sm">
            <Card className={classes.root}>
                <form
                    className={classes.form}
                    onSubmit={submitHandler}
                    action="updatepassword"
                    method="post"
                    noValidate>
                    <CardHeader 
                        title="Password"
                        subheader="Update password"
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
                                    id="password"
                                    label="Password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    onChange={handlePasswordChange}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    onChange={handleConfirmPasswordChange}
                                />
                            </Grid>
                        </Grid>
                        <span id="error" style={{display: error ? 'inline' : 'none' }}>
                            <Grid container direction="row" alignItems="center">
                                <Grid item>
                                <ErrorIcon color="error" />
                                </Grid>
                                <Grid item>
                                <Typography id="errorMessage" variant="subtitle1" color="error" display="inline">
                                    {error}
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
        </Container>
    );
}