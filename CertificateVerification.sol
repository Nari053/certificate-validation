// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertificateVerification
 * @notice Stores a fingerprint (SHA-256 hash) and IPFS address (CID) for every
 *         certificate an institution issues, so anyone can verify it later.
 *         The certificate file itself lives on IPFS, not on the blockchain.
 */
contract CertificateVerification {
    address public admin;
    uint256 public totalCertificates;

    struct Certificate {
        string studentName;
        string course;
        string ipfsCID;
        bytes32 certHash;
        uint256 issueDate;
        bool exists;
        bool revoked;
    }

    // certificate ID (for example "CERT-2026-001") => certificate record
    mapping(string => Certificate) private certificates;

    event CertificateIssued(string certId, bytes32 certHash, string ipfsCID);
    event CertificateRevoked(string certId);
    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Register a new certificate. Only the admin (the institution) can do this.
    function issueCertificate(
        string memory certId,
        string memory studentName,
        string memory course,
        string memory ipfsCID,
        bytes32 certHash
    ) public onlyAdmin {
        require(bytes(certId).length > 0, "Certificate ID required");
        require(certHash != bytes32(0), "Certificate hash required");
        require(!certificates[certId].exists, "Certificate already issued");

        certificates[certId] = Certificate({
            studentName: studentName,
            course: course,
            ipfsCID: ipfsCID,
            certHash: certHash,
            issueDate: block.timestamp,
            exists: true,
            revoked: false
        });
        totalCertificates += 1;

        emit CertificateIssued(certId, certHash, ipfsCID);
    }

    /// @notice Cancel a certificate (for example, if it was issued by mistake).
    function revokeCertificate(string memory certId) public onlyAdmin {
        require(certificates[certId].exists, "Certificate not found");
        require(!certificates[certId].revoked, "Already revoked");

        certificates[certId].revoked = true;
        emit CertificateRevoked(certId);
    }

    /// @notice Hand the admin role to another wallet.
    function transferAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        emit AdminTransferred(admin, newAdmin);
        admin = newAdmin;
    }

    /// @notice True only if the certificate exists, is not revoked, and the hash matches.
    function verifyCertificate(string memory certId, bytes32 certHash)
        public
        view
        returns (bool)
    {
        Certificate memory c = certificates[certId];
        return c.exists && !c.revoked && c.certHash == certHash;
    }

    /// @notice Check whether a certificate ID has been registered.
    function certificateExists(string memory certId) public view returns (bool) {
        return certificates[certId].exists;
    }

    /// @notice Read the stored details of a certificate.
    function getCertificate(string memory certId)
        public
        view
        returns (
            string memory studentName,
            string memory course,
            string memory ipfsCID,
            bytes32 certHash,
            uint256 issueDate,
            bool revoked
        )
    {
        Certificate memory c = certificates[certId];
        require(c.exists, "Certificate not found");
        return (c.studentName, c.course, c.ipfsCID, c.certHash, c.issueDate, c.revoked);
    }
}
