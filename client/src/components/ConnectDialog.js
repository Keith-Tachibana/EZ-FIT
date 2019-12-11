import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useHistory } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConnectDialog (props) {
    const history = useHistory();

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(!props.connection)
    }, [props.connection]);

    const handleClose = () => {
        setOpen(false);
    };
  
    const handleConnect = () => {
        history.push('/user/connecttracker')
    };

    return (
        <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">
                {"Connect Fitbit account"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Connect Fitbit account to sync data to the dashboard.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConnect} color="primary"> 
                    Connect
                </Button>
            </DialogActions>
        </Dialog>
    );
}