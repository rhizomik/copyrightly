// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.6;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "./Evidencable.sol";

contract YouTubeEvidence is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  address private oracle;
  bytes32 private jobId;
  uint256 private fee;

  // Data storage
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
    setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB); // goerli
    oracle = 0xeecA89a3895F7df577dd5e7C4E816e2fe2da92f1; // oracle address
    jobId = "43702de4d9474a2289fe87a95176cb60"; //job id
    fee = 1 * 10 ** 16; // 0.01 LINK
  }

  /// @notice Check using an oracle if the YouTube `videoId` is linked to the manifestation with
  /// identifier `evidencedId` in the registry with address `registry`.
  /// @dev The oracle checks if the YouTube page for the video contains in its description
  /// the manifestation hash.
  /// @param registry The address of the contract holding the items receiving evidence
  /// @param evidencedId The identifier used by the registry contract for the item receiving evidence
  /// @param videoId The identifier of a YouTube video to be checked
  /// @return requestId The id for the request sent to the oracle
  function check(address registry, string memory evidencedId, string memory videoId) public
  returns (bytes32 requestId) {
    Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.processVerification.selector);
    req.add("id", videoId);
    req.add("hash", evidencedId);
    requestId = sendChainlinkRequestTo(oracle, req, fee);
    evidences[requestId] = YTEvidence(registry, msg.sender, evidencedId, videoId, true, false);
    emit VerificationRequest(requestId, evidencedId, videoId);
  }

  /// @notice Process the oracle callback for query `requestId` to check if `valid`
  /// @param requestId The identifier of the oracle query
  /// @param valid True if the video description contains the hash
  function processVerification(bytes32 requestId, bool valid) public recordChainlinkFulfillment(requestId) {
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
