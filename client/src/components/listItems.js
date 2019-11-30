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
    <ListItem button component={Link} to="/user/dashboard">
      <ListItemIcon>
        <Tooltip title="Dashboard">
          <DashboardIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button component={Link} to="/user/updatebodystatus">
      <ListItemIcon>
        <Tooltip title="Body Status">
          <AccessibilityNewIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Body Status" />
    </ListItem>
    <ListItem button component={Link} to="/user/updatepersonalinfo">
      <ListItemIcon>
        <Tooltip title="Personal Info">
          <AccountBoxIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Personal Info" />
    </ListItem>
    <ListItem button component={Link} to="/user/connecttracker">
      <ListItemIcon>
        <Tooltip title="Connect Tracker">
          <LinkIcon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary="Connect Tracker" />
    </ListItem>
  </div>
);
