// @flow

import API from 'api/API.js';
import { setRefresh } from 'helpers/functions';
import { LoadingComponent } from 'helpers/loaders';
import { UserRow } from 'components';
import type { User } from 'api/models';

import React, { PureComponent } from 'react';
import Subheader from 'material-ui/Subheader';
import { List } from 'material-ui/List';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

type Props = {
  state: User
};

export class Interviews extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const completedInterviews = JSON.parse(localStorage.getItem('completedInterviews'));
    const incompleteInterviews = JSON.parse(localStorage.getItem('incompleteInterviews'));
    this.state = { completedInterviews, incompleteInterviews };
  }

  componentDidMount() {
    if (navigator.onLine) {
      setRefresh(this.fetchInterviewProgress);
      this.fetchInterviewProgress();
    }
  }

  fetchInterviewProgress = () => {
    const { displayName, status } = this.props.state;
    API.getInterviewsProgress(displayName, status)
    .then(res => {
      const completedInterviews = res.data.completed;
      const incompleteInterviews = res.data.incomplete;
      localStorage.setItem('completedInterviews', JSON.stringify(completedInterviews));
      localStorage.setItem('incompleteInterviews', JSON.stringify(incompleteInterviews));
      this.setState({ completedInterviews, incompleteInterviews });
    })
    .catch(err => console.error(err));
  }

  render() {
    const { completedInterviews, incompleteInterviews } = this.state;

    if (!completedInterviews || !incompleteInterviews) {
      return <LoadingComponent />
    }

    const interviewsDone = completedInterviews.length;
    const interviewsLeft = interviewsDone + incompleteInterviews.length;
    const percent = (interviewsDone / interviewsLeft) * 100;

    return (
      <div className="content animate-in">
        <Subheader className="garnett-subheader">Progress</Subheader>
        <Progress
          percent={percent}
          theme={{
            active: {
              symbol: `${interviewsDone}/${interviewsLeft}`,
              color: 'var(--accent-color)'
            }
          }}
        />
        <Subheader className="garnett-subheader">Completed</Subheader>
        <List className="garnett-list">
          {completedInterviews.map((user, i) => (
            <UserRow key={i} user={user} />
          ))}
        </List>
        <Subheader className="garnett-subheader">Incomplete</Subheader>
        <List className="garnett-list">
          {incompleteInterviews.map((user, i) => (
            <UserRow key={i} user={user} />
          ))}
        </List>
      </div>
    )
  }
}