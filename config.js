// Portal settings. Edit these values before using the portal.
window.APP_CONFIG = {
  // Read-only connection used by the Verify tab (no wallet needed).
  // Local Hardhat node: http://127.0.0.1:8545
  // Sepolia: use your Infura or Alchemy Sepolia URL
  RPC_URL: "http://127.0.0.1:8545",

  // Pinata API key (JWT) from https://app.pinata.cloud  -> API Keys
  // For a demo only. In a real product, upload through a backend so the key stays private.
  PINATA_JWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZGEzMjgyYS04NmM1LTRjZTItYjM1Zi0wMDgyMWE5MTY1NzUiLCJlbWFpbCI6Im5hcmVuZHJha290dGkyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiYWJjZWQzZDVjOGU4MGU1NGYzMSIsInNjb3BlZEtleVNlY3JldCI6IjZhOGY3OGM2ZGZmM2U4NDMzOWMyYjc2MjBiOTZlNmFmOWU3NDY0N2ZjMTQxN2Q5ZGQzMDg4ZmQ1MGIxZDFkOGIiLCJleHAiOjE4MjQ1Nzg0MDR9.rMLMA62YrysGYfhMmlqyf9ik3xQcEMjgMrYIwwrs56s",

  // Where uploaded certificates are opened
  IPFS_GATEWAY: "https://gateway.pinata.cloud/ipfs/"
};
