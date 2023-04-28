import { useEffect, useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';

import { getDAIBalance, getfDAIxBalance, approveDAITokens, upgradeDAIToDAIx } from '../utils/superfluid';

const Streaming = ({ sfSdk, signer, walletAddress }) => {
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [fdaixbalance, setFdaixbalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [isApprove, setIsApprove] = useState(false);

  useEffect(() => {
    getDAI();
    getfDAIx();
  }, [])
  
  const getfDAIx = async() => {
    const balance = await getfDAIxBalance(sfSdk, signer, walletAddress);
    setFdaixbalance(balance.toString());
  }

  const getDAI = async() => {
    const balance = await getDAIBalance(signer, walletAddress);
    setDaiBalance(balance.toString());
  }

  const approveDAI = async() => {
    try {
      setLoading(true);
     
      await approveDAITokens(sfSdk, signer, amount);
      setIsApprove(true);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const updateDAI = async() => {
    try {
      setLoading(true);
     
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
      <Typography.Title level={4}>
        Balance
      </Typography.Title>
      <p>{daiBalance} DAI</p>
      <p>{fdaixbalance} fDAIx</p>
      <Form layout="vertical">
        <Form.Item label="Amount to upgrade DAI to DAIx">
          <Input placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}/>
        </Form.Item>

        <Button onClick={approveDAI} type="primary" disabled={!amount || isApprove} loading={loading}>
          Approve
        </Button>
        
        <Button onClick={updateDAI} type="primary" disabled={!amount || !isApprove} loading={loading}>
          Upgrade
        </Button>
      </Form>
    </div>
  )
}

export default Streaming;