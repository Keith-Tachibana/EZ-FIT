const userModel = require('../models/users');
const axios = require('axios');
const qs = require('querystring');
const appConfig = require('../../../config/appConfig');

async function refreshToken(req, userInfo) {
    try {
        const refreshResult = await axios.post(
            'https://api.fitbit.com/oauth2/token',
            qs.stringify({
                grant_type: `refresh_token`,
                refresh_token: userInfo.authToken.refresh_token,
            }),
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${encString}`,
                },
            }
        );
        if (refreshResult.status === 200) {
            await userModel.updateOne(
                {
                    _id: req.body.userId,
                },
                {
                    $set: {
                        authToken: {
                            access_token: refreshResult.access_token,
                        },
                    },
                }
            );
        }
    } catch (err) {
        throw err;
    }
}

async function storeToken(userId, resp) {
    try {
        const storeResult = await userModel.updateOne(
            {
                _id: userId,
            },
            {
                $set: {
                    authToken: {
                        access_token: resp.data.access_token,
                        expires_in:
                            Date.now() + resp.data.expires_in * 1000,
                        refresh_token: resp.data.refresh_token,
                        scope: resp.data.scope,
                        token_type: resp.data.token_type,
                        user_id: resp.data.user_id,
                    },
                },
            }
        );
        if (storeResult.status === 200) {
            return res.json({
                status: 'success',
                message: 'Token stored successfully',
            });
        }
    } catch (err) {
        throw err;
    }
}

async function obtainToken(req, authCode) {
    try {
        const clientId = appConfig.clientID;
        const clientSecret = appConfig.clientSecret;
        const encString = Buffer.from(
            `${clientId}:${clientSecret}`
        ).toString('base64');
        const resp = await axios.post(
            'https://api.fitbit.com/oauth2/token',
            qs.stringify({
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost:3000/user/connecttracker',
                code: authCode,
            }),
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' + encString,
                },
            }
        );
        if (resp.status === '200') {
            const respJson = await storeToken(req.body.userId, resp);
            return respJson;
        }
    } catch (err) {
        console.log(
            "Couldn't retrieve token from Fitbit: ",
            err.response.data.errors
        );
    }
}

async function connectFitbit(req, res, next) {
    const userId = req.body.userId;
    if (userId !== null) {
        const userInfo = await userModel.findById(userId);
        if (userInfo) {
            const tokenValidity = await axios.post(
                'https://api.fitbit.com/1.1/oauth2/introspect',
                qs.stringify({
                    token: userInfo.authToken.access_token,
                }),
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.authToken.token}`,
                        'content-type':
                            'application/x-www-form-urlencoded',
                    },
                }
            );
            if (tokenValidity.active === 'false') {
                await refreshToken();
            } else {
                const authCode = await res.redirect(
                    'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22BC4H&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser%2Fconnecttracker&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800'
                );
                console.log(authCode, 'is blank');
                await obtainToken(req, authCode);
            }
        } else {
            console.log("Couldn't retrieve the guy");
        }
    }
}
async function checkOAuthTokenStatus(req, res, next) {
    const userId = req.body.userId;
    const clientId = appConfig.clientID;
    const clientSecret = appConfig.clientSecret;
    const encString = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64'
    );
    console.log(encString);
    if (userId !== null) {
        try {
            const userInfo = await userModel.findById(userId);
            if (userInfo) {
                console.log('Hey token', userInfo.authToken);
                const tokenExpiry = userInfo.authToken.expires_in;
                if (tokenExpiry !== '') {
                    const refreshRequired =
                        Date.now / 1000 > tokenExpiry ? true : false;
                    if (refreshRequired)
                        refreshResult = await refreshToken(req);
                    if (refreshResult.status === 200) {
                        res.json({
                            status: 'success',
                            message: 'Successfully refreshed auth token',
                        });
                    }
                } else {
                    const authCode = await res.redirect(
                        'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22BC4H&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser%2Fconnecttracker&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800'
                    );
                    console.log(authCode, 'is blank');
                    const retrieveResult = await obtainToken(req);
                    res = retrieveResult;
                }
            } else {
                throw new Error('User not found');
            }
        } catch (err) {
            res.json({
                status: 'error',
                message: err.errors.message,
                data: err.errors.message,
            });
        }
    }
}
module.exports = { connectFitbit, checkOAuthTokenStatus };
