import { QRCode, Typography } from 'antd';

const Receive = ({ walletAddress }) => {
  return (
    <>
      <Typography.Title level={2}>
        Receive
      </Typography.Title>
    
      <QRCode
        value={walletAddress}
        color="blue"
        style={{
          marginBottom: 16,
        }}
      />
      
      <p>{walletAddress}</p>
    </>
  )
}

export default Receive;