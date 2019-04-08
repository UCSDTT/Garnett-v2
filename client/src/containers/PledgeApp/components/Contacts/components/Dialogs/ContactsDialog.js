// @flow

import { isMobile } from 'helpers/functions.js';
import { UserInfo } from 'components';
import type { User } from 'api/models';

import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import FullscreenDialog from 'material-ui-fullscreen-dialog';

const fullscreenDialogStyle = {
  backgroundColor: 'var(--background-color)',
  overflow: 'auto'
};

type Props = {
  active: User,
  open: boolean,
  handleClose: () => void
};

export default function ContactsDialog(props: Props) {
  const { firstName, lastName } = props.active;
  const fullName = `${firstName} ${lastName}`;
  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={props.handleClose}
    />,
  ];

  if (!props.active) {
    return null
  }

  if (isMobile()) {
    return (
      <FullscreenDialog
        title="Brother"
        titleStyle={{ fontSize:'22px' }}
        style={fullscreenDialogStyle}
        open={props.open}
        onRequestClose={props.handleClose}
      >
        <UserInfo user={props.active} name={fullName} />
      </FullscreenDialog>
    )
  }

  return (
    <Dialog
      title="Brother"
      titleClassName="garnett-dialog-title"
      actions={actions}
      modal={false}
      bodyClassName="garnett-dialog-body list"
      contentClassName="garnett-dialog-content"
      open={props.open}
      onRequestClose={props.handleClose}
      autoScrollBodyContent={true}
    >
      <UserInfo user={props.active} name={fullName} />
    </Dialog>
  )
}
