// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.6;

import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";
import "./Manifestations.sol";
import "./Evidencable.sol";
import "./Stakable.sol";

/**
 * @title CopyrightLY NFTs for reuse licenses
 */
contract CopyrightLYNFT is Ownable, Pausable, ERC721URIStorage {

  address public manifestations;

  constructor(address _manifestations) ERC721("CopyrightLY NFT", "CLYNFT") {
    manifestations = _manifestations;
  }

  function mint(string memory manifestation, string memory metadataHash) public
  whenNotPaused() isAuthor(manifestation) isMintable(manifestation) returns (uint256)
  {
    uint256 itemId = uint256(keccak256(abi.encodePacked(metadataHash)));
    _mint(msg.sender, itemId);
    _setTokenURI(itemId, string(abi.encodePacked(_baseURI(), metadataHash)));
    return itemId;
  }

  modifier isAuthor(string memory manifestation) {
    ( , address[] memory authors, , )  = Manifestations(manifestations).getManifestation(manifestation);
    require(_contains(authors, msg.sender),
      "Only authors can mint NFTs for a manifestation");
    _;
  }

  modifier isMintable(string memory manifestation) {
    require(Stakable(manifestations).isStaked(manifestation),
      "NFT cannot be minted if manifestation without stake");
    require(!Evidencable(manifestations).isUnevidenced(manifestation),
      "NFT cannot be minted if manifestation without evidence");
    _;
  }

  /**
   * @dev Base URI for computing {tokenURI}.
   */
  function _baseURI() override internal view virtual returns (string memory) {
    return "ipfs://";
  }

  function _contains(address[] memory accounts, address account) private pure returns(bool) {
    for (uint i = 0; i < accounts.length; i++) {
      if (accounts[i] == account) {
        return true;
      }
    }
    return false;
  }
}
