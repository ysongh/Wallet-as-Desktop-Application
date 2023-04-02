import React from 'react';
import { useRouter } from 'next/router';
import { Typography ,Button } from 'antd';

const Home = () => {
  const router = useRouter();

  return (
    <center>
      <Typography.Title level={2} style={{ marginTop: '10rem', marginBottom: '2rem' }}>
        Desktop Safe Wallet
      </Typography.Title>
      <Button onClick={() => router.push('/dashboard')} type="primary" size='large'>
        Login
      </Button>
    </center>
  )
}

export default Home;