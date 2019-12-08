import React, { useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SideImagePane from './SideImagePane'
import User from './User'
import PasswordResetForm from './PasswordResetForm'

const getLocalDarkMode = () => {
  const prefersDarkMode = localStorage.getItem('prefersDarkMode');
  if (prefersDarkMode) {
    return JSON.parse(prefersDarkMode);
  } else {
    localStorage.setItem('prefersDarkMode', 'false');
    return false;
  }
};

export default function Main() {
  const [prefersDarkMode, setPrefersDarkMode] = useState(getLocalDarkMode());

  const theme = React.useMemo(() =>
    createMuiTheme({
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
      },
    }), [prefersDarkMode],
  );

  return (
    <main>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/signin' />
          </Route>
          <Route path='/signin' component={SideImagePane} />
          <Route path='/register' component={SideImagePane} />
          <Route path='/verify' component={SideImagePane} />
          <Route path='/forgetpassword' component={SideImagePane} />
          <Route path='/tos' component={SideImagePane} />
          <Route path='/policy' component={SideImagePane} />
          <Route path='/resetpassword' component={PasswordResetForm} />
          <Route path='/user'>
            <User setPrefersDarkMode={setPrefersDarkMode} />
          </Route>
        </Switch>
      </ThemeProvider>
    </main>
  )
}