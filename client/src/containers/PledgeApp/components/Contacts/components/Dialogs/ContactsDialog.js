// @flow

import { isMobile } from 'helpers/functions.js';
import { FullScreenDialog, UserInfo } from 'components';
import type { User } from 'api/models';

import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

type Props = {
  open: boolean,
  active: User,
  title: string,
  handleClose: () => void
};

export default function ContactsDialog(props: Props) {
  if (!props.active) {
    return null;
  }

  const { firstName, lastName } = props.active;
  const fullName = `${firstName} ${lastName}`;
  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={props.handleClose}
    />,
  ];

  if (isMobile()) {
    return (
      <FullScreenDialog
        title={props.title}
        open={props.open}
        onRequestClose={props.handleClose}
      >
        <UserInfo user={props.active} name={fullName} />
      </FullScreenDialog>
    )
  }

  return (
    <Dialog
      title={props.title}
      titleClassName="garnett-dialog-title"
      actions={actions}
      bodyClassName="garnett-dialog-body list"
      contentClassName="garnett-dialog-content"
      open={props.open}
      onRequestClose={props.handleClose}
      autoDetectWindowHeight={false}
    >
      <UserInfo user={props.active} name={fullName} />
    </Dialog>
  )
}
