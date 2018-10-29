import 'containers/PledgeApp/components/MeritBook/MeritBook.css';

import React from 'react';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

export function PledgeList(props) {
  return (
    <List className="garnett-list">
      {props.pledges.map((pledge, i) => (
        <div key={i}>
          <Divider className="garnett-divider large" inset={true} />
          <ListItem
            className="garnett-list-item large"
            leftAvatar={<Avatar className="garnett-image large" size={70} src={pledge.photoURL} />}
            primaryText={
              <p className="garnett-name"> {pledge.firstName} {pledge.lastName} </p>
            }
            secondaryText={
              <p>
                {pledge.year}
                <br />
                {pledge.major}
              </p>
            }
            secondaryTextLines={2}
            onClick={() => props.handleOpen(pledge)}
          >
            <p className="pledge-merits"> {pledge.totalMerits} </p>
          </ListItem>
          <Divider className="garnett-divider large" inset={true} />
        </div>
      ))}
    </List>
  )
}