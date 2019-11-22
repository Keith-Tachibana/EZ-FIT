import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OauthPopup from 'react-oauth-popup';
import axios from 'axios';

const useStyles = makeStyles({
    card: {
        paddingTop: 10,
    },
    media: {
        padding: 5,
        width: 300,
        margin: 'auto',
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
        'x-access-token': sessionStorage.getItem('access-token'),
    };
    const classes = useStyles();
    const [connectionStatus, setConnectionStatus] = useState(false);

    useEffect(() => {
        checkTokenStatus();
    }, []);

    const checkTokenStatus = async () => {
        try {
            const response = await axios.get(
                '/user/checkOAuthTokenStatus',
                {
                    headers,
                }
            );
            if (response.data.status === 'success')
                setConnectionStatus(true);
            else {
                setConnectionStatus(false);
            }
        } catch (err) {
            console.log(err.response.data.errors);
        }
    };
    const syncConnection = async code => {
        handleConnection(code);
    };
    const handleConnection = async code => {
        // TODO: Add fitbit connection oauth flow
        console.log('Connecting...');
        const oauthCode = code;
        try {
            const resultToken = await axios.post(
                '/user/obtainToken',
                { code: oauthCode },
                { headers }
            );
            if (resultToken.data.status === 'success')
                setConnectionStatus(true);
            else setConnectionStatus(false);
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleDisconnection = async () => {
        // TODO: Add fitbit disconnection flow
        try {
            const res = await axios.post(
                '/user/revokeToken',
                {},
                { headers }
            );
            if (res.data.status === 'success') setConnectionStatus(false);
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <Card className={classes.card}>
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
                    {connectionStatus ? 'Connected' : 'Not connected'}
                </Typography>
                <Description connected={connectionStatus} />
            </CardContent>
            <span style={{ display: connectionStatus ? 'none' : '' }}>
                <OauthPopup
                    url="https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22BC4H&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser%2FcheckOAuthTokenStatus&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800"
                    onCode={syncConnection}
                >
                    <Button variant="contained" color="primary" fullWidth>
                        {connectionStatus ? 'Disconnect' : 'Connect'}
                    </Button>
                </OauthPopup>
            </span>
            <span style={{ display: connectionStatus ? '' : 'none' }}>
                <Button
                    onClick={handleDisconnection}
                    variant="contained"
                    color="secondary"
                    fullWidth
                >
                    {connectionStatus ? 'Disconnect' : 'Connect'}
                </Button>
            </span>
        </Card>
    );
}
