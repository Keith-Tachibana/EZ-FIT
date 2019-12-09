import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Link from "@material-ui/core/Link";
import { Typography, ListItemText } from '@material-ui/core';


export default function WorkoutDialog(props) {
    const handleClose = () => {
        props.handleClose();
    };

    return (
        <Dialog
            open={props.open}
            keepMounted
            onClose={handleClose}
            fullWidth={true}
            maxWidth='sm'
            aria-labelledby="workout-dialog-title"
            aria-describedby="workout-dialog-description"
        >
            <DialogTitle id="workout-dialog-title" onClose={handleClose}>
                {props.name}
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText id="alert-dialog-slide-description" component={'span'}>
                    <List>
                        {props.exercises.map((exerciseObj, index) => {
                            return (
                                <ListItem key={index}>
                                    <ListItemText
                                        disableTypography
                                        primary={
                                            <span>
                                                <Typography component='span' color='textPrimary'>
                                                    {`Exercise: `}
                                                </Typography>
                                                <Link href={exerciseObj['exercise'].url} target="_blank" rel="noopener">
                                                    {exerciseObj['exercise'].name}
                                                </Link>
                                                <br />
                                            </span>
                                        }
                                        secondary={
                                            <Typography component='span' color='textSecondary' variant='subtitle2'>
                                                {`Duration: ${exerciseObj['exercise'].duration}`}
                                            </Typography>
                                        } />
                                    {/* <span>{'Exercise: '}
                                        <Link href={exerciseObj['exercise'].url} target="_blank" rel="noopener" component={'span'}>
                                            {exerciseObj['exercise'].name}
                                        </Link>
                                        <br />
                                        <Typography component={'span'}>
                                            Duration: {exerciseObj['exercise'].duration}
                                        </Typography>
                                    </span> */}
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                    Close
                 </Button>
            </DialogActions>
        </Dialog>
    );
}