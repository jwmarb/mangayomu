import Button from '@app/components/Button';
import Modal, { ModalMethods } from '@app/components/Modal';
import Progress from '@app/components/Progress';
import Text from '@app/components/Text';
import TextField from '@app/components/TextField';
import useBoolean from '@app/hooks/useBoolean';
import React from 'react';
import { MdDelete } from 'react-icons/md';

const DELETE_CONFIRMATION = 'Delete Account';

export default function DeleteAccount() {
  const modalRef = React.useRef<ModalMethods>(null);
  const [text, setText] = React.useState<string>('');
  const [loading, toggle] = useBoolean();
  function handleOnChange(e: string) {
    setText(e.trim());
  }
  function handleOnPress() {
    modalRef.current?.open();
  }
  function mockDeletion() {
    toggle(true);
    setTimeout(() => {
      toggle(false);
    }, 2000);
  }
  return (
    <>
      <Text variant="header">Account Removal</Text>
      <div className="grid grid-cols-3">
        <Text color="text-secondary" className="col-span-2">
          By any circumstances you must delete your account, you may do so here.
          However,{' '}
          <span className="font-bold text-error">
            this action is permanent and data recovery is not possible.
          </span>
        </Text>
        <Button
          onPress={handleOnPress}
          color="secondary"
          variant="outline"
          icon={<MdDelete />}
        >
          Delete account
        </Button>
      </div>
      <Modal title="Delete account?" ref={modalRef}>
        <div className="p-3 flex-col gap-2 flex">
          <Text>
            Type <span className="font-bold">{DELETE_CONFIRMATION}</span> to
            confirm your action.
          </Text>
          <TextField onChange={handleOnChange} />
        </div>
        <div className="flex flex-row justify-end items-center gap-2 pr-3 pb-3">
          <Button variant="outline" onPress={() => modalRef.current?.close()}>
            Cancel
          </Button>
          <Button
            icon={loading ? <Progress size={1} /> : <MdDelete />}
            onPress={mockDeletion}
            variant="contained"
            color="secondary"
            disabled={text !== DELETE_CONFIRMATION || loading}
          >
            Delete Account
          </Button>
        </div>
      </Modal>
    </>
  );
}
