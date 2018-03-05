import React, {Component} from 'react';
import Loadable from 'react-loadable';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const LoadableHandleComplaintDialog = Loadable({
  loader: () => import('./HandleComplaintDialog'),
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
      this.handleRequestOpen('You are offline.');
    }
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div id="my-complaints" className="active">
        <List className="pledge-list">
          <Subheader> Approved </Subheader>
          {this.props.approvedComplaintsArray.map((complaint, i) => (
            <div key={i}>
              <Divider className="pledge-divider large" inset={true} />
              <ListItem
                className="pledge-list-item large"
                leftAvatar={<Avatar className="pledge-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="pledge-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="complaints-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
              >
                <p className="complaints-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="pledge-divider large" inset={true} />
            </div>
          ))}

          <Divider />

          <Subheader> Pending </Subheader>
          {this.props.pendingComplaintsArray.map((complaint, i) => (
            <div key={i}>
              <Divider className="pledge-divider large" inset={true} />
              <ListItem
                className="pledge-list-item large"
                leftAvatar={<Avatar className="pledge-image large" size={70} src={complaint.photoURL} />}
                primaryText={
                  <p className="pledge-name"> {complaint.pledgeName} </p>
                }
                secondaryText={
                  <p className="complaints-description">
                    {complaint.description}
                  </p>
                }
                secondaryTextLines={2}
                onClick={() => this.handleOpen(complaint)}
              >
                <p className="complaints-date"> {complaint.date} </p>
              </ListItem>
              <Divider className="pledge-divider large" inset={true} />
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
