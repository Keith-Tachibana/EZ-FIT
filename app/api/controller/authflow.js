const userModel = require('../models/users');
const axios = require('axios');
const qs = require('querystring');
const appConfig = require('../../../config/appConfig');
const clientId = appConfig.clientID;
const clientSecret = appConfig.clientSecret;
const encString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
);
async function revokeToken(req, res, next) {
    console.log('Did i revoke?');
    try {
        const userId = req.body.userId;
        if (userId) {
            const userInfo = await userModel.findById(userId);
            if (userInfo) {
                try {
                    const revokeResult = await axios.post(
                        'https://api.fitbit.com/oauth2/revoke',
                        qs.stringify({
                            token: userInfo.authToken.refresh_token,
                        }),
                        {
                            headers: {
                                'content-type':
                                    'application/x-www-form-urlencoded',
                                Authorization: `Basic ${encString}`,
                            },
                        }
                    );
                    if (revokeResult.status === 200) {
                        await userModel.updateOne(
                            { _id: req.body.userId },
                            {
                                $set: {
                                    authToken: {
                                        access_token: '',
                                        expires_in: '',
                                        refresh_token: '',
                                        scope: '',
                                        token_type: '',
                                        user_id: '',
                                    },
                                },
                            }
                        );
                        res.json({
                            status: 'success',
                            message: 'Revoked token successfully',
                        });
                    }
                    console.log('Revoking token', revokeResult);
                } catch (err) {
                    console.log(err.response.data.errors, 'checkhere');
                    if (err.response.status === 401) {
                        await userModel.updateOne(
                            { _id: req.body.userId },
                            {
                                $set: {
                                    authToken: {
                                        access_token: '',
                                        expires_in: '',
                                        refresh_token: '',
                                        scope: '',
                                        token_type: '',
                                        user_id: '',
                                    },
                                },
                            }
                        );
                        res.json({
                            status: 'success',
                            message: 'Revoked token successfully',
                        });
                    } else next(err);
                }
            }
        }
    } catch (err) {
        next(err);
    }
}
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
        console.log('Checking refresh result =', refreshResult.status);
        if (refreshResult.status === 200) {
            await storeToken(req.body.userId, refreshResult);
            return {
                status: 200,
            };
        } else {
            refreshResult.data.access_token = '';
            refreshResult.data.expires_in = 0;
            refreshResult.data.refresh_token = '';
            refreshResult.data.scope = '';
            refreshResult.data.token_type = '';
            refreshResult.data.userId = '';
            await storeToken(req.body.userId, refreshResult);
            return {
                status: refreshResult.status,
            };
        }
    } catch (err) {
        throw err;
    }
}

async function storeToken(userId, resp) {
    try {
        console.log('Expiration date is:', resp.data.expires_in);
        await userModel.updateOne(
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
        return {
            status: 'success',
            message: 'Token stored successfully',
        };
    } catch (err) {
        throw err;
    }
}

async function obtainToken(req, res, next) {
    try {
        const resp = await axios.post(
            'https://api.fitbit.com/oauth2/token',
            qs.stringify({
                grant_type: 'authorization_code',
                redirect_uri:
                    'http://localhost:3000/user/checkOAuthTokenStatus',
                code: req.body.code,
            }),
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' + encString,
                },
            }
        );
        console.log('Whatsup token', resp.statusText);
        if (resp.statusText === 'OK') {
            try {
                const respJson = await storeToken(req.body.userId, resp);
                console.log(respJson, 'Is what we are looking for');
                res.json(respJson);
            } catch (err) {
                next(err);
            }
        }
    } catch (err) {
        console.log(
            "Couldn't retrieve token from Fitbit: ",
            err.response.data.errors
        );
    }
}
function checkTokenValidity(userToken) {
    if (
        userToken === null ||
        userToken.access_token === null ||
        userToken.authToken === null ||
        userToken.refresh_token === null ||
        userToken.user_id === null
    )
        return false;
    return true;
}
async function checkOAuthTokenStatus(req, res, next) {
    const userId = req.body.userId;
    if (userId !== null) {
        try {
            const userInfo = await userModel.findById(userId);
            if (userInfo) {
                console.log('Hey token', userInfo.authToken);
                if (checkTokenValidity(userInfo.authToken) === false) {
                    return res.json({
                        status: 'fail',
                        message: 'Invalid token',
                    });
                }
                const tokenExpiry = userInfo.authToken.expires_in;
                if (tokenExpiry !== '') {
                    console.log('Entering expiry', tokenExpiry);
                    const refreshRequired =
                        Date.now() > tokenExpiry ? true : false;
                    console.log(
                        'Refresh req=',
                        Date.now(),
                        'versus',
                        tokenExpiry
                    );
                    if (refreshRequired) {
                        console.log('Entering refresh');
                        refreshResult = await refreshToken(req, userInfo);
                        if (refreshResult.status === 200) {
                            res.json({
                                status: 'success',
                                message:
                                    'Successfully refreshed auth token',
                            });
                        } else {
                            res.json({
                                status: 'fail',
                                message: "Token couldn't be refreshed",
                            });
                        }
                    } else {
                        console.log('Entering non-refresh');
                        res.json({
                            status: 'success',
                            message: 'Valid token present',
                        });
                    }
                } else {
                    console.log('Stage two');
                    res.json({
                        status: 'fail',
                        message: 'No token found',
                    });
                }
            } else {
                throw new Error('User not found');
            }
        } catch (err) {
            next(err);
        }
    }
}
module.exports = { checkOAuthTokenStatus, obtainToken, revokeToken };
