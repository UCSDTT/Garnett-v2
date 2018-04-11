import API from "../../../api/API.js";

import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class EditChalkboardDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      date: null,
      time: null,
      location: '',
      timeCommitment: 0,
      amount: 0,
      descriptionValidation: true,
      dateValidation: true,
      timeValidation: true,
      locationValidation: true,
      timeCommitmentValidation: true
    };
  }

  // Updates the state based on the selected chalkboard
  componentWillReceiveProps(nextProps) {
    let year = new Date().getFullYear();
    let date = new Date(nextProps.chalkboard.date);
    date.setYear(year);
    let time = new Date();
    let parsedTime = nextProps.chalkboard.time;
    time.setHours(parsedTime.substr(0, parsedTime.indexOf(":")));
    time.setMinutes(parsedTime.substr(parsedTime.indexOf(":") + 1, parsedTime.indexOf(":") + 1));

    this.setState({
      description: nextProps.chalkboard.description,
      date: date,
      time: time,
      location: nextProps.chalkboard.location,
      timeCommitment: nextProps.chalkboard.timeCommitment,
      amount: nextProps.chalkboard.amount
    });
  }

  editChalkboard = () => {
    let displayName = this.props.state.displayName;
    let chalkboard = this.props.chalkboard;
    let description = this.state.description;
    let date = this.state.date;
    let time = this.state.time;
    let location = this.state.location;
    let timeCommitment = this.state.timeCommitment;
    let amount = this.state.amount;
    let descriptionValidation = true;
    let dateValidation = true;
    let timeValidation = true;
    let locationValidation = true;
    let timeCommitmentValidation = true;

    if (!description || !date || !time || !location || timeCommitment === 0 || amount === 0) {
      if (!description) {
        descriptionValidation = false;
      }
      if (!date) {
        dateValidation = false;
      }
      if (!time) {
        timeValidation = false;
      }
      if (!location) {
        locationValidation = false;
      }
      if (timeCommitment === 0) {
        timeCommitmentValidation = false;
      }

      this.setState({
        descriptionValidation: descriptionValidation,
        dateValidation: dateValidation,
        timeValidation: timeValidation,
        locationValidation: locationValidation,
        timeCommitmentValidation: timeCommitmentValidation
      });
    }
    else {
      let parsedDate = date.toLocaleDateString([], {month: '2-digit', day: '2-digit'});
      let parsedTime = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      API.editChalkboard(displayName, chalkboard, description, parsedDate, parsedTime, location, timeCommitment, amount)
      .then((res) => {
        console.log('Edited chalkboard');
        this.props.updateChalkboardInfo();
        this.handleClose();
        this.props.handleRequestOpen('Edited chalkboard');
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.handleClose();
        this.props.handleRequestOpen('Error editing chalkboard');
      });
    }
  }

  formatDate(date) {
    return date.toLocaleDateString([], {month: '2-digit', day: '2-digit'});
  }

  disableDates(date) {
    let today = new Date();
    return today > date;
  }

  handleChange = (label, value) => {
    let newValue = value;
    let validationLabel = [label] + 'Validation';

    if (label === 'timeCommitment') {
      let oldValue = value.substring(0, value.indexOf(' '));
      newValue = value.substring(value.indexOf('s') + 1);

      if (!newValue) {
        newValue = 0;
      }
      else if (value.indexOf('s') === -1) {
        newValue = parseInt(oldValue.slice(0, -1), 10);

        if (!newValue) {
          newValue = 0;
        }
      }
      else {
        newValue = parseInt(oldValue + newValue, 10);
      }
    }

    this.setState({
      [label]: newValue,
      [validationLabel]: true
    });
  }

  handleClose = () => {
    this.props.handleClose();

    this.setState({
      description: '',
      date: null,
      time: null,
      location: '',
      timeCommitment: 0,
      amount: 0,
      descriptionValidation: true,
      dateValidation: true,
      timeValidation: true,
      locationValidation: true,
      timeCommitmentValidation: true
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Update"
        primary={true}
        onClick={this.editChalkboard}
      />,
    ];

    return (
      <Dialog
        title="Edit Chalkboard"
        titleClassName="garnett-dialog-title"
        actions={actions}
        modal={false}
        bodyClassName="garnett-dialog-body"
        contentClassName="garnett-dialog-content"
        open={this.props.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <TextField
          className="garnett-input"
          type="text"
          floatingLabelText="Description"
          multiLine={true}
          rowsMax={3}
          value={this.state.description}
          onChange={(e, newValue) => this.handleChange('description', newValue)}
          errorText={!this.state.descriptionValidation && 'Enter a description.'}
        />
        <DatePicker
          className="garnett-input"
          floatingLabelText="Date"
          value={this.state.date}
          disableYearSelection
          firstDayOfWeek={0}
          formatDate={this.formatDate}
          shouldDisableDate={this.disableDates}
          onChange={(e, newValue) => this.handleChange('date', newValue)}
          errorText={!this.state.dateValidation && 'Select a date.'}
        />
        <TimePicker
          className="garnett-input"
          textFieldStyle={{'display': 'block'}}
          floatingLabelText="Time"
          value={this.state.time}
          minutesStep={5}
          onChange={(e, newValue) => this.handleChange('time', newValue)}
          errorText={!this.state.timeValidation && 'Enter a time.'}
        />
        <TextField
          className="garnett-input"
          type="text"
          floatingLabelText="Location"
          multiLine={true}
          rowsMax={3}
          value={this.state.location}
          onChange={(e, newValue) => this.handleChange('location', newValue)}
          errorText={!this.state.locationValidation && 'Enter a location.'}
        />
        <TextField
          className="garnett-input"
          type="number"
          min={0}
          floatingLabelText="Time Commitment"
          multiLine={true}
          rowsMax={3}
          value={this.state.timeCommitment + ' hours'}
          onChange={(e, newValue) => this.handleChange('timeCommitment', newValue)}
          errorText={!this.state.timeCommitmentValidation && 'Enter a time commitment.'}
        />
        <div style={{width:'256px',margin:'20px auto 0'}}>
          <span>
            Amount: {this.state.amount}
          </span>
          <Slider
            sliderStyle={{marginBottom:0}}
            name="Amount"
            min={0}
            max={100}
            step={5}
            value={this.state.amount}
            onChange={(e, newValue) => this.handleChange('amount', newValue)}
          />
        </div>
      </Dialog>
    )
  }
}
