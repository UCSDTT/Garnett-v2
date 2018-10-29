import API from 'api/API.js';
import { loadFirebase, androidBackOpen, androidBackClose } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { FilterHeader } from 'components/FilterHeader';
import { PledgeList } from './components/PledgeList';
import { Filter } from './components/Filter';
import { LoadablePledgeInfoDialog } from './components/Dialogs';

import React, { PureComponent, Fragment } from 'react';

export class Pledges extends PureComponent {
  state = {
    loaded: false,
    pledges: this.props.pledges,
    pledge: null,
    filter: 'lastName',
    filterName: 'Last Name',
    reverse: false,
    open: false,
    openMerit: false,
    openPopover: false
  };

  componentDidMount() {
    if (navigator.onLine) {
      if (this.props.state.status === 'pledge') {
        API.getPbros()
        .then(res => {
          localStorage.setItem('pbros', JSON.stringify(res.data));

          this.setState({
            loaded: true,
            pledges: res.data
          });
        })
        .catch(error => console.log(`Error: ${error}`));
      }
      else {
        loadFirebase('database')
        .then(() => {
          let pledges = [];
          const firebase = window.firebase;
          const dbRef = firebase.database().ref('/users');

          dbRef.on('value', (snapshot) => {
            const { filter } = this.state;

            pledges = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            }).filter((child) => {
              return child.status === 'pledge';
            });

            if (this.state.filterName === 'Total Merits') {
              pledges = pledges.sort(function(a, b) {
                return a[filter] < b[filter] ? 1 : -1;
              });
            }
            else {
              pledges = pledges.sort(function(a, b) {
                return a[filter] > b[filter] ? 1 : -1;
              });
            }

            localStorage.setItem('pledgeArray', JSON.stringify(pledges));
            
            this.setState({
              loaded: true,
              pledges: pledges
            });
          });
        });
      }
    }
    else {
      this.setState({
        loaded: true
      })
    }
  }

  handleOpen = (pledge) => {
    androidBackOpen(this.handleClose);
    this.setState({
      pledge,
      open: true
    });
  }

  handleClose = () => {
    androidBackClose();
    this.setState({
      open: false
    });
  }

  openPopover = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      openPopover: true,
      anchorEl: event.currentTarget,
    });
  };

  closePopover = () => {
    this.setState({
      openPopover: false,
    });
  };

  setFilter = (filterName) => {
    let filter = filterName.replace(/ /g,'');
    filter = filter[0].toLowerCase() + filter.substr(1);
    let pledges = this.state.pledges.sort(function(a, b) {
      return a[filter] > b[filter] ? 1 : -1;
    });

    if (filterName === 'Total Merits') {
      pledges = this.state.pledges.sort(function(a, b) {
        return a[filter] < b[filter] ? 1 : -1;
      });
    }

    this.setState({
      pledges,
      filter,
      filterName,
      reverse: false,
      openPopover: false
    });
  }

  reverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  render() {
    let toggleIcon = "icon-down-open-mini";
    let { pledges, reverse } = this.state;

    if (reverse) {
      pledges = pledges.slice().reverse();
      toggleIcon = "icon-up-open-mini";
    }

    return (
      this.state.loaded ? (
        <Fragment>
          <FilterHeader
            title="Pledges"
            toggleIcon={toggleIcon}
            state={this.props.state}
            filterName={this.state.filterName}
            openPopover={this.openPopover}
            reverse={this.reverse}
          />
          <PledgeList
            pledges={pledges}
            handleOpen={this.handleOpen}
          />
          <LoadablePledgeInfoDialog
            open={this.state.open}
            state={this.props.state}
            pledge={this.state.pledge}
            handleClose={this.handleClose}
            handleRequestOpen={this.props.handleRequestOpen}
          />
          {this.props.state.status !== 'pledge' && (
            <Filter
              open={this.state.openPopover}
              anchorEl={this.state.anchorEl}
              filterName={this.state.filterName}
              closePopover={this.closePopover}
              setFilter={this.setFilter}
            />
          )}
        </Fragment>
      ) : (
        <LoadingComponent />
      )
    )
  }
}