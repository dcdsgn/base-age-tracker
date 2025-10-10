import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Debug(){
  const [address, setAddress] = useState(null)
  const [ethResponse, setEthResponse] = useState(null)
  const [baseResponse, setBaseResponse] = useState(null)
  const [ts, setTs] = useState(null)

  useEffect(()=>{
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(accs => setAddress(accs[0])).catch(()=>{})
    }
  },[])

  async function testAPI(){
    if (!address) return
    setTs(new Date().toISOString())
    const key = process.env.NEXT_PUBLIC_API_KEY || ''
    const urls = {
      eth: `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&sort=asc&apikey=${key}`,
      base: `https://api.basescan.org/v2/api?chainid=8453&module=account&action=txlist&address=${address}&sort=asc&apikey=${key}`
    }
    try {
      const r1 = await fetch(urls.eth); const d1 = await r1.json(); setEthResponse(d1)
    } catch(e){
      setEthResponse({ error: e.message })
    }
    try {
      const r2 = await fetch(urls.base); const d2 = await r2.json(); setBaseResponse(d2)
    } catch(e){
      setBaseResponse({ error: e.message })
    }
  }

  return <>
    <Head><title>Debug - Base Age Tracker</title><meta name="theme-color" content="#0052FF" /><link rel="icon" href="/favicon.svg" /></Head>
    <main className="min-h-screen bg-[#0052FF] text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Debug Panel</h1>
        <p className="mb-4">Connected: {address || 'Not connected'}</p>
        <button onClick={testAPI} className="btn-flat">🔁 Test API</button>
        {ts && <p className="text-sm text-white/80 mt-2">Last tested: {ts}</p>}

        <div className="mt-6 bg-white text-black p-4">
          <h2 className="text-lg text-[#0052FF] mb-2">Ethereum Response</h2>
          <pre className="text-xs">{JSON.stringify(ethResponse, null, 2)}</pre>
        </div>

        <div className="mt-6 bg-white text-black p-4">
          <h2 className="text-lg mb-2 text-[#0052FF]">Base Response</h2>
          <pre className="text-xs">{JSON.stringify(baseResponse, null, 2)}</pre>
        </div>
      </div>
    </main>
  </>

}
