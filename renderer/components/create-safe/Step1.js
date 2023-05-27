import { useState } from 'react';
import { Button, Form, Input, Typography, Tag } from 'antd';

const Step1 = ({ enterOwners, currentStep, setCurrentStep, setEnterOwners }) => {
  const [to, setTo] = useState();

  const handleAddOwner = async () => {
    setEnterOwners([...enterOwners, to]);
    setTo("");
  }

  return (
    <div style={{ marginTop: '1rem'}}>
      <Typography.Title level={4}>
        Add number of owners
      </Typography.Title>
      {enterOwners.map((o, index) => (
        <p key={index}>
          {index + 1} -
          <Tag color="cyan">
            {o}
          </Tag>
        </p>
      ))}
      <Form.Item label="Signer">
        <Input placeholder="0x0" value={to} onChange={(e) => setTo(e.target.value)} />
      </Form.Item>
      <Button onClick={handleAddOwner} type="primary">
        Add
      </Button>
      <Button onClick={() => setCurrentStep(currentStep + 1)} type="primary">
        Next
      </Button>
    </div>
  )
}

export default Step1;