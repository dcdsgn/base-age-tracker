import { useState, useEffect } from "react";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [ethDays, setEthDays] = useState("Loading...");
  const [baseDays, setBaseDays] = useState("Loading...");

  useEffect(() => {
    async function connect() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const addr = accounts[0];
        setAddress(addr);
        fetchAges(addr);
      }
    }
    connect();
  }, []);

  async function fetchAges(addr) {
    setEthDays("Loading...");
    setBaseDays("Loading...");
    const eth = await fetchDays(addr, "ethereum");
    const base = await fetchDays(addr, "base");
    setEthDays(eth);
    setBaseDays(base);
  }

  async function fetchDays(address, network) {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || "YOUR_API_KEY_HERE";
    let baseUrl, chainId;

    if (network === "base") {
      baseUrl = "https://api.basescan.org/v2/api";
      chainId = 8453;
    } else {
      baseUrl = "https://api.etherscan.io/v2/api";
      chainId = 1;
    }

    const url = `${baseUrl}?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "1" && Array.isArray(data.result) && data.result.length > 0) {
        const firstTx = Number(data.result[0].timeStamp) * 1000;
        const days = Math.floor((Date.now() - firstTx) / (1000 * 60 * 60 * 24));
        return days;
      } else if (data.status === "0") {
        return "No txs";
      } else {
        console.warn("Invalid response", data);
        return "Error";
      }
    } catch (err) {
      console.error(err);
      return "Error";
    }
  }

  function getBadge(days) {
    if (typeof days !== "number") return "";
    if (days > 365) return "🟢 Veteran";
    if (days > 30) return "🟡 Active";
    return "🔴 New";
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center text-white bg-gradient-to-br from-blue-900 to-blue-600">
      <h1 className="text-3xl mb-6">🪩 Base Onchain Age Tracker</h1>
      {address ? (
        <div>
          <p className="mb-4">Connected: {address}</p>
          <div className="space-y-3">
            <div>
              <p>Ethereum age:</p>
              <p className="text-lg font-semibold">
                {ethDays} days {getBadge(Number(ethDays))}
              </p>
            </div>
            <div>
              <p>Base age:</p>
              <p className="text-lg font-semibold">
                {baseDays} days {getBadge(Number(baseDays))}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>Connect wallet to view your onchain age</p>
      )}
      <p className="text-sm text-gray-400 mt-8">
        Built for Base ⚡ by dcdsgn.eth ·{" "}
        <a href="/debug" target="_blank" rel="noopener noreferrer" className="underline text-gray-300">
          Debug
        </a>
      </p>
    </main>
  );
}
