import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import LinkIcon from '@material-ui/icons/Link';
import { Link } from "react-router-dom";
import { Tooltip } from '@material-ui/core';

export const mainListItems = (
  <div>
    <ListItem id='dashboardButton' button component={Link} to="/user/dashboard">
      <ListItemIcon id='dashboardIcon'>
        <Tooltip title="Dashboard">
          <DashboardIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem id='bodyStatusButton' button component={Link} to="/user/updatebodystatus">
      <ListItemIcon id='bodyStatusIcon'>
        <Tooltip title="Body Status">
          <AccessibilityNewIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Body Status" />
    </ListItem>
    <ListItem id='personalInfoButton' button component={Link} to="/user/updatepersonalinfo">
      <ListItemIcon id='personalInfoIcon'>
        <Tooltip title="Personal Info">
          <AccountBoxIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Personal Info" />
    </ListItem>
    <ListItem id='connectTrackerButton' button component={Link} to="/user/connecttracker">
      <ListItemIcon id='connectTrackerIcon'>
        <Tooltip title="Connect Tracker">
          <LinkIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Connect Tracker" />
    </ListItem>
  </div>
);
