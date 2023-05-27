import { useState } from 'react';
import { Button, Form, Input, Typography, Divider, Tag } from 'antd';

import { getSafe } from '../utils/safe';
import { NETWORK } from '../network';

import SafeTransferForm from '../components/SafeTransferForm';

const Safe = ({ walletAddress, userData, signer, network, setCurrentTab, messageApi }) => {
  const [enterSafeAddress, setEnterSafeAddress] = useState();
  const [safeBalance, setSafeBalance] = useState(0);
  const [safeAddress, setSafeAddress] = useState();
  const [safeSdk, setSafeSdk] = useState(null);
  const [enterOwners, setEnterOwners] = useState([]);

  const findSafe = async (safeAddress) => {
    const { sSdk, sAddress, balance, ownerAddresses } = await getSafe(signer, safeAddress);
    setSafeSdk(sSdk);
    setSafeAddress(sAddress);
    setSafeBalance(balance);
    setEnterOwners(ownerAddresses);
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={2}>
          Safe
        </Typography.Title>
        {safeAddress && <Button onClick={() => setSafeAddress(null)} type="primary" style={{ marginBottom: '2rem' }}>
          Exit
        </Button>}
      </div>
      
      
      {safeAddress
        ? <>
            <p>{safeAddress}</p>
            <p>{safeBalance / 10 ** 18} {NETWORK[network].tokenSymbol}</p>
            <div id='stripe-root'></div>
            <Typography.Title level={4}>
              Owners
            </Typography.Title>
            {enterOwners.map((o, index) => (
              <p key={index}>
                {index + 1} -
                <Tag color="cyan">
                  {o}
                </Tag>
              </p>
            ))}
            <Divider orientation="left">Transfer</Divider>
            <SafeTransferForm
              safeSdk={safeSdk}
              safeAddress={safeAddress}
              messageApi={messageApi}
              walletAddress={walletAddress}
              signer={signer} />
          </>
        : <>
            <Divider orientation="left">Existing Safes</Divider>
            {userData?.safes?.map(s => (
              <Tag key={s} color="cyan" onClick={() => findSafe(s)} style={{ cursor: "pointer" }}>
                {s}
              </Tag>
            ))}
            <Divider orientation="left">Search for Safes</Divider>
            <Form.Item label="Safe Address">
              <Input placeholder="0x0" value={enterSafeAddress} onChange={(e) => setEnterSafeAddress(e.target.value)}/>
            </Form.Item>
            <Button onClick={() => findSafe(enterSafeAddress)} type="primary">
              Find
            </Button>
            <Divider orientation="left">Don't have one?</Divider>
            <Button onClick={() => setCurrentTab("CreateSafe")} type="primary">
              Create
            </Button>
          </>
        }
      </>
  )
}

export default Safe;