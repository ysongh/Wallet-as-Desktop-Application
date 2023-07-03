import React, { useState } from 'react';
import { Typography, Select, Button } from 'antd';

const NETWORK_LIST = [
  {
    value: 'polygon',
    label: 'Polygon Mumbai',
  },
  {
    value: 'chiado',
    label: 'Chiado Testnet',
  }
]

const Home = ({ login, network, setNetwork }) => {

  const handleChange = (value) => {
    setNetwork(value);
  }

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
      <Button onClick={login} type="primary" size='large' disabled={!network}>
        Login
      </Button>
    </center>
  )
}

export default Home;