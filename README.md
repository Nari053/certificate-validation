# Blockchain-Based Certificate Verification System

Issue certificates, store the files on IPFS, record each certificate's fingerprint (SHA-256 hash) on Ethereum, and let employers or institutions verify them in a web portal.

## How it works

1. The institution (admin wallet) opens the **Issue** tab and picks a certificate file.
2. The portal calculates the file's SHA-256 hash and uploads the file to IPFS (Pinata), which returns a CID.
3. The smart contract stores the certificate ID, student name, course, CID, hash, and issue date.
4. An employer opens the **Verify** tab, enters the certificate ID, and adds the file. The portal recalculates the hash and asks the contract whether it matches.
5. If even one byte of the file is changed, the hash changes and the result is **Invalid**.

## Project structure

```
contracts/CertificateVerification.sol   Smart contract (Solidity)
test/CertificateVerification.test.js    Automated tests (the 6 report test cases + extras)
scripts/deploy.js                       Deploys the contract and writes frontend/contract-config.js
frontend/index.html                     Issue + Verify portal (HTML, CSS, JavaScript, Web3.js)
frontend/config.js                      Your settings (RPC URL, Pinata key)
hardhat.config.js, package.json         Project setup
```

## Requirements

- Node.js 18 or newer (https://nodejs.org)
- MetaMask browser extension (https://metamask.io)
- A free Pinata account for IPFS (https://app.pinata.cloud)
- A code editor such as VS Code

## Setup and run (local blockchain)

Run each command from the project folder.

1. Install packages:
   ```
   npm install
   ```
2. Run the tests (all should pass):
   ```
   npx hardhat test
   ```
3. Start a local blockchain. Keep this terminal open:
   ```
   npx hardhat node
   ```
   It prints 20 test accounts with private keys. Account #0 is the admin.
4. In a second terminal, deploy the contract:
   ```
   npm run deploy:local
   ```
   This prints the contract address and writes `frontend/contract-config.js`.
5. Set up MetaMask:
   - Add a network: RPC URL `http://127.0.0.1:8545`, Chain ID `31337`, currency `ETH`.
   - Import Account #0 using its private key from step 3. This is the admin wallet.
   - Use these test keys on the local network only.
6. Get a Pinata API key (JWT): Pinata dashboard, API Keys, New Key, enable `pinFileToIPFS`. Paste the JWT into `frontend/config.js`.
7. Start the portal:
   ```
   npm run frontend
   ```
   Open http://localhost:3000

## Using the portal

**Issue (admin):** Issue tab, Connect MetaMask, fill in the ID, student name, course, choose the certificate file, then Issue certificate and confirm in MetaMask. Use dummy student names for the demo.

**Verify (anyone):** Verify tab, enter the ID, choose the same file, and press Verify certificate.

## Test scenarios for your report screenshots

| Scenario | What to do | Expected result |
|---|---|---|
| Valid certificate | Verify with the original file | Valid |
| Tampered certificate | Edit the file (for example change one word, or save it again) and verify | Invalid |
| Unknown ID | Verify with an ID that was never issued | Not found |
| Non-admin issuing | Connect a different MetaMask account on the Issue tab | "Not the admin wallet" message |
| Duplicate ID | Issue the same ID twice | "Already registered" message |

## Optional: deploy to the Sepolia test network

1. Copy `.env.example` to `.env`. Add a Sepolia RPC URL (Infura or Alchemy) and the private key of a NEW test wallet.
2. Get free test ETH from a Sepolia faucet.
3. Run `npm run deploy:sepolia`.
4. In `frontend/config.js` set `RPC_URL` to your Sepolia URL. In MetaMask, switch to Sepolia.

## Notes

- The Pinata key in `frontend/config.js` is visible to anyone who opens the portal. This is fine for a demo, but a real product should upload through a small backend server.
- Never commit `.env` or use a wallet that holds real money.
- Revoking a certificate is included in the contract (`revokeCertificate`). Revoked certificates show as "Revoked" in the portal. A revoke button is not in the web page; you can call it from the Hardhat console.
- Gas fees apply on public networks. They are free on the local Hardhat network.
