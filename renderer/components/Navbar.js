import { Layout, Button } from 'antd';

const { Header } = Layout;

const Navbar = ({ logout }) => {
  return (
    <Header className="header" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>Welcome</h1>
      <Button onClick={logout} type="primary">Logout</Button>
    </Header>
  )
}

export default Navbar;