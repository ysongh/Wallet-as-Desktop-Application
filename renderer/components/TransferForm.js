import { useEffect, useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';

import { getGasPrice, sendETH } from '../utils/auth';

const TransferForm = ({ balance, walletAddress, messageApi, signer }) => {
  const [to, setTo] = useState();
  const [amount, setAmount] = useState();
  const [gas, setGas] = useState();

  useEffect(() => {
    findGasPrice();
  }, [])
  
  const findGasPrice = async() => {
    const price = await getGasPrice();
    setGas(price.toString());
  }

  return (
    <div>
      <Typography.Title level={2}>
        Transfer MATIC
      </Typography.Title>
      <p>Balance {balance / 10 ** 18} MATIC</p>
      <Form layout="vertical" >
        <Form.Item label="To">
          <Input placeholder="0x0" value={to} onChange={(e) => setTo(e.target.value)} />
        </Form.Item>
        <Form.Item label="Amount">
          <Input placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}/>
        </Form.Item>

        {gas && <p>Fee: {gas / 10 ** 15} MATIC</p>}
        
        <Button onClick={() => sendETH(to, amount, walletAddress, signer, messageApi)} type="primary" disabled={!to || !amount}>
          Send
        </Button>
      </Form>
    </div>
  )
}

export default TransferForm;