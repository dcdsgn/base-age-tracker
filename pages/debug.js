import { useState, useEffect } from "react";

export default function Debug() {
  const [address, setAddress] = useState(null);
  const [ethResponse, setEthResponse] = useState(null);
  const [baseResponse, setBaseResponse] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    async function connect() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAddress(accounts[0]);
      }
    }
    connect();
  }, []);

  async function testAPI() {
    if (!address) return;
    setTimestamp(new Date().toISOString());

    const apiKey = process.env.NEXT_PUBLIC_API_KEY || "YOUR_API_KEY_HERE";
    const urls = {
      ethereum: `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&sort=asc&apikey=${apiKey}`,
      base: `https://api.basescan.org/v2/api?chainid=8453&module=account&action=txlist&address=${address}&sort=asc&apikey=${apiKey}`,
    };

    for (const net of Object.keys(urls)) {
      try {
        const res = await fetch(urls[net]);
        const data = await res.json();
        if (net === "ethereum") setEthResponse(data);
        else setBaseResponse(data);
      } catch (err) {
        const errorObj = { error: err.message };
        if (net === "ethereum") setEthResponse(errorObj);
        else setBaseResponse(errorObj);
      }
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center text-white bg-gray-900">
      <h1 className="text-2xl mb-4">🧩 Debug Panel</h1>
      {address ? <p>Connected: {address}</p> : <p>Connect wallet to test</p>}

      <button
        onClick={testAPI}
        className="mt-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
      >
        🔁 Test API
      </button>

      {timestamp && (
        <p className="text-sm text-gray-400 mt-2">Last tested: {timestamp}</p>
      )}

      <div className="text-left mt-6 w-full max-w-3xl bg-gray-800 p-4 rounded-lg overflow-auto">
        <h2 className="text-lg mb-2">Ethereum Response:</h2>
        <pre className="text-xs bg-black p-2 rounded">{JSON.stringify(ethResponse, null, 2)}</pre>
      </div>

      <div className="text-left mt-6 w-full max-w-3xl bg-gray-800 p-4 rounded-lg overflow-auto">
        <h2 className="text-lg mb-2">Base Response:</h2>
        <pre className="text-xs bg-black p-2 rounded">{JSON.stringify(baseResponse, null, 2)}</pre>
      </div>
    </main>
  );
}
