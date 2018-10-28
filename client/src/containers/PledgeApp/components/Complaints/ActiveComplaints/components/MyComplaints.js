import React, { Component } from 'react';
import Loadable from 'react-loadable';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

const LoadableHandleComplaintDialog = Loadable({
  loader: () => import('./Dialogs/HandleComplaintDialog'),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  },
  loading() {
    return <div> Loading... </div>;
  }
});

export default class MyComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedComplaint: null
    };
  }

  handleOpen = (complaint) => {
    if (navigator.onLine) {
      this.setState({
        open: true,
        selectedComplaint: complaint
      });
    }
    else {
      this.props.handleRequestOpen('You are offline');
    }

    // Handles android back button
    if (/android/i.test(navigator.userAgent)) {
      let path;
      if (process.env.NODE_ENV === 'development') {
        path = 'http://localhost:3000';
      }
      else {
        path = 'https://garnett-app.herokuapp.com';
      }

      window.history.pushState(null, null, path + window.location.pathname);
      window.onpopstate = () => {
        this.handleClose();
      }
    }
  }

  handleClose = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.onpopstate = () => {};
    }
    
    this.setState({ open: false });
  }

  render() {
    let toggleIcon = "icon-down-open-mini";
    let { approvedComplaints, pendingComplaints } = this.props;

    if (this.props.reverse) {
      approvedComplaints = approvedComplaints.slice().reverse();
      pendingComplaints = pendingComplaints.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    return (
      <div id="my-complaints" className="active">
        <Subheader className="garnett-subheader">
          Approved
          <IconButton
            style={{float:'right',cursor:'pointer'}}
            iconClassName={toggleIcon}
            className="reverse-toggle"
            onClick={this.props.reverseComplaints}
          />
        </Subheader>
        
        <List className="garnett-list">
          {approvedComplaints.map((complaint, i) => (
            <div key={i}>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
              >
                <p className="garnett-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          ))}
        </List>

        <Divider className="garnett-subheader" />

        <Subheader className="garnett-subheader"> Pending </Subheader>
        <List className="garnett-list">
          {pendingComplaints.map((complaint, i) => (
            <div key={i}>
              <Divider className="garnett-divider large" inset={true} />
              <ListItem
                className="garnett-list-item large"
                leftAvatar={<Avatar className="garnett-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="garnett-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="garnett-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => this.handleOpen(complaint)}
              >
                <p className="garnett-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="garnett-divider large" inset={true} />
            </div>
          ))}
        </List>

        <LoadableHandleComplaintDialog
          open={this.state.open}
          state={this.props.state}
          complaint={this.state.selectedComplaint}
          handleClose={this.handleClose}
          handleRequestOpen={this.props.handleRequestOpen}
        />
      </div>
    )
  }
}
