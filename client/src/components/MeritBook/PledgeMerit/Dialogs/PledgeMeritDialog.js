import '../../MeritBook.css';
import { getDate, invalidSafariVersion } from 'helpers/functions.js';
import { CompletingTaskDialog } from 'helpers/loaders.js';
import API from 'api/API.js';

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

const checkboxStyle = {
  left: '50%',
  width: 'max-content',
  marginTop: '20px',
  transform: 'translateX(-130px)'
};

export default class PledgeMeritDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actives: [],
      selectedActives: [],
      description: '',
      date: new Date(),
      isChalkboard: false,
      isPCGreet: false,
      amount: 0,
      activeValidation: true,
      descriptionValidation: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (navigator.onLine && this.props !== nextProps) {
      API.getActivesForMerit(nextProps.state.displayName)
      .then((res) => {
        const actives = res.data;

        this.setState({ actives });
      });
    }
  }

  merit = (type) => {
    const { selectedActives } = this.state;
    let { description, amount } = this.state;
    let activeValidation = true;
    let descriptionValidation = true;

    if (typeof description === 'object') {
      description = description.title;
    }

    if (selectedActives.length === 0 || !description || description.length > 50 || amount === 0) {
      if (selectedActives.length === 0) {
        activeValidation = false;
      }
      if (!description || description.length > 50) {
        descriptionValidation = false;
      }

      this.setState({
        activeValidation,
        descriptionValidation
      });
    }
    else {
      const { displayName } = this.props.state;
      const { isChalkboard, isPCGreet } = this.state;
      let action = 'Merited';
      let date = this.formatDate(this.state.date);

      if (invalidSafariVersion()) {
        date = getDate();
      }
      if (type === 'demerit') {
        amount = -amount;
        action = 'Demerited';
      }
      if (isChalkboard) {
        description = `Chalkboard: ${description}`;
      }

      this.setState({
        openCompletingTask: true,
        completingTaskMessage: 'Meriting pledges...'
      });

      const merit = { description, amount, date };

      API.meritAsPledge(displayName, selectedActives, merit, isChalkboard, isPCGreet)
      .then(res => {
        const { name } = this.props.state;
        const totalAmount = amount * selectedActives.length;

        console.log(res);
        this.handleClose();
        this.setState({ openCompletingTask: false });

        API.sendPledgeMeritNotification(name, selectedActives, amount)
        .then(res => {
          this.props.handleRequestOpen(`${action} yourself ${totalAmount} merits`);
        })
        .catch(error => console.log(`Error: ${error}`));
      })
      .catch((error) => {
        console.log(error)
        const active = error.response.data;

        console.log(`Not enough merits for ${active}`);
        this.handleClose();
        this.setState({ openCompletingTask: false });
        this.props.handleRequestOpen(`${active} does not have enough merits`);
      });
    }
  }

  formatDate(date) {
    return date.toLocaleDateString([], {month: '2-digit', day: '2-digit'});
  }

  disableDates(date) {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 3, 12);

    return date > today || date < startDate;
  }

  handleChange = (label, newValue) => {
    const validationLabel = [label] + 'Validation';
    let value = newValue;
    let { amount } = this.state;

    switch (label) {
      case 'amount':
        value = parseInt(newValue, 10);
        break;
      case 'isAlumni':
        const { displayName } = this.props.state;
        let actives;

        if (newValue === true) {
          API.getAlumniForMerit(displayName)
          .then((res) => {
            actives = res.data;

            this.setState({
              actives,
              selectedActives: []
            });
          });
        }
        else {
          API.getActivesForMerit(displayName)
          .then((res) => {
            actives = res.data;

            this.setState({
              actives,
              selectedActives: []
            });
          });
        }
        break;
      case 'isChalkboard':
        if (newValue === true) {
          const { name } = this.props.state.name;

          API.getChalkboardsForMerit(name)
          .then((res) => {
            const chalkboards = res.data;

            this.setState({
              chalkboards,
              description: '',
              isPCGreet: false
            });
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          })
        }
        else {
          const maxAmount = 50;

          if (amount > maxAmount) {
            amount = maxAmount;
          }

          this.setState({
            amount,
            description: ''
          });
        }
        break;
      case 'description':
        if (this.state.isChalkboard) {
          value = newValue;
          amount = newValue.amount;

          this.setState({ amount });
        }
        break;
      case 'isPCGreet':
        this.setState({
          amount: 5,
          isChalkboard: false
        });
        break;
      default:
    }

    this.setState({
      [label]: value,
      [validationLabel]: true
    });
  }

  handleClose = () => {
    this.props.handleMeritClose();

    this.setState({
      selectedActives: [],
      description: '',
      date: new Date(),
      isChalkboard: false,
      amount: 0,
      chalkboards: null,
      activeValidation: true,
      descriptionValidation: true
    });
  }

  render() {
    let maxAmount = 50;
    let selectLabel = 'Active Name';

    if (this.state.isChalkboard) {
      maxAmount = 100;
    }
    if (this.state.isAlumni) {
      selectLabel = 'Alumni Name';
    }

    const actions = [
      <FlatButton
        label="Demerit"
        primary={true}
        onClick={() => this.merit('demerit')}
      />,
      <FlatButton
        label="Merit"
        primary={true}
        onClick={() => this.merit('merit')}
      />,
    ];

    return (
      <Dialog
        title="Merit"
        titleClassName="garnett-dialog-title"
        actions={actions}
        modal={false}
        bodyClassName="garnett-dialog-body"
        contentClassName="garnett-dialog-content"
        open={this.props.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <SelectField
          className="garnett-input"
          value={this.state.selectedActives}
          floatingLabelText={selectLabel}
          multiple={true}
          onChange={(e, key, newValue) => this.handleChange('selectedActives', newValue)}
          errorText={!this.state.activeValidation && 'Please select an active.'}
        >
          {this.state.actives.map((active, i) => (
            <MenuItem
              key={i}
              value={active}
              primaryText={active.label}
              insetChildren
              checked={
                this.state.selectedActives && 
                this.state.selectedActives.indexOf(active) > -1
              }
            />
          ))}
        </SelectField>

        <Checkbox
          style={checkboxStyle}
          label="Alumni"
          checked={this.state.isAlumni}
          onCheck={(e, newValue) => this.handleChange('isAlumni', newValue)}
        />

        {this.state.isChalkboard ? (
          <SelectField
            className="garnett-input"
            value={this.state.description}
            floatingLabelText="Chalkboard Title"
            maxHeight={345}
            onChange={(e, key, newValue) => this.handleChange('description', newValue)}
            errorText={!this.state.descriptionValidation && 'Please select a chalkboard.'}
          >
            {this.state.chalkboards && (
              this.state.chalkboards.map((chalkboard, i) => (
                <MenuItem
                  key={i}
                  value={chalkboard}
                  primaryText={chalkboard.title}
                  insetChildren
                  checked={chalkboard === this.state.description}
                />
              ))
            )}
          </SelectField>
        ) : (
          <TextField
            className="garnett-input"
            type="text"
            floatingLabelText="Description"
            multiLine={true}
            rowsMax={3}
            value={this.state.description}
            onChange={(e, newValue) => this.handleChange('description', newValue)}
            errorText={!this.state.descriptionValidation && 'Enter a description less than 50 characters.'}
          />
        )}

        {!invalidSafariVersion() && (
          <DatePicker
            className="garnett-input"
            textFieldStyle={{display:'block',margin:'0 auto'}}
            floatingLabelText="Date"
            value={this.state.date}
            disableYearSelection
            firstDayOfWeek={0}
            formatDate={this.formatDate}
            shouldDisableDate={this.disableDates}
            onChange={(e, newValue) => this.handleChange('date', newValue)}
          />
        )}

        <div style={{width:'256px',margin:'20px auto 0'}}>
          <span>
            Amount: {this.state.amount} merits
          </span>
          <Slider
            sliderStyle={{marginBottom:0}}
            name="Amount"
            min={0}
            max={maxAmount}
            step={5}
            value={this.state.amount}
            disabled={this.state.isPCGreet}
            onChange={(e, newValue) => this.handleChange('amount', newValue)}
          />
        </div>
        <Checkbox
          style={checkboxStyle}
          label="Chalkboard"
          checked={this.state.isChalkboard}
          onCheck={(e, newValue) => this.handleChange('isChalkboard', newValue)}
        />
        <Checkbox
          style={checkboxStyle}
          label="PC Greet"
          checked={this.state.isPCGreet}
          onCheck={(e, newValue) => this.handleChange('isPCGreet', newValue)}
        />

        <div id="remaining-merits">
          {this.state.selectedActives.map((active, i) => (
            <p key={i}> Merits remaining for {active.label}: {active.meritsRemaining} </p>
          ))}
        </div>

        {this.state.openCompletingTask &&
          <CompletingTaskDialog
            open={this.state.openCompletingTask}
            message={this.state.completingTaskMessage}
          />
        }
      </Dialog>
    )
  }
}
