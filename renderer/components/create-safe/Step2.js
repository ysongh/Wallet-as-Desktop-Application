import { Button, Form, Input, Typography} from 'antd';

const Step2 = ({ currentStep, setCurrentStep, amount, setAmount }) => {
  return (
    <div style={{ marginTop: '1rem'}}>
      <Typography.Title level={4}>
        Threshold
      </Typography.Title>
      
      <Form.Item label="Threshold">
        <Input placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}/>
      </Form.Item>

      <Button onClick={() => setCurrentStep(currentStep + 1)} type="primary">
        Next
      </Button>
      <Button onClick={() => setCurrentStep(currentStep - 1)} type="primary">
        Back
      </Button>
    </div>
  )
}


export default Step2;