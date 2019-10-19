import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import SignInSide from './SignInSide'
import SignUp from './SignUp'
import User from './User'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/'>
        <Redirect to='/signin' />
      </Route>
      <Route path='/signin' component={SignInSide}/>
      <Route path='/register' component={SignUp}/>
      <Route path='/user' component={User}/>
    </Switch>
  </main>
)

export default Main