import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [account, setAccount] = useState(null);
  const [ethDays, setEthDays] = useState(null);
  const [baseDays, setBaseDays] = useState(null);

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      alert('Please install MetaMask');
    }
  }

  async function fetchDays(address, network) {
    const baseUrl = network === 'base'
      ? 'https://api.basescan.org/api'
      : 'https://api.etherscan.io/api';
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const url = `${baseUrl}?module=account&action=txlist&address=${address}&sort=asc&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.result && data.result.length > 0) {
      const firstTx = data.result[0].timeStamp * 1000;
      const days = Math.floor((Date.now() - firstTx) / (1000 * 60 * 60 * 24));
      return days;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    if (account) {
      fetchDays(account, 'ethereum').then(setEthDays);
      fetchDays(account, 'base').then(setBaseDays);
    }
  }, [account]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🪩 Base Onchain Age Tracker</h1>
      {!account ? (
        <button onClick={connectWallet} className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700">Connect Wallet</button>
      ) : (
        <div className="text-center space-y-3">
          <p>Connected: <span className="text-blue-400">{account}</span></p>
          <p>Ethereum age: {ethDays !== null ? `${ethDays} days` : 'Loading...'}</p>
          <p>Base age: {baseDays !== null ? `${baseDays} days` : 'Loading...'}</p>
        </div>
      )}
    </main>
  );
}