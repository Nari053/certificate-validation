const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const factory = await hre.ethers.getContractFactory("CertificateVerification");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("CertificateVerification deployed to:", address);

  // Write the address and ABI where the web portal can read them
  const artifact = await hre.artifacts.readArtifact("CertificateVerification");
  const network = await hre.ethers.provider.getNetwork();

  const output =
    `window.CONTRACT_ADDRESS = "${address}";\n` +
    `window.CONTRACT_CHAIN_ID = ${network.chainId.toString()};\n` +
    `window.CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};\n`;

  const target = path.join(__dirname, "..", "frontend", "contract-config.js");
  fs.writeFileSync(target, output);
  console.log("Portal settings written to frontend/contract-config.js");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
