// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.6;

import "./Evidencable.sol";

contract YouTubeEvidenceMock {

  bytes32 private requestCounter;

  struct YTEvidence {
    address registry;
    address evidencer;
    string evidencedId;
    string videoId;
    bool isPending;
    bool isVerified;
  }

  mapping(bytes32 => YTEvidence) public evidences;

  event VerificationRequest(bytes32 indexed requestId, string evidencedHash, string videoId);
  event YouTubeEvidenceEvent(bytes32 indexed requestId, address indexed registry,
    string evidencedHash, string videoId, address indexed evidencer, bool isVerified);

  constructor() {
    requestCounter = bytes32(uint(1));
  }

  function check(address registry, string memory evidencedId, string memory videoId) public
  returns (bytes32) {
    requestCounter = requestCounter << 1;
    evidences[requestCounter] = YTEvidence(registry, msg.sender, evidencedId, videoId, true, false);
    emit VerificationRequest(requestCounter, evidencedId, videoId);
    bool isValid = false;
    if (keccak256(bytes(videoId)) == keccak256(bytes("ZwVNLDIJKVA"))) {
      isValid = true;
    }
    processVerification(requestCounter, isValid);
    return requestCounter;
  }

  function processVerification(bytes32 requestId, bool valid) public {
    require(evidences[requestId].isPending);

    evidences[requestId].isPending = false;
    if (valid) {
      Evidencable(evidences[requestId].registry).addEvidence(evidences[requestId].evidencedId);
      evidences[requestId].isVerified = true;
    }
    emit YouTubeEvidenceEvent(requestId, evidences[requestId].registry,
      evidences[requestId].evidencedId, evidences[requestId].videoId,
      evidences[requestId].evidencer, evidences[requestId].isVerified);
  }
}
