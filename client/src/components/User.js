import React from 'react'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'
import Dashboard from './Dashboard'

export default function User(props) {
    let match = useRouteMatch();
    return (
        <main>
            <Switch>
                <Route exact path={`${match.path}`}>
                    <Redirect to={`${match.path}/dashboard`} />
                </Route>
                <Route path={`${match.path}`}>
                    <Dashboard />
                </Route>
            </Switch>
        </main>
    );
};