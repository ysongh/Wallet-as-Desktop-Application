import { useState } from 'react';
import { Typography, Steps } from 'antd';

import { createSafe } from '../../utils/safe';
import { addSafeToPB } from '../../utils/polybase';
import { stepsItems } from '../../utils/antdesign';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const CreateSafe = ({ signer, walletAddress, setCurrentTab, messageApi, setSafeSdk, setSafeAddress }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [enterOwners, setEnterOwners] = useState([]);
  const [amount, setAmount] = useState();

  const makeSafe = async () => {
    const { sSdk, sAddress} = await createSafe(signer, amount, enterOwners, messageApi);
    setSafeSdk(sSdk);
    setSafeAddress(sAddress);
    await addSafeToPB(walletAddress, sAddress);
    setCurrentTab("Safe");
  }

  return (
    <>
      <Typography.Title level={2}>
        Create Safe
      </Typography.Title>
      <Steps current={currentStep} items={stepsItems} />
      {currentStep === 0 && <Step1 enterOwners={enterOwners} currentStep={currentStep} setCurrentStep={setCurrentStep} setEnterOwners={setEnterOwners} />}
      {currentStep === 1 && <Step2 currentStep={currentStep} setCurrentStep={setCurrentStep} amount={amount} setAmount={setAmount} />}
      {currentStep === 2 && <Step3 enterOwners={enterOwners} amount={amount} currentStep={currentStep} setCurrentStep={setCurrentStep} makeSafe={makeSafe} />}
    </>
  )
}

export default CreateSafe;