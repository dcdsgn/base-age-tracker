import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const FALLBACK_KEY = ""; // optional: paste a test key here for quick testing

function AgeBadge({ days }) {
  if (days === "No txs") {
    return <span className="badge bg-gray-700 text-gray-200">No txs</span>;
  }
  if (days === "Error") {
    return <span className="badge bg-red-700 text-red-100">Error</span>;
  }
  const d = Number(days);
  if (isNaN(d)) return <span className="badge bg-gray-700 text-gray-200">—</span>;
  if (d >= 365) return <span className="badge bg-green-600 text-white">{d} days • Veteran</span>;
  if (d >= 30) return <span className="badge bg-yellow-500 text-black">{d} days • Active</span>;
  return <span className="badge bg-red-500 text-white">{d} days • New</span>;
}

export default function Home() {
  const [account, setAccount] = useState(null);
  const [ethDays, setEthDays] = useState(null);
  const [baseDays, setBaseDays] = useState(null);
  const [loadingEth, setLoadingEth] = useState(false);
  const [loadingBase, setLoadingBase] = useState(false);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('Please install MetaMask');
    }
  }

  async function fetchDays(address, network) {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || FALLBACK_KEY;
    if (!apiKey) {
      console.warn('No API key provided');
      return "Error";
    }

    let baseUrl;
    let chainId;
    if (network === 'base') {
      baseUrl = 'https://api.basescan.org/v2/api';
      chainId = 8453;
    } else {
      baseUrl = 'https://api.etherscan.io/v2/api';
      chainId = 1;
    }

    const url = `${baseUrl}?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.status === '1' && Array.isArray(data.result) && data.result.length > 0) {
        const firstTx = Number(data.result[0].timeStamp) * 1000;
        const days = Math.floor((Date.now() - firstTx) / (1000 * 60 * 60 * 24));
        return days;
      } else {
        console.warn(network + ' API no txs or bad response', data);
        return "No txs";
      }
    } catch (err) {
      console.error('Fetch error', err);
      return "Error";
    }
  }

  useEffect(() => {
    if (account) {
      setEthDays(null);
      setBaseDays(null);
      setLoadingEth(true);
      setLoadingBase(true);
      fetchDays(account, 'ethereum').then((d) => { setEthDays(d); setLoadingEth(false); });
      fetchDays(account, 'base').then((d) => { setBaseDays(d); setLoadingBase(false); });
    }
  }, [account]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">🪩 Base Onchain Age Tracker</h1>
        {!account ? (
          <button onClick={connectWallet} className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700">Connect Wallet</button>
        ) : (
          <div className="space-y-4">
            <p className="break-words">Connected: <span className="text-blue-400">{account}</span></p>

            <div className="flex items-center justify-center space-x-4">
              <div className="p-4 bg-gray-800 rounded-lg w-1/2">
                <h3 className="text-sm text-gray-400">Ethereum age</h3>
                <div className="mt-2">
                  {loadingEth ? <span className="text-gray-400">Loading...</span> : <AgeBadge days={ethDays} />}
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg w-1/2">
                <h3 className="text-sm text-gray-400">Base age</h3>
                <div className="mt-2">
                  {loadingBase ? <span className="text-gray-400">Loading...</span> : <AgeBadge days={baseDays} />}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">If you see "No txs", the address hasn't made transactions on that chain yet.</p>
          </div>
        )}

        <footer className="mt-8 text-xs text-gray-500">Built for Base ⚡ by dcdsgn.eth</footer>
      </div>
    </main>
  );
}
