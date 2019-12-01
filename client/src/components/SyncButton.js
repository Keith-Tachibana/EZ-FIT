import React from 'react';
import { withStyles } from '@material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from '@material-ui/icons/Sync';
import SyncProblemIcon from '@material-ui/icons/SyncProblem';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';


const styles = {
    infiniteRotation: {
        animationName: '$rotation',
        animationDuration: '2s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
    },
    '@keyframes rotation': {
        '0%': {
            transform: 'rotate(0deg)'
        },
        '100%': {
            transform: 'rotate(359deg)'
        },
    },
};

function SyncButton(props) {
    if (!props.connectionStatus) {
        return(
            <Tooltip title="Not connected">
                <span>
                    <IconButton
                        color="inherit"
                        aria-label="not connected"
                        disabled
                    >
                        <SyncDisabledIcon />
                    </IconButton>
                </span>
            </Tooltip>
        );
        } else if (props.syncError) {
        return (
            <Tooltip title="Sync error">
                <IconButton
                    color="inherit"
                    aria-label="sync error"
                    onClick={props.onSyncButtonPress}
                >
                    <SyncProblemIcon />
                </IconButton>
            </Tooltip>
        );
        } else if (props.completed < 100) {
        return(
            <Tooltip title="Sync in progress">
            <span>
                <IconButton
                    color="inherit"
                    aria-label="sync"
                    disabled
                >
                    <SyncIcon className={props.classes.infiniteRotation} />
                </IconButton>
            </span>

            </Tooltip>
        );
        } else {
        return(
            <Tooltip title="Sync">
                <IconButton
                    color="inherit"
                    aria-label="sync"
                    onClick={props.onSyncButtonPress}
                >
                    <SyncIcon />
                </IconButton>
            </Tooltip>
        );
    }
}

export default withStyles(styles)(SyncButton);