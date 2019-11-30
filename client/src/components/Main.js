import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SideImagePane from './SideImagePane'
import User from './User'
import PasswordResetForm from './PasswordResetForm'

export default function Main() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'light' : 'light'
          // type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <main>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path='/'>
              <Redirect to='/signin' />
            </Route>
            <Route path='/signin' component={SideImagePane}/>
            <Route path='/register' component={SideImagePane}/>
            <Route path='/verify' component={SideImagePane}/>
            <Route path='/forgetpassword' component={SideImagePane}/>
            <Route path='/resetpassword' component={PasswordResetForm}/>
            <Route path='/user'>
              <User prefersDarkMode={prefersDarkMode} />
            </Route>
          </Switch>
        </ThemeProvider>
      </main>
  )
}