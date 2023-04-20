import { useState, useEffect } from 'react';
import { Card, Button } from 'antd';

import { formatAddress, formatTransactionHash } from '../utils/format';
import { getTransactionsByUserFromPB } from '../utils/polybase';

const Transaction = ({ walletAddress }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions();
  }, [])

  const getTransactions = async () => {
    const data = await getTransactionsByUserFromPB(walletAddress);
    setTransactions(data);
  }

  return (
    <div>
      <Card title="Transaction">
        <Button onClick={getTransactions} type="primary" style={{ marginBottom: '2rem' }}>
          Refresh
        </Button>
        {transactions.map(t => (
          <Card key={t.data.id} type="inner" title="Send" extra={<a href="#">{formatTransactionHash(t.data.id)}</a>}>
            To {formatAddress(t.data.to)}, {t.data.date}, {t.data.amount} MATIC
          </Card>
        ))}
      </Card>
    </div>
  )
}

export default Transaction;