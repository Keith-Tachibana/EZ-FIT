import React from 'react'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'
import Dashboard from './Dashboard'

const User = () => {
    let match = useRouteMatch();
    return (
        <main>
            <Switch>
                <Route exact path={`${match.path}`}>
                    <Redirect to={`${match.path}/dashboard`} />
                </Route>
                <Route path={`${match.path}`} component={Dashboard}/>
            </Switch>
        </main>
    );
};

export default User