import './PledgeApp.css';
import API from '../../api/API.js';
import {loadFirebase} from '../../helpers/functions.js';
import {LoadingPledgeApp} from '../../helpers/loaders.js';
import MeritBook from '../../components/MeritBook/MeritBook';
import Contacts from '../../components/Contacts/Contacts';
import Chalkboards from '../../components/Chalkboards/Chalkboards';
import Complaints from '../../components/Complaints/Complaints';
import Settings from '../../components/Settings/Settings';

import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';

const inkBarStyle = {
  position: 'fixed',
  top: 100,
  backgroundColor: 'var(--primary-color)',
  zIndex: 1
};

const tabContainerStyle = {
  position: 'fixed',
  top: 52,
  backgroundColor: 'white',
  borderBottom: '1px solid #e0e0e0',
  boxShadow: 'rgba(12, 42, 51, 0.3) 0px 1px 8px',
  zIndex: 1
};

const tabStyle = {
  default: {
    color: 'var(--secondary-light)'
  },
  active: {
    color: 'var(--primary-color)'
  }
};

let didScroll = false;

function watchScroll() {
  didScroll = true;
}

export default class PledgeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Merit Book',
      slideIndex: 0,
      previousIndex: 0,
      scrollPosition1: 0,
      scrollPosition2: 0,
      scrollPosition3: 0,
      scrollPosition4: 0,
      scrollPosition5: 0,
      loaded: false,
      open: false,
      message: '',
      activeArray: [],
      pledgeArray: [],
      meritArray: [],
      pledgeComplaintsArray: [],
      complaintsPledgeArray: [],
      activeComplaintsArray: [],
      pendingComplaintsArray: [],
      approvedComplaintsArray: []
    };
  }

  componentDidMount() {
    console.log('Pledge app mount: ', this.props.state.name)

    let data = JSON.parse(localStorage.getItem('data'));
    let firebaseData = JSON.parse(localStorage.getItem('firebaseData'));
    let firebase = window.firebase;

    if (navigator.onLine) {
      if (!this.props.state.name) {
        if (data !== null) {
          loadFirebase('app')
          .then(() => {
            firebase = window.firebase;

            if (!firebase.apps.length) {
              firebase.initializeApp(firebaseData);
            }

            loadFirebase('auth')
            .then(() => {
              firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                  this.setState({
                    loaded: true
                  });
                }
                else {
                  this.props.logoutCallBack();
                  this.props.history.push('/');
                }
              });
            });
          });
        }
        else {
          this.props.history.push('/');
        }
      }
      else {
        this.setState({
          loaded: true
        });
      }
    }
    else {
      if (data !== null) {
        if (data.data.user.status === 'active') {
          let pledgeArray = JSON.parse(localStorage.getItem('pledgeArray'));
          let activeArray = JSON.parse(localStorage.getItem('activeArray'));
          let complaintsPledgeArray = JSON.parse(localStorage.getItem('complaintsPledgeArray'));
          let activeComplaintsArray = JSON.parse(localStorage.getItem('activeComplaintsArray'));
          let pendingComplaintsArray = JSON.parse(localStorage.getItem('pendingComplaintsArray'));
          let approvedComplaintsArray = JSON.parse(localStorage.getItem('approvedComplaintsArray'));

          this.setState({
            loaded: true,
            pledgeArray: pledgeArray,
            activeArray: activeArray,
            complaintsPledgeArray: complaintsPledgeArray,
            activeComplaintsArray: activeComplaintsArray
          });
        }
        else {
          let meritArray = JSON.parse(localStorage.getItem('meritArray'));
          let pledgeComplaintsArray = JSON.parse(localStorage.getItem('pledgeComplaintsArray'));
          let activeArray = JSON.parse(localStorage.getItem('activeArray'));

          this.setState({
            loaded: true,
            meritArray: meritArray,
            pledgeComplaintsArray: pledgeComplaintsArray,
            activeArray: activeArray
          });
        }
      }
      else {
        this.props.history.push('/');
      }
    }

    // Checks if page has scrolled

    // setInterval(() => {
    //   if (didScroll) {
    //     didScroll = false;
    //     this.onScroll();
    //   }
    // }, 100);

    // Initializes Pull To Refresh
    
    // window.PullToRefresh.init({
    //   mainElement: 'body',
    //   onRefresh: () => {
    //     if (navigator.onLine) {
    //       if (this.props.state.status === 'active') {
    //         API.getPledges()
    //         .then(res => {
    //           this.setState({
    //             pledgeArray: res.data
    //           });
    //         })
    //         .catch(err => console.log(err));
    //       }
    //       else {
    //         let displayName = this.props.state.displayName;

    //         API.getPledgeData(displayName)
    //         .then(res => {
    //           this.setState({
    //             meritArray: res.data.meritArray,
    //             complaintsArray: res.data.complaintsArray
    //           });
    //         })
    //         .catch(err => console.log(err)); 
    //       }
    //     }
    //   },
    //   shouldPullToRefresh: () => {
    //     let contentContainer = document.querySelector('.content-container');
    //     let index = this.state.slideIndex;

    //     if (contentContainer) {
    //       return contentContainer.childNodes[index].scrollTop === 0;
    //     }
    //   }
    // });
  }

  // Changes view margin if view is pledge merit book
  componentDidUpdate() {
    let index = this.state.slideIndex;
    let pullToRefresh = document.querySelector('.ptr--ptr');
    let contentContainer = document.querySelector('.content-container');
    let addChalkboard = document.getElementById('add-chalkboard');
    let chalkboardsTabs = document.getElementById('chalkboards-tabs');
    let addComplaint = document.getElementById('add-complaint');
    let complaintsTabs = document.getElementById('complaints-tabs');
    
    if (pullToRefresh) {
      pullToRefresh.style.marginTop = '100px';
    }

    // Changes view margin if view is pledge merit book
    if (contentContainer) {
      contentContainer.childNodes[index].onscroll = watchScroll;

      contentContainer.childNodes[index].style.position = 'fixed';
      contentContainer.childNodes[index].style.height = 'calc(100% - 100px)';

      for (let i = 0; i < 5; i++) {
        if (index !== i) {
          contentContainer.childNodes[i].style.position = 'relative';
          contentContainer.childNodes[i].style.height = 0;
        }
      }

      if (this.props.state.status === 'pledge' && index === 0) {
        contentContainer.childNodes[index].style.marginBottom = '50px';
        contentContainer.childNodes[index].style.height = 'calc(100% - 150px)';
      }

      if (this.props.state.status !== 'pledge' && index === 3) {
        contentContainer.childNodes[index].style.height = 'calc(100vh - 157px)';
      }
    }

    // Changes chalkboards tabs and add button to be viewable if slide is on chalkboards
    if (chalkboardsTabs) {
      if (index === 2) {
        chalkboardsTabs.style.display = 'flex';
        if (this.props.state.status !== 'pledge') {
          addChalkboard.style.display = 'flex';
        }
      }
      else {
        chalkboardsTabs.style.display = 'none';
        if (this.props.state.status !== 'pledge') {
          addChalkboard.style.display = 'none';
        }
      }
    }

    // Changes complaints tabs and add button to be viewable if slide is on complaints
    if (addComplaint && complaintsTabs) {
      if (this.props.state.status !== 'pledge' && index === 3) {
        addComplaint.style.display = 'flex';
        complaintsTabs.style.display = 'flex';
      }
      else {
        addComplaint.style.display = 'none';
        complaintsTabs.style.display = 'none';
      }
    }
  }

  // Changes touch action of view if scroll is at top of view
  onScroll = () => {
    let contentContainer = document.querySelector('.content-container');
    let index = this.state.slideIndex;
    let view = contentContainer.childNodes[index];

    if (view.scrollTop >= 1) {
      view.style.touchAction = 'auto';
    } 
    else {
      view.style.touchAction = 'pan-down';
    }
  }

  handleChange = (value) => {
    let title;
    let previousIndex = this.state.previousIndex;
    let scrollPosition1 = this.state.scrollPosition1;
    let scrollPosition2 = this.state.scrollPosition2;
    let scrollPosition3 = this.state.scrollPosition3;
    let scrollPosition4 = this.state.scrollPosition4;
    let scrollPosition5 = this.state.scrollPosition5;
    let contentContainer = document.querySelector('.content-container');
    let scrollPosition = contentContainer.childNodes[previousIndex].scrollTop;
    let scrolled;

    // Sets the title and marks scroll position based on the tab index
    if (value === 0) {
      title = 'Merit Book';
      scrolled = scrollPosition1;
    }
    else if (value === 1) {
      title = 'Contacts';
      scrolled = scrollPosition2;
    }
    else if (value === 2) {
      title = 'Chalkboards';
      scrolled = scrollPosition3;
    }
    else if (value === 3) {
      title = 'Complaints';
      scrolled = scrollPosition4;
    }
    else {
      title = 'Settings';
      scrolled = scrollPosition5;
    }

    // Updates the previous scroll position based on the previous index
    if (previousIndex === 0) {
      scrollPosition1 = scrollPosition;
    }
    else if (previousIndex === 1) {
      scrollPosition2 = scrollPosition;
    }
    else if (previousIndex === 2) {
      scrollPosition3 = scrollPosition;
    }
    else if (previousIndex === 3) {
      scrollPosition4 = scrollPosition;
    }
    else {
      scrollPosition5 = scrollPosition;
    }

    if (contentContainer) {
      contentContainer.childNodes[value].style.position = 'fixed';
      contentContainer.childNodes[value].style.height = 'calc(100% - 100px)';

      // Sets the window scroll position based on tab
      contentContainer.childNodes[value].scrollTop = scrolled;
    }

    this.setState({
      title: title,
      slideIndex: value,
      previousIndex: value,
      scrollPosition1: scrollPosition1,
      scrollPosition2: scrollPosition2,
      scrollPosition3: scrollPosition3,
      scrollPosition4: scrollPosition4,
      scrollPosition5: scrollPosition5,
    });
  };

  getStyle (isActive) {
    return isActive ? tabStyle.active : tabStyle.default
  }

  handleRequestOpen = (message) => {
    this.setState({
      open: true,
      message: message
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      this.state.loaded ? (
        <div>
          <div className="app-header">
            {this.state.title}
          </div>
          <Tabs
            contentContainerClassName="content-container"
            inkBarStyle={inkBarStyle}
            tabItemContainerStyle={tabContainerStyle}
            onChange={this.handleChange}
            value={this.state.slideIndex}
          >
            <Tab 
              icon={<i style={this.getStyle(this.state.slideIndex === 0)} className="icon-star"></i>}
              value={0}
            >
              <MeritBook 
                state={this.props.state}
                index={this.state.slideIndex}
                pledgeArray={this.state.pledgeArray}
                meritArray={this.state.meritArray}
                scrollPosition={this.state.scrollPosition1}
                handleRequestOpen={this.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i style={this.getStyle(this.state.slideIndex === 1)} className="icon-address-book"></i>}
              value={1}
            >
              <Contacts
                state={this.props.state}
                activeArray={this.state.activeArray}
              />
            </Tab>
            <Tab
              icon={<i style={this.getStyle(this.state.slideIndex === 2)} className="icon-calendar-empty"></i>}
              value={2}
            >
              <Chalkboards 
                state={this.props.state}
                index={this.state.slideIndex}
              />
            </Tab>
            <Tab
              icon={<i style={this.getStyle(this.state.slideIndex === 3)} className="icon-thumbs-down-alt"></i>}
              value={3}
            >
              <Complaints
                state={this.props.state}
                index={this.state.slideIndex}
                pledgeComplaintsArray={this.state.pledgeComplaintsArray}
                complaintsPledgeArray={this.state.complaintsPledgeArray}
                activeComplaintsArray={this.state.activeComplaintsArray}
                pendingComplaintsArray={this.state.pendingComplaintsArray}
                approvedComplaintsArray={this.state.approvedComplaintsArray}
                scrollPosition={this.state.scrollPosition4}
                handleRequestOpen={this.handleRequestOpen}
              />
            </Tab>
            <Tab
              icon={<i style={this.getStyle(this.state.slideIndex === 4)} className="icon-cog"></i>}
              value={4}
            >
              <Settings 
                state={this.props.state} 
                logoutCallBack={this.props.logoutCallBack} 
                history={this.props.history}
              />
            </Tab>
          </Tabs>

          <Snackbar
            open={this.state.open}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      ) : (
        <LoadingPledgeApp />
      )
    )
  }
}