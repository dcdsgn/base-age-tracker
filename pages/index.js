import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [address, setAddress] = useState("");
  const [ethAge, setEthAge] = useState("");
  const [baseAge, setBaseAge] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const fetchAge = async (chain) => {
    try {
      const baseUrl =
        chain === "eth"
          ? "https://api.etherscan.io/v2/api"
          : "https://api.basescan.org/v2/api";

      const url = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
      let res = await fetch(url);
      let data = await res.json();
      console.log(`${chain.toUpperCase()} raw response:`, data);

      // fallback на токен-транзакции
      if ((!data.result || data.result.length === 0) && chain === "base") {
        console.log("No regular txs found, checking token txs...");
        const tokenUrl = `${baseUrl}?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
        const tokenRes = await fetch(tokenUrl);
        const tokenData = await tokenRes.json();
        if (tokenData.result && tokenData.result.length > 0) {
          data.result = tokenData.result;
          console.log("Token txs found:", tokenData.result.length);
        }
      }

      if (data.result && data.result.length > 0) {
        const firstTx = data.result[0];
        const ts =
          firstTx.timeStamp || firstTx.timestamp || firstTx.blockTimestamp || null;

        if (!ts || isNaN(ts)) {
          console.warn(`Invalid timestamp in ${chain} tx`, firstTx);
          return "Error";
        }

        const firstTimestamp = parseInt(ts) * 1000;
        const days = Math.floor(
          (Date.now() - firstTimestamp) / (1000 * 60 * 60 * 24)
        );
        return days;
      } else {
        return "No txs";
      }
    } catch (err) {
      console.error("Error fetching data for", chain, err);
      return "Error";
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!address) return;
      setLoading(true);
      const eth = await fetchAge("eth");
      const base = await fetchAge("base");
      setEthAge(eth);
      setBaseAge(base);
      setLoading(false);
    };
    loadData();
  }, [address]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0052FF] text-white">
      <main className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold mt-10">Base Onchain Age Tracker</h1>
        {address ? (
          <>
            <p>Connected: {address}</p>

            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold">Ethereum age</h2>
              <p>
                {loading
                  ? "Loading..."
                  : ethAge === "No txs"
                  ? "No txs"
                  : ethAge === "Error"
                  ? "Error"
                  : ethAge + " days • Veteran"}
              </p>
            </div>

            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold">Base age</h2>
              <p>
                {loading
                  ? "Loading..."
                  : baseAge === "No txs"
                  ? "No txs"
                  : baseAge === "Error"
                  ? "Error"
                  : baseAge + " days • Onchain"}
              </p>
            </div>
          </>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-white text-[#0052FF] px-6 py-2 mt-4 font-medium uppercase"
          >
            Connect Wallet
          </button>
        )}
      </main>

      <footer className="fixed bottom-4 text-center w-full text-sm text-white">
        Built for Base ⚡ by dcdsgn.eth · Debug
      </footer>
    </div>
  );
}
