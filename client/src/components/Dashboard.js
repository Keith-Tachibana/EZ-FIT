import React, { useEffect, useState, useMemo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Switch, Route, useHistory } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Tooltip from '@material-ui/core/Tooltip';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { mainListItems } from './listItems';
import axios from 'axios';
import DashboardContent from './DashboardContent';
import PasswordForm from './PasswordForm';
import PersonalInfoForm from './PersonalInfoForm';
import FitbitConnection from './FitbitConnection';
import BodyStatusForm from './BodyStatusForm';
import Copyright from './Copyright';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));

function ThemeButton(props) {
    if (!props.prefersDarkMode) {
        return (
            <Tooltip title="Dark mode">
                <IconButton
                    color="inherit"
                    aria-label="Dark mode"
                    onClick={props.darkModeHandler}
                >
                    <Brightness4Icon />
                </IconButton>
            </Tooltip>
        );
    } else {
        return (
            <Tooltip title="Light mode">
                <IconButton
                    color="inherit"
                    aria-label="Light mode"
                    onClick={props.lightModeHandler}
                >
                    <Brightness7Icon />
                </IconButton>
            </Tooltip>
        );
    }
}

const getLocalDarkMode = () => {
    const prefersDarkMode = localStorage.getItem('prefersDarkMode');
    if (prefersDarkMode) {
        return JSON.parse(prefersDarkMode);
    } else {
        localStorage.setItem('prefersDarkMode', 'false');
        return false;
    }
};

export default function Dashboard(props) {
    const history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [prefersDarkMode, setPrefersDarkMode] = useState(getLocalDarkMode());

    const darkModeHandler = () => {
        setPrefersDarkMode(true);
    }

    const lightModeHandler = () => {
        setPrefersDarkMode(false);
    }

    useMemo(() => {
        props.setPrefersDarkMode(prefersDarkMode);
        localStorage.setItem('prefersDarkMode', prefersDarkMode.toString());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prefersDarkMode])

    const [name, setName] = useState(0);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const signout = () => {
        async function getSignout() {
            try {
                const res = await axios.get('/api/signout', { headers });
                if (res.data.status === 'success') {
                    localStorage.removeItem('access-token');
                    history.push('/');
                }
            } catch (err) {
                console.log(err.response);
            }
        }
        getSignout();
    };

    const headers = {
        'x-access-token': localStorage.getItem('access-token'),
    };

    useEffect(() => {
        if (!localStorage.getItem('access-token')) {
            history.push('/');
        }
        async function fetchName() {
            try {
                const res = await axios.get('/api/getname', { headers });
                // console.log(res);
                if (res.data.status === 'error') {
                    if (res.data.message === 'jwt expired') {
                        //pass
                    }
                    localStorage.removeItem('access-token');
                    history.push('/');
                } else if (res.data.status === 'success') {
                    const name = res.data.data;
                    setName(name.firstName);
                }
            } catch (err) {
                console.log(err.response);
            }
        }
        fetchName();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="absolute"
                className={clsx(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(
                            classes.menuButton,
                            open && classes.menuButtonHidden
                        )}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        {(name ? name + "'s " : '') + 'Dashboard'}
                    </Typography>
                    <ThemeButton prefersDarkMode={prefersDarkMode} darkModeHandler={darkModeHandler} lightModeHandler={lightModeHandler} />
                    <Tooltip title="Signout">
                        <IconButton
                            color="inherit"
                            aria-label="signout"
                            onClick={signout}
                        >
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(
                        classes.drawerPaper,
                        !open && classes.drawerPaperClose
                    ),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>{mainListItems}</List>
                <Divider />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Switch>
                    <Route path="/user/dashboard">
                        <DashboardContent prefersDarkMode={prefersDarkMode} />
                    </Route>
                    <Route
                        path="/user/updatebodystatus"
                        component={BodyStatusForm}
                    />
                    <Route path="/user/updatepersonalinfo">
                        <Container
                            maxWidth="lg"
                            spacing={2}
                            className={classes.container}
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={8}>
                                    <PersonalInfoForm />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <PasswordForm />
                                </Grid>
                            </Grid>
                        </Container>
                    </Route>
                    <Route path="/user/connecttracker">
                        <Container maxWidth="lg" className={classes.container}>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <FitbitConnection />
                                </Grid>
                            </Grid>
                        </Container>
                    </Route>
                </Switch>
                <Copyright />
            </main>
        </div>
    );
}
