import React from 'react'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'
import Dashboard from './Dashboard'
import PasswordForm from './PasswordForm'
import PersonalInfoForm from './PersonalInfoForm'

const User = () => {
    let match = useRouteMatch();
    return (
        <main>
            <Switch>
                <Route exact path={`${match.path}`}>
                    <Redirect to={`${match.path}/dashboard`} />
                </Route>
                <Route path={`${match.path}/dashboard`} component={Dashboard}/>
                <Route path={`${match.path}/updatepersonalinfo`} component={Dashboard}/>
            </Switch>
        </main>
    );
};

export default User