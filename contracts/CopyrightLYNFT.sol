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
  mapping(address => uint256) public amountMinted;

  event NFTMinted(address indexed minter, uint256 tokenId, string tokenUri,
    address manifestations, string manifestationHash);

  constructor(address _manifestations) ERC721("CopyrightLY NFT", "CLYNFT") {
    manifestations = _manifestations;
  }

  function mint(string memory manifestationHash, string memory metadataHash) public
  whenNotPaused() isAuthor(manifestationHash) isMintable(manifestationHash) returns (uint256)
  {
    uint256 tokenId = uint256(keccak256(abi.encodePacked(msg.sender, amountMinted[msg.sender])));
    _mint(msg.sender, tokenId);
    string memory tokenUri = string(abi.encodePacked(_baseURI(), metadataHash));
    _setTokenURI(tokenId, tokenUri);
    amountMinted[msg.sender]++;
    emit NFTMinted(msg.sender, tokenId, tokenUri, manifestations, manifestationHash);
    return tokenId;
  }

  modifier isAuthor(string memory manifestationHash) {
    ( , address[] memory authors, , )  = Manifestations(manifestations).getManifestation(manifestationHash);
    require(_contains(authors, msg.sender),
      "Only authors can mint NFTs for a manifestation");
    _;
  }

  modifier isMintable(string memory manifestationHash) {
    require(Stakable(manifestations).isStaked(manifestationHash),
      "NFT cannot be minted if manifestation without stake");
    require(!Evidencable(manifestations).isUnevidenced(manifestationHash),
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
