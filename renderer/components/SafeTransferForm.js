import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';

import { getGasPrice } from '../utils/auth';
import { executeSafeTransaction } from '../utils/safe';

const SafeTransferForm = ({ safeSdk, safeAddress, messageApi, signer }) => {
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
      await executeSafeTransaction(to, amount, safeSdk, signer, safeAddress, messageApi);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
        <Button onClick={handleSubmit} type="primary" disabled={!to || !amount} loading={loading}>
          Send
        </Button>
      </Form>
    </div>
  )
}

export default SafeTransferForm;