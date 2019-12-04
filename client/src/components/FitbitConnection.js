import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OauthPopup from 'react-oauth-popup';
import axios from 'axios';
import { LinearProgress, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
    card: {
        paddingTop: 10,
    },
    media: {
        padding: 5,
        width: 300,
        margin: 'auto',
    },
    wrapper: {
        position: 'relative',
    },
    buttonProgress: {
        color: 'primary',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});

function ConnectDescription() {
    return (
        <Typography variant="body2" color="textSecondary" component="p">
            Connect your Fitbit account and your data will sync with the
            dashboard automatically on login or you can start a sync
            manually using the sync button.
        </Typography>
    );
}

function DisconnectDescription() {
    return (
        <Typography variant="body2" color="textSecondary" component="p">
            Disconnect your Fitbit account and your data will not sync with
            the Dashboard.
        </Typography>
    );
}

function Description(props) {
    if (!props.connected) {
        return <ConnectDescription />;
    } else {
        return <DisconnectDescription />;
    }
}

export default function FitbitConnection() {
    const headers = {
        'x-access-token': localStorage.getItem('access-token'),
    };
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        checkTokenStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkTokenStatus = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                '/api/checkOAuthTokenStatus',
                {
                    headers,
                }
            );
            if (response.data.status === 'success')
                setConnectionStatus(true);
            else {
                setConnectionStatus(false);
            }
            setLoading(false);
        } catch (err) {
            console.log(err.response.data.errors);
        }
    };
    const syncConnection = async code => {
        handleConnection(code);
    };
    const handleConnection = async code => {
        console.log('Connecting...');
        setButtonLoading(true);
        const oauthCode = code;
        try {
            const resultToken = await axios.post(
                '/api/obtainToken',
                { code: oauthCode },
                { headers }
            );
            if (resultToken.data.status === 'success')
                setConnectionStatus(true);
            else setConnectionStatus(false);
            setButtonLoading(false);
        } catch (err) {
            console.log(err.message);
            setButtonLoading(false);
        }
    };

    const handleDisconnection = async () => {
        setButtonLoading(true);
        try {
            const res = await axios.post(
                '/api/revokeToken',
                {},
                { headers }
            );
            if (res.data.status === 'success') setConnectionStatus(false);
            setButtonLoading(false);
        } catch (err) {
            console.log(err.message);
            setButtonLoading(false);
        }
    };
    return (
        <Card className={classes.card}>
            <LinearProgress style={{display: loading ? '' : 'none', marginTop: -10}} />
            <CardMedia className={classes.media}>
                <img
                    src="/Fitbit_logo_RGB.png"
                    alt="Fitbit logo"
                    height="100%"
                    width="100%"
                />
            </CardMedia>
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    align="center"
                >
                    <span style={{ display: loading ? '' : 'none' }}>
                        Retrieving connection status
                    </span>
                    <span style={{ display: loading ? 'none' : '' }}>
                        {connectionStatus ? 'Connected' : 'Not connected'}
                    </span>
                </Typography>
                <Description connected={connectionStatus} />
            </CardContent>
            <div className={classes.wrapper}>
                <span style={{ display: connectionStatus ? 'none' : '' }}>
                    <OauthPopup
                        url="https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22BC4H&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser%2FcheckOAuthTokenStatus&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800"
                        onCode={syncConnection}
                    >
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disabled={loading || buttonLoading}
                            fullWidth>
                            {connectionStatus ? 'Disconnect' : 'Connect'}
                        </Button>
                        {buttonLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </OauthPopup>
                </span>
                <span style={{ display: connectionStatus ? '' : 'none' }}>
                    <Button
                        onClick={handleDisconnection}
                        color="secondary"
                        variant="contained"
                        disabled={loading || buttonLoading}
                        fullWidth
                    >
                        {connectionStatus ? 'Disconnect' : 'Connect'}
                    </Button>
                    {buttonLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </span>
            </div>
        </Card>
    );
}
