import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LinkIcon from '@material-ui/icons/Link';
import { Link } from "react-router-dom";
import { Icon } from '@material-ui/core';


const FitbitIcon = () => {
  return (
    <Icon>
      <img src="/Fitbit_app_icon.png" height={24} width={24} alt="Fitbit icon"/>
    </Icon>
  );
};

export const mainListItems = (
  <div>
    <ListItem button component={Link} to="/user/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button component={Link} to="/user/updatepersonalinfo">
      <ListItemIcon>
        <AccountBoxIcon />
      </ListItemIcon>
      <ListItemText primary="Personal Info" />
    </ListItem>
    <ListItem button component={Link} to="/user/connecttracker">
      <ListItemIcon>
          <LinkIcon />
      </ListItemIcon>
      <ListItemText primary="Connect Tracker" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    {/* <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem> */}
  </div>
);
