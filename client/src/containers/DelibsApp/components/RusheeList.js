import '../DelibsApp.css';
import 'containers/PledgeApp/PledgeApp.css';
import { loadFirebase } from 'helpers/functions.js';
import { LoadingComponent } from 'helpers/loaders.js';
import { RusheeRow } from './RusheeRow';

import React, { PureComponent } from 'react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export class RusheeList extends PureComponent {
  state = {
    loaded: false,
    rushees: [],
  }

  componentDidMount() {
    localStorage.setItem('route', 'delibs-app');
    
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        const { firebase } = window;
        const { displayName } = this.props.state;
        const rusheesRef = firebase.database().ref('/rushees');

        rusheesRef.on('value', (snapshot) => {
          if (snapshot.val()) {
            let interactions = [];
            
            snapshot.forEach((rushee) => {
              rusheesRef.child(rushee.key + '/Actives/' + displayName).on('value', (active) => {
                interactions.push(active.val().interacted);
              })
            });

            let rushees = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });

            rushees.forEach((rushee, i) => {
              rushee['interacted'] = interactions[i];
            });

            localStorage.setItem('rusheesArray', JSON.stringify(rushees));
            
            this.setState({
              rushees,
              loaded: true
            });
          }
          else {
            this.setState({ loaded: true });
          }
        });
      });
    }
    else {
      this.setState({ loaded: true });
    }
  }

  render() {
    return (
      this.state.loaded ? (
        <div className="animate-in delibs-app">
          <Subheader className="garnett-subheader">Rushees</Subheader>
          <List className="garnett-list">
            {this.state.rushees.map((rushee) => (
              <RusheeRow
                rushee={rushee}
                state={this.props.state}
                history={this.props.history}
              />
            ))}
          </List>
        </div>
      ) : (
        <LoadingComponent />
      ) 
    )
  }
}