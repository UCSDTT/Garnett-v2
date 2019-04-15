// @flow

import { PLEDGING_START_DATE, PLEDGING_END_DATE } from 'helpers/constants';
import { getToday, formatDate } from 'helpers/functions';
import { SpinnerDialog } from 'helpers/loaders';
import API from 'api/API.js';
import { MeritDialogList, SelectedUsersChips } from 'components';
import type { User, MeritType } from 'api/models';

import React, { Component, type Node } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

type Props = {
  state: User,
  type: MeritType,
  amount: number,
  description: string,
  handleClose: () => void,
  handleRequestOpen: () => void
};

type State = {
  users: ?Array<User>,
  filteredUsers: ?Array<User>,
  selectedUsers: Array<User>,
  name: string,
  description: string,
  date: Date,
  showOverlay: boolean,
  showAlumni: boolean,
  openSpinner: boolean,
  spinnerMessage: string
};

export class SelectUsers extends Component<Props, State> {
  state = {
    users: null,
    filteredUsers: null,
    selectedUsers: [],
    name: '',
    description: this.props.description,
    date: new Date(),
    showOverlay: false,
    showAlumni: false,
    openSpinner: false,
    spinnerMessage: ''
  };

  componentDidMount() {
    const { status, displayName } = this.props.state;
    if (status === 'pledge') {
      API.getActivesForMeritMobile(displayName)
      .then((res) => {
        const users = res.data;
        this.setState({ users, filteredUsers: users });
      });
    } else {
      API.getPledgesForMeritMobile(displayName)
      .then((res) => {
        const users = res.data;
        this.setState({ users, filteredUsers: users });
      });
    }
  }

  get header(): Node {
    const { status } = this.props.state;
    const { selectedUsers, name, description, showOverlay } = this.state;
    const isPledge = status === 'pledge';
    return (
      <div id="merit-inputs-container">
        <div className="merit-input">
          <SelectedUsersChips
            selectedUsers={selectedUsers}
            deselectUser={this.deselectUser}
          />
          <div id="select-name-container">
            <input
              className="merit-input name"
              type="text"
              placeholder="Name"
              autoComplete="off"
              onChange={this.setName}
              onKeyDown={this.onNameKeyDown}
              value={name}
            />
            {!isPledge && !name && selectedUsers.length === 0 ? (
              <span id="mobile-select-all-pledges" onClick={this.selectAllPledges}>
                Select all pledges
              </span>
            ) : (
              <span
                id="clear-input"
                className={`${!name && 'hidden'}`}
                onClick={this.clearName}
              >
                &times;
              </span>
            )}
          </div>
        </div>
        <label htmlFor="description" className="merit-input description">
          { this.props.type === 'chalkboard' && 'Chalkboard:\xa0' }
          <input
            id="description"
            className="merit-input"
            type="text"
            placeholder="Description"
            autoComplete="off"
            value={description}
            disabled={this.props.type === 'standardized'}
            onChange={this.setDescription}
          />
        </label>
        <DayPickerInput
          value={this.state.date}
          formatDate={formatDate}
          placeholder={getToday()}
          onDayChange={this.setDate}
          onDayPickerShow={this.showOverlay}
          onDayPickerHide={this.hideOverlay}
          inputProps={{ readOnly: true }}
          dayPickerProps={{
            selectedDays: this.state.date,
            fromMonth: PLEDGING_START_DATE,
            toMonth: PLEDGING_END_DATE,
            disabledDays: [{
              after: new Date(),
              before: PLEDGING_START_DATE
            }]
          }}
        />
        <div
          id="date-picker-overlay"
          className={`${showOverlay ? '' : 'hidden'}`}
        />
      </div>
    )
  }

  get remainingUsers(): Array<User> {
    const { users, selectedUsers } = this.state;
    if (!users) {
      return;
    } else if (selectedUsers.length === 0) {
      return users;
    } else {
      const remainingUsers = [];
      // Add the remaining users to an array
      users.forEach((user) => {
        if (!selectedUsers.includes(user)) {
          remainingUsers.push(user);
        }
      });
      return remainingUsers;
    }
  }

  get buttonDisabled(): boolean {
    return !this.state.selectedUsers.length || !this.state.description;
  }

  setName = (event: SyntheticEvent<>) => {
    const name = event.target.value;
    let result = [];

    // If searched name is empty, return the remaining users
    if (name === '') {
      result = this.remainingUsers;
    } else {
      this.remainingUsers.forEach((user) => {
        const userName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (userName.startsWith(name.toLowerCase())) {
          result.push(user);
        }
      });
    }

    this.setState({ filteredUsers: result, name });
  }

  clearName = () => {
    this.setState({ filteredUsers: this.remainingUsers, name: '' });
  }

  setDescription = (event: SyntheticEvent<>) => {
    const description = event.target.value;
    this.setState({ description });
  }

  onNameKeyDown = (event: SyntheticEvent<>) => {
    const { selectedUsers, name } = this.state;
    const { keyCode } = event;
    // Remove last selected active if no name input exists and
    // there are selected users
    if ((keyCode === 8 || keyCode === 46) && !name && selectedUsers.length > 0) {
      const removedUser = selectedUsers.pop();
      const filteredUsers = this.addAndSortDeselectedUser(removedUser);
      this.setState({ filteredUsers, selectedUsers });
    }
  }

  setDate = (date: Date) => this.setState({ date });

  showOverlay = () => this.setState({ showOverlay: true });
  hideOverlay = () => this.setState({ showOverlay: false });

  selectUser = (user: User) => {
    // Only allow selection if active has enough merits
    if (this.props.amount <= user.remainingMerits) {
      const { selectedUsers } = this.state;
      const filteredUsers = this.remainingUsers.filter((currentUser) => {
        const userDisplayName = user.firstName + user.lastName;
        const currentUserName = currentUser.firstName + currentUser.lastName;
        return userDisplayName !== currentUserName;
      });
      selectedUsers.push(user);
      this.setState({ filteredUsers, selectedUsers, name: '' });
    } else {
      const userName = `${user.firstName} ${user.lastName}`;
      this.props.handleRequestOpen(`Not enough merits for ${userName}.`);
    }
  }

  selectAllPledges = () => {
    const { users } = this.state;
    if (this.props.state.status !== 'pledge' && users) {
      this.setState({ selectedUsers: users, filteredUsers: [] });
    }
  }

  deselectUser = (user: User) => {
    const filteredUsers = this.addAndSortDeselectedUser(user);
    let { selectedUsers } = this.state;

    selectedUsers = selectedUsers.filter((currentUser) => {
      return currentUser !== user;
    });

    this.setState({ filteredUsers, selectedUsers });
  }

  // Add the deselected user to the list if their name matches searched name
  addAndSortDeselectedUser(user: User): Array<Users> {
    const { filteredUsers, name } = this.state;
    const userName = `${user.firstName} ${user.lastName}`.toLowerCase();
    if (userName.startsWith(name.toLowerCase())) {
      filteredUsers.push(user);
      filteredUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));
    }
    return filteredUsers;
  }

  toggleAlumniView = () => {
    const { displayName } = this.props.state;
    const { showAlumni } = this.state;

    // Show spinner while loading users
    this.setState({ filteredUsers: null });

    API.getActivesForMeritMobile(displayName, !showAlumni)
    .then((res) => {
      const users = res.data;
      this.setState({
        users,
        filteredUsers: users,
        selectedUsers: [],
        showAlumni: !showAlumni
      });
    });
  }

  merit = () => {
    const { state, type, amount } = this.props;
    const { selectedUsers } = this.state;
    const {
      displayName,
      name,
      photoURL,
      status
    } = state;
    const action = amount > 0 ? 'Merited' : 'Demerited';
    let { description, date } = this.state;

    // Convert date to timestamp so we can order merits
    date = date.getTime();

    // Append chalkboard text if merit type is chalkboard
    if (type === 'chalkboard') {
      description = `Chalkboard: ${description}`;
    }

    const merit = {
      type,
      createdBy: displayName,
      description,
      amount,
      date
    };

    if (status === 'pledge') {
      merit.pledgeName = name;
      merit.pledgePhoto = photoURL;
    } else {
      merit.activeName = name;
      merit.activePhoto = photoURL;
    }

    const meritInfo = { user: state, selectedUsers, merit };

    this.openProgressDialog();

    API.createMerit(meritInfo)
    .then(res => {
      let message;
      if (status === 'pledge') {
        const totalAmount = amount * selectedUsers.length;
        message = `${action} yourself ${totalAmount} merits`;
      } else {
        message = `${action} pledges: ${amount} merits`;
      }

      this.props.handleClose();
      this.closeProgressDialog();
      this.props.handleRequestOpen(message);

      API.sendPledgeMeritNotification(name, selectedUsers, amount)
      .then(res => console.log(res))
      .catch(error => console.log(`Error: ${error}`));
    })
    .catch((error) => {
      const user = error.response.data;
      let errorMessage;
      if (status === 'pledge') {
        errorMessage = `${user} does not have enough merits`
      } else {
        errorMessage = `Not enough merits for ${user}`
      }
      console.error(error)
      this.props.handleClose();
      this.closeProgressDialog();
      this.props.handleRequestOpen(errorMessage);
    });
  }

  openProgressDialog = () => {
    const isPledge = this.props.state.status === 'pledge';
    const spinnerMessage = isPledge ? 'Meriting myself...' : 'Meriting pledges...';
    this.setState({ openSpinner: true, spinnerMessage });
  }

  closeProgressDialog = () => this.setState({ openSpinner: false });

  render() {
    const isPledge = this.props.state.status === 'pledge';
    return (
      <div id="mobile-merit-select-users-container">
        { this.header }
        <MeritDialogList
          users={this.state.filteredUsers}
          isPledge={isPledge}
          showAlumni={isPledge && this.state.showAlumni}
          selectUser={this.selectUser}
          toggleAlumniView={this.toggleAlumniView}
        />
        <div id="confirm-container">
          <button
            className="mobile-merit-button"
            onClick={this.merit}
            disabled={this.buttonDisabled}
          >
            {this.props.amount < 0 ? 'Demerit' : 'Merit'}
          </button>
        </div>
        <SpinnerDialog
          open={this.state.openSpinner}
          message={this.state.spinnerMessage}
        />
      </div>
    )
  }
}
