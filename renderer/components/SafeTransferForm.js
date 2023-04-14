import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';

import { getGasPrice } from '../utils/auth';
import { executeSafeTransaction } from '../utils/safe';

const SafeTransferForm = ({ safeSdk, safeAddress, messageApi, signer }) => {
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
      <Form layout="vertical" >
        <Form.Item label="To">
          <Input placeholder="0x0" value={to} onChange={(e) => setTo(e.target.value)} />
        </Form.Item>
        <Form.Item label="Amount">
          <Input placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}/>
        </Form.Item>
        {gas && <p>Fee: {gas / 10 ** 15} MATIC</p>}
        <Button onClick={() => executeSafeTransaction(to, amount, safeSdk, signer, safeAddress, messageApi)} type="primary" disabled={!to || !amount}>
          Send
        </Button>
      </Form>
    </div>
  )
}

export default SafeTransferForm;