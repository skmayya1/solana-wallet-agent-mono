import React, { useState } from 'react'

const Navbar: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const connectPhantomWallet = async () => {
    const provider = (window as any).solana

    if (provider && provider.isPhantom) {
      try {
        const response = await provider.connect()
        setWalletAddress(response.publicKey.toString())
        console.log('Connected with Public Key:', response.publicKey.toString())
      } catch (err) {
        console.error('Connection to Phantom failed:', err)
      }
    } else {
      alert('Phantom Wallet not found. Please install it from https://phantom.app')
    }
  }

  return (
    <div className='h-14 w-[60%] border-b border-zinc-800 flex items-center justify-end px-4'>
      <button
        onClick={connectPhantomWallet}
        className=' px-4 py-2 rounded text-xs transition'
      >
        {walletAddress ? `${walletAddress.slice(0, 5)}...${walletAddress.slice(-4)}` : 'Connect wallet'}
      </button>
    </div>
  )
}

export default Navbar
