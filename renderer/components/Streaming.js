import { useEffect, useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';

import { getfDAIxBalance, approveDAITokens, upgradeDAIToDAIx } from '../utils/superfluid';

const Streaming = ({ sfSdk, signer, walletAddress }) => {
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [fdaixbalance, setFdaixbalance] = useState(0);

  useEffect(() => {
    getfDAIx();
  }, [])
  
  const getfDAIx = async() => {
    const balance = await getfDAIxBalance(sfSdk, signer, walletAddress);
    setFdaixbalance(balance.toString());
  }

  const handleSubmit = async() => {
    try {
      setLoading(true);
     
      await approveDAITokens(sfSdk, signer, amount);
      await upgradeDAIToDAIx(sfSdk, signer, amount);

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
      <p>Balance {fdaixbalance} fDAIx</p>
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