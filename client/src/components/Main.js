import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import SideImagePane from './SideImagePane'
import User from './User'
import PasswordResetForm from './PasswordResetForm'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/'>
        <Redirect to='/signin' />
      </Route>
      <Route path='/signin' component={SideImagePane}/>
      <Route path='/register' component={SideImagePane}/>
      <Route path='/verify' component={SideImagePane}/>
      <Route path='/forgetpassword' component={SideImagePane}/>
      <Route path='/resetpassword' component={PasswordResetForm}/>
      <Route path='/user' component={User}/>
    </Switch>
  </main>
)

export default Main