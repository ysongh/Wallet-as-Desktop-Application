import { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';

const Streaming = () => {
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async() => {
    try {
      setLoading(true);
     
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div>
      <Typography.Title level={2}>
        Streaming
      </Typography.Title>
      <Form layout="vertical">
        <Form.Item label="Amount">
          <Input placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}/>
        </Form.Item>
        
        <Button onClick={handleSubmit} type="primary" disabled={!amount} loading={loading}>
          Upgrade
        </Button>
      </Form>
    </div>
  )
}

export default Streaming;