import React from 'react';
import { Button, Typography, Tag } from 'antd';

const Step3 = ({ enterOwners, amount, currentStep, setCurrentStep, makeSafe }) => {
  return (
    <div style={{ marginTop: '1rem'}}>
      <Typography.Title level={4}>
        Number of Signers
      </Typography.Title>
      {enterOwners.map((o, index) => (
        <p key={index}>
          {index + 1} -
          <Tag color="cyan">
            {o}
          </Tag>
        </p>
      ))}

      <Typography.Title level={4}>
        Threshold - {amount}
      </Typography.Title>

      <Button onClick={makeSafe} type="primary">
        Create
      </Button>
      <Button onClick={() => setCurrentStep(currentStep - 1)} type="primary">
        Back
      </Button>
    </div>
  )
}

export default Step3;