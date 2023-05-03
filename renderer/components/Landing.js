import React, { useState } from 'react';
import { Typography, Select, Button } from 'antd';

const NETWORK_LIST = [
  {
    value: 'polygon',
    label: 'Polygon Mumbai',
  },
  {
    value: 'mandala',
    label: 'Mandala Testnet',
  },
]

const Home = ({ login }) => {
  const [networkName, setNetworkName] = useState(null);

  const handleChange = (value) => {
    setNetworkName(value);
  };

  console.log(networkName);

  return (
    <center>
      <Typography.Title level={2} style={{ marginTop: '10rem', marginBottom: '2rem' }}>
        Desktop Safe Wallet
      </Typography.Title>
      <Select
        placeholder="Select a Network"
        style={{
          width: 200,
        }}
        onChange={handleChange}
        options={NETWORK_LIST}
      />
      <br />
      <br />
      <Button onClick={login} type="primary" size='large' disabled={!networkName}>
        Login
      </Button>
    </center>
  )
}

export default Home;