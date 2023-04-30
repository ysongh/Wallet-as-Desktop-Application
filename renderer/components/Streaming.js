import { useEffect, useState } from 'react';
import { Tabs, Button, Form, Input, Typography } from 'antd';

import { getDAIBalance, getfDAIxBalance, approveDAITokens, upgradeDAIToDAIx, streamDAIx, transferDAITokens } from '../utils/superfluid';

const Streaming = ({ sfSdk, signer, walletAddress, messageApi }) => {
  const [currentTab, setCurrentTab] = useState("1");
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [fdaixbalance, setFdaixbalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [isApprove, setIsApprove] = useState(false);
  const [to, setTo] = useState();
  const [amountToStream, setAmountToStream] = useState(0);

  const items = [
    {
      key: '1',
      label: `Stream`
    },
    {
      key: '2',
      label: `Upgrade`
    },
  ];

  useEffect(() => {
    getDAI();
    getfDAIx();
  }, [])

  const changeTab = (key) => {
    setCurrentTab(key);
  };
  
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
     
      await approveDAITokens(sfSdk, signer, amount, messageApi);
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
     
      await upgradeDAIToDAIx(sfSdk, signer, amount, messageApi);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const stream = async() => {
    try {
      setLoading(true);
     
      await streamDAIx(sfSdk, signer, walletAddress, amountToStream, to, messageApi);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={changeTab} />

      <Typography.Title level={4}>
        Balance
      </Typography.Title>
      <p>{daiBalance} DAI</p>
      <p>{fdaixbalance} fDAIx</p>
     
      { currentTab === "1" && <>
        <Form layout="vertical">
          <Form.Item label="Address to stream">
            <Input placeholder="0x0" value={to} onChange={(e) => setTo(e.target.value)}/>
          </Form.Item>

          <Form.Item label="Flow Rate">
            <Input placeholder="0" value={amountToStream} onChange={(e) => setAmountToStream(e.target.value)}/>
          </Form.Item>

          <Button onClick={stream} type="primary" disabled={!to || !amountToStream} loading={loading}>
            Stream
          </Button>
          <Button onClick={() => transferDAITokens(sfSdk, signer, amountToStream, to)} type="primary" loading={loading}>
            Transfer
          </Button>
        </Form>
      </>}
      { currentTab === "2" && <>
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
      </>}
    </div>
  )
}

export default Streaming;