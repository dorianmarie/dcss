import React from 'react';
import { Button, Card } from '@components/UI';
import PropTypes from 'prop-types';
import './ScenariosList.css';

const DeletedCard = ({ id, title, description, onClick }) => {
  return (
    <Card className="sc sc__margin-height deleted" key={id}>
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group className="sc__edit-buttons">
          <Button name="restore" onClick={onClick}>
            Restore
          </Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

DeletedCard.propTypes = {
  description: PropTypes.string.isRequired,
  id: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default DeletedCard;
