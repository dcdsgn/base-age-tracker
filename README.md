# 💙 Base Onchain Age Tracker

A minimal **onchain age viewer** built for the **Base** network.  
Check how long your address has been active on **Ethereum** and **Base** — instantly, from your wallet.

![Base Onchain Age Tracker](https://base.org/favicon.ico)

---

## ⚡ Features

- 🧩 Connect wallet with MetaMask  
- ⏳ See your account age in days for **Ethereum** and **Base**  
- 🟢 “Veteran”, “Active”, and “New” status badges  
- 🧠 Built with **Next.js**, **React**, and **TailwindCSS**  
- 🎨 Flat design in official **Base Blue (#0052FF)**  
- 🖼️ Includes favicon and fixed footer styled after [base.org](https://base.org)

---

## 🛠️ Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/base-age-tracker.git
   cd base-age-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local`**
   ```bash
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

   🔑 You can get your free API key from:
   - [Etherscan API Keys](https://etherscan.io/myapikey)
   - [BaseScan API Keys](https://basescan.org/myapikey)

4. **Run locally**
   ```bash
   npm run dev
   ```
   Then open [http://localhost:3000](http://localhost:3000)

5. **Deploy**
   You can deploy instantly on [Vercel](https://vercel.com).  
   Just import the GitHub repo and set your environment variable:
   - `NEXT_PUBLIC_API_KEY`

---

## 🧩 Tech Stack

| Tool | Purpose |
|------|----------|
| 🧠 **Next.js 14** | React framework |
| ⚛️ **React 18** | UI rendering |
| 💨 **TailwindCSS 3** | Styling |
| 🧾 **Ethers.js 6** | Blockchain interaction |
| 🔍 **Etherscan / BaseScan APIs** | Transaction data |

---

## 🪩 UI Highlights

- Flat, **blue & white** Base aesthetic  
- Clean typography with Inter font  
- Responsive layout for mobile and desktop  
- Fixed footer:
  ```
  Built for Base ⚡ by dcdsgn.eth · Debug
  ```

---

## 🧠 Troubleshooting

### ⚠️ “Base age: Error”
If you see this message:
- Make sure your `.env.local` includes a **valid API key**
- Try changing the BaseScan endpoint in `/pages/index.js` from  
  ```
  https://api.basescan.org/v2/api
  ```
  to  
  ```
  https://api.basescan.org/api
  ```
- Wait a few minutes — BaseScan sometimes throttles free API keys.

---

## 🧑‍💻 Author

**dcdsgn.eth**  
Made with 💙 for the Base ecosystem.

---

## 🧠 License

MIT — open source and free to build upon.

---

> “The future is onchain.”  
> — *Base Team*
