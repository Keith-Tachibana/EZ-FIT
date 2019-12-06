const userModel = require('../models/users');
const axios = require('axios');
const qs = require('querystring');
const appConfig = require('../../../config/appConfig');
const clientId = appConfig.clientID;
const clientSecret = appConfig.clientSecret;
const encString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

async function revokeToken(req, res, next) {
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
                } catch (err) {
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
                    } else {
                        console.log(
                            err.response.data.errors,
                            'Logging error message'
                        );
                        next(err);
                    }
                }
            }
        }
    } catch (err) {
        next(err);
    }
}
async function refreshToken(userInfo) {
    try {
        // console.log(userInfo.authToken);
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
        await storeToken(userInfo._id, refreshResult);
        return {
            status: 200,
        };
    } catch (err) {
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            if (err.response.status === 400 || err.respponse.status === 401) {
                console.log(err.response.data.errors);
                err.response.data.access_token = '';
                err.response.data.expires_in = 0;
                err.response.data.refresh_token = '';
                err.response.data.scope = '';
                err.response.data.token_type = '';
                err.response.data.userId = '';
                await storeToken(userInfo._id, err.response);
                return {
                    status: err.response.status,
                };
            }
        } else if (err.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(err.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
        }
        throw err;
    }
}

async function storeToken(userId, resp) {
    try {
        await userModel.updateOne(
            {
                _id: userId,
            },
            {
                $set: {
                    authToken: {
                        access_token: resp.data.access_token,
                        expires_in: Date.now() + resp.data.expires_in * 1000,
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
        if (resp.statusText === 'OK') {
            try {
                const respJson = await storeToken(req.body.userId, resp);
                res.json(respJson);
            } catch (err) {
                next(err);
            }
        } else {
            res.json({
                status: 'fail',
                message: resp.statusText,
                data: resp,
            });
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
        userToken.user_id === null ||
        userToken.access_token === '' ||
        userToken.authToken === '' ||
        userToken.refresh_token === '' ||
        userToken.user_id === ''
    )
        return false;
    return true;
}
async function checkTokenExpiry(tokenExpiry, userInfo, res) {
    const refreshRequired = Date.now() > tokenExpiry ? true : false;
    if (refreshRequired) {
        refreshResult = await refreshToken(userInfo);
        if (refreshResult.status === 200) {
            res.json({
                status: 'success',
                message: 'Successfully refreshed auth token',
            });
        } else {
            res.json({
                status: 'fail',
                message: "Token couldn't be refreshed",
                data: refreshResult,
            });
        }
    } else {
        res.json({
            status: 'success',
            message: 'Valid token present',
        });
    }
}
async function checkOAuthTokenStatus(req, res, next) {
    const userId = req.body.userId;
    if (userId !== null) {
        try {
            const userInfo = await userModel.findById(userId);
            if (userInfo) {
                if (checkTokenValidity(userInfo.authToken) === false) {
                    return res.json({
                        status: 'fail',
                        message: 'Invalid token',
                    });
                }
                const tokenExpiry = userInfo.authToken.expires_in;
                if (tokenExpiry !== 0) {
                    await checkTokenExpiry(tokenExpiry, userInfo, res);
                    return res;
                } else {
                    res.json({
                        status: 'fail',
                        message: 'No token found',
                    });
                }
            } else {
                throw new Error('User not found');
            }
        } catch (err) {
            console.log(err.message);
            next(err);
        }
    }
}

module.exports = {
    checkOAuthTokenStatus,
    obtainToken,
    revokeToken,
    refreshToken,
    checkTokenExpiry,
    checkTokenValidity,
};
