import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


export default function Workout(props) {

    const handleClickOpen = () => {
    };

    return (
        <Card>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    {props.day}
                </Typography>
                <Typography variant="body2" color={props.name === 'Rest' ? 'secondary' : ''} style={{ minHeight: 40 }}>
                    {props.name}
                </Typography>
            </CardContent>
            <CardActions style={{ visibility: props.name === 'Rest' ? 'hidden' : '' }}>
                <Button size="small" onClick={handleClickOpen}>View workout</Button>
            </CardActions>
        </Card >
    );
}