import { useEffect, useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';

import { getGasPrice, sendETH } from '../utils/auth';
import { addTransactionToPB } from '../utils/polybase';
import { NETWORK } from '../network';

const TransferForm = ({ balance, walletAddress, messageApi, signer, network }) => {
  const [to, setTo] = useState();
  const [amount, setAmount] = useState();
  const [gas, setGas] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    findGasPrice();
  }, [])
  
  const findGasPrice = async() => {
    const price = await getGasPrice();
    setGas(price.toString());
  }

  const handleSubmit = async() => {
    try {
      setLoading(true);
      const tx = await sendETH(to, amount, walletAddress, signer, messageApi);
      await addTransactionToPB(tx.transactionHash, tx.from, tx.to, amount, tx.blockNumber.toString(), "Send", NETWORK[network].tokenSymbol);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
        
        <Button onClick={handleSubmit} type="primary" disabled={!to || !amount} loading={loading}>
          Send
        </Button>
      </Form>
    </div>
  )
}

export default TransferForm;