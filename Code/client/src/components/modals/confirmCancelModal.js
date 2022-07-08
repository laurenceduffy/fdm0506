import { Button, Card, Modal } from "react-bulma-components";

const ConfirmCancelModal = ({open, setOpen, title, content, disableConfirm, onConfirm}) => {
    const closeModal = () => {
        setOpen(false);
    }

    return (
        <Modal show={open} onClose={closeModal}>
            <Card style={{width: 500}}>
                <Card.Header>
                    <Card.Header.Title>
                        {title}
                    </Card.Header.Title>
                </Card.Header>
                <Card.Content>
                    <>{content}</>
                </Card.Content>
                <Card.Footer>
                    <Card.Footer.Item>
                        <Button color="primary" disabled={disableConfirm} onClick={onConfirm}>Confirm</Button>
                    </Card.Footer.Item>
                    <Card.Footer.Item>
                        <Button color="danger" onClick={closeModal}>Cancel</Button>
                    </Card.Footer.Item>
                </Card.Footer>
            </Card>
        </Modal>
    );
}

export default ConfirmCancelModal;