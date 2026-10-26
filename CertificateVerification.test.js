const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateVerification", function () {
  let contract;
  let admin;
  let stranger;

  const certId = "CERT-2026-001";
  const cid = "QmExampleCidForTesting123";
  const goodHash = ethers.keccak256(ethers.toUtf8Bytes("original certificate"));
  const badHash = ethers.keccak256(ethers.toUtf8Bytes("tampered certificate"));

  beforeEach(async function () {
    [admin, stranger] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("CertificateVerification");
    contract = await factory.deploy();
    await contract.waitForDeployment();
  });

  // Test case 1
  it("lets the admin issue a certificate and emits an event", async function () {
    await expect(
      contract.issueCertificate(certId, "Asha Rao", "Blockchain Basics", cid, goodHash)
    )
      .to.emit(contract, "CertificateIssued")
      .withArgs(certId, goodHash, cid);

    expect(await contract.certificateExists(certId)).to.equal(true);
    expect(await contract.totalCertificates()).to.equal(1n);
  });

  // Test case 2
  it("verifies an original certificate as valid", async function () {
    await contract.issueCertificate(certId, "Asha Rao", "Blockchain Basics", cid, goodHash);
    expect(await contract.verifyCertificate(certId, goodHash)).to.equal(true);
  });

  // Test case 3
  it("rejects a tampered certificate", async function () {
    await contract.issueCertificate(certId, "Asha Rao", "Blockchain Basics", cid, goodHash);
    expect(await contract.verifyCertificate(certId, badHash)).to.equal(false);
  });

  // Test case 4
  it("returns false for a certificate ID that does not exist", async function () {
    expect(await contract.certificateExists("CERT-UNKNOWN")).to.equal(false);
    expect(await contract.verifyCertificate("CERT-UNKNOWN", goodHash)).to.equal(false);
    await expect(contract.getCertificate("CERT-UNKNOWN")).to.be.revertedWith(
      "Certificate not found"
    );
  });

  // Test case 5
  it("rejects issuing from a non-admin account", async function () {
    await expect(
      contract
        .connect(stranger)
        .issueCertificate(certId, "Asha Rao", "Blockchain Basics", cid, goodHash)
    ).to.be.revertedWith("Only admin allowed");
  });

  // Test case 6
  it("rejects a duplicate certificate ID", async function () {
    await contract.issueCertificate(certId, "Asha Rao", "Blockchain Basics", cid, goodHash);
    await expect(
      contract.issueCertificate(certId, "Someone Else", "Other Course", cid, badHash)
    ).to.be.revertedWith("Certificate already issued");
  });

  it("returns the stored certificate details", async function () {
    await contract.issueCertificate(certId, "Asha Rao", "Blockchain Basics", cid, goodHash);
    const c = await contract.getCertificate(certId);
    expect(c.studentName).to.equal("Asha Rao");
    expect(c.course).to.equal("Blockchain Basics");
    expect(c.ipfsCID).to.equal(cid);
    expect(c.certHash).to.equal(goodHash);
    expect(c.revoked).to.equal(false);
  });

  it("fails verification after a certificate is revoked", async function () {
    await contract.issueCertificate(certId, "Asha Rao", "Blockchain Basics", cid, goodHash);
    await contract.revokeCertificate(certId);
    expect(await contract.verifyCertificate(certId, goodHash)).to.equal(false);
    const c = await contract.getCertificate(certId);
    expect(c.revoked).to.equal(true);
  });

  it("only lets the admin revoke or transfer the admin role", async function () {
    await contract.issueCertificate(certId, "Asha Rao", "Blockchain Basics", cid, goodHash);
    await expect(contract.connect(stranger).revokeCertificate(certId)).to.be.revertedWith(
      "Only admin allowed"
    );
    await contract.transferAdmin(stranger.address);
    expect(await contract.admin()).to.equal(stranger.address);
  });
});
