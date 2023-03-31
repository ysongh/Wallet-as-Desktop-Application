import { SafeOnRampKit, SafeOnRampProviderType } from '@safe-global/onramp-kit';

import { STRIPE_PUBLICKEY, ONRAMP_BACKENDURL } from '../keys';

export const fundWallet = async function( walletAddress ) {
  try{
    const safeOnRamp = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
      onRampProviderConfig: {
        // Get public key from Stripe: https://dashboard.stripe.com/register
        stripePublicKey:
        STRIPE_PUBLICKEY,
        // Deploy your own server: https://github.com/5afe/aa-stripe-service
        onRampBackendUrl: ONRAMP_BACKENDURL
      },
    });

    const sessionData = await safeOnRamp.open({
      walletAddress: walletAddress,
      networks: ['polygon', 'ethereum'],
      element: '#stripe-root',
      // Optional, if you want to use a specific created session
      // sessionId: 'cos_1Mei3cKSn9ArdBimJhkCt1XC', 
      events: {
        onLoaded: () => console.log('Loaded'),
        onPaymentSuccessful: () => console.log('Payment successful'),
        onPaymentError: () => console.log('Payment failed'),
        onPaymentProcessing: () => console.log('Payment processing')
      }
    })

    console.log({sessionData})
  }
  catch(error){
    console.error(error);
  }
}