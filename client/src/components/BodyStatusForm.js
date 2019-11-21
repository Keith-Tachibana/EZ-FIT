import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  CardHeader,
  Divider,
  Container,
  Grid,
  IconButton,
} from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

const Link1 = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const useStyles = makeStyles(theme => ({
  root: {},
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  submit: {}
}));

export default function BodyStatusForm(props){
   const classes = useStyles();

  const [values, setValues] = useState({
    head: '',
    arms: '',
    legs: '',
  });

  useEffect(() => {
    //TODO get body status

  }, []);

  const handleChange = name => event => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };


  const submitHandler = e => {
    e.preventDefault();
    //TODO update body status

  };

  return (
    <Container maxWidth="sm">
      <Card className={classes.root}>
        <form
          className={classes.form}
          onSubmit={submitHandler}
          action="updateBodyStatus"
          method="post"
          noValidate
        >
          <CardHeader title="Body Status" subheader="Update body status" />
          <Divider />
          <CardContent>
          <Grid container spacing = {2}>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="name-native-error">Head</InputLabel>
                  <NativeSelect
                    value={values.head}
                    onChange={handleChange('head')}
                    name="head"
                    inputProps={{
                      id: 'name-native-error',
                    }}
                  >
                    <option value="" />
                    <option value="normal">Normal</option>
                    <option value="light">Light</option>
                    <option value="severe">Severe</option>
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="name-native-error">Arms</InputLabel>
                  <NativeSelect
                    value={values.arms}
                    onChange={handleChange('arms')}
                    name="arms"
                    inputProps={{
                      id: 'name-native-error',
                    }}
                  >
                    <option value="" />
                    <option value="normal">Normal</option>
                    <option value="light">Light</option>
                    <option value="severe">Severe</option>
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="name-native-error">Legs</InputLabel>
                  <NativeSelect
                    value={values.legs}
                    onChange={handleChange('legs')}
                    name="legs"
                    inputProps={{
                      id: 'name-native-error',
                    }}
                  >
                    <option value="" />
                    <option value="normal">Normal</option>
                    <option value="light">Light</option>
                    <option value="severe">Severe</option>
                  </NativeSelect>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <img src='/body_outline.png' alt='body outline' height={240}/>
            </Grid>
          </Grid>
          <Typography id="Description" variant="subtitle1" display="inline">
              Normal: Body part is fine.
              <br/>
              Light: Strains, Sprains, Cramps.
              <br/>
              Severe: Broken Bones, Unusable.
          </Typography>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={classes.submit}
            >
              Update
            </Button>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
}
