import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Home(){
  const [address, setAddress] = useState(null)
  const [ethDays, setEthDays] = useState(null)
  const [baseDays, setBaseDays] = useState(null)
  const [loadingEth, setLoadingEth] = useState(false)
  const [loadingBase, setLoadingBase] = useState(false)

  useEffect(()=>{
    // auto connect if MetaMask present (doesn't request permission)
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.selectedAddress) {
      setAddress(window.ethereum.selectedAddress)
    }
  },[])

  async function connect(){
    if (!window.ethereum) {
      alert('Please install MetaMask')
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const acct = accounts[0]
      setAddress(acct)
      fetchAges(acct)
    } catch(e){
      console.error(e)
    }
  }

  async function fetchAges(acct){
    setLoadingEth(true); setLoadingBase(true)
    const eth = await fetchDays(acct, 'ethereum')
    const base = await fetchDays(acct, 'base')
    setEthDays(eth); setBaseDays(base)
    setLoadingEth(false); setLoadingBase(false)
  }

  async function fetchDays(address, network){
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
    if (!apiKey) return 'Error'
    let baseUrl = network==='base' ? 'https://api.basescan.org/api' : 'https://api.etherscan.io/v2/api'
    const chainId = network==='base' ? 8453 : 1
    const url = `${baseUrl}?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data && data.status === '1' && Array.isArray(data.result) && data.result.length>0){
        const first = Number(data.result[0].timeStamp)*1000
        const days = Math.floor((Date.now() - first)/(1000*60*60*24))
        return days
      } else if (data && data.status === '0') {
        return 'No txs'
      } else {
        console.warn('bad response', data)
        return 'Error'
      }
    } catch(e){
      console.error(e)
      return 'Error'
    }
  }

  function badgeFor(days){
    if (typeof days !== 'number') return ''
    if (days>=365) return '• Veteran'
    if (days>=30) return '• Active'
    return '• New'
  }

  return <>
    <Head>
      <title>Base Onchain Age Tracker</title>
      <meta name="theme-color" content="#0052FF" />
      <link rel="icon" href="/favicon.svg" />
    </Head>

    <main className="min-h-screen flex flex-col">
      <div className="container flex-grow flex items-center justify-center">
        <div className="w-full">
          <h1 className="text-white text-3xl font-semibold mb-6">Base Onchain Age Tracker</h1>

          <div className="card fade-in">
            {!address ? (
              <div className="flex items-center justify-center">
                <button onClick={connect} className="btn-flat">Connect Wallet</button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-white text-sm">Connected: <span className="font-mono">{address}</span></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-white/90 uppercase">Ethereum age</p>
                    <p className="text-2xl font-medium mt-1">{loadingEth ? 'Loading...' : (ethDays === null ? '—' : (typeof ethDays === 'number' ? `${ethDays} days ${badgeFor(ethDays)}` : ethDays))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/90 uppercase">Base age</p>
                    <p className="text-2xl font-medium mt-1">{loadingBase ? 'Loading...' : (baseDays === null ? '—' : (typeof baseDays === 'number' ? `${baseDays} days ${badgeFor(baseDays)}` : baseDays))}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer-fixed">
        Built for Base ⚡ by dcdsgn.eth · <a href="/debug" target="_blank" className="underline text-white">Debug</a>
      </footer>
    </main>
  </>

}
