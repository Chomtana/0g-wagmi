// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IntelligentNFT
 * @dev ERC-721 NFT contract for AI-powered NFTs with encrypted metadata on 0G Storage
 *
 * Features:
 * - Mint iNFTs with metadata stored on 0G Storage
 * - Transfer with optional re-encryption for new owner
 * - Query metadata hash for decryption
 * - Support for AI agent configuration and model weights
 */
contract IntelligentNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    // Counter for token IDs
    uint256 private _nextTokenId;

    // Mapping from token ID to 0G Storage metadata hash
    mapping(uint256 => string) private _metadataHashes;

    // Mapping from token ID to mint timestamp
    mapping(uint256 => uint256) private _mintTimestamps;

    // Events
    event InftMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataHash,
        uint256 timestamp
    );

    event MetadataUpdated(
        uint256 indexed tokenId,
        string oldMetadataHash,
        string newMetadataHash
    );

    event InftTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        string newMetadataHash
    );

    constructor() ERC721("Intelligent NFT", "iNFT") Ownable(msg.sender) {
        _nextTokenId = 1; // Start token IDs at 1
    }

    /**
     * @dev Mint a new iNFT with encrypted metadata stored on 0G Storage
     * @param to Address to mint the NFT to
     * @param metadataHash 0G Storage root hash of encrypted metadata
     * @return tokenId The ID of the newly minted token
     */
    function mint(address to, string memory metadataHash)
        public
        nonReentrant
        returns (uint256)
    {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(metadataHash).length > 0, "Metadata hash cannot be empty");

        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _metadataHashes[tokenId] = metadataHash;
        _mintTimestamps[tokenId] = block.timestamp;

        emit InftMinted(tokenId, to, metadataHash, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Batch mint multiple iNFTs
     * @param to Address to mint the NFTs to
     * @param metadataHashes Array of 0G Storage root hashes
     * @return tokenIds Array of newly minted token IDs
     */
    function batchMint(address to, string[] memory metadataHashes)
        public
        nonReentrant
        returns (uint256[] memory)
    {
        require(to != address(0), "Cannot mint to zero address");
        require(metadataHashes.length > 0, "Must mint at least one token");
        require(metadataHashes.length <= 50, "Cannot mint more than 50 tokens at once");

        uint256[] memory tokenIds = new uint256[](metadataHashes.length);

        for (uint256 i = 0; i < metadataHashes.length; i++) {
            require(bytes(metadataHashes[i]).length > 0, "Metadata hash cannot be empty");

            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
            _metadataHashes[tokenId] = metadataHashes[i];
            _mintTimestamps[tokenId] = block.timestamp;

            tokenIds[i] = tokenId;
            emit InftMinted(tokenId, to, metadataHashes[i], block.timestamp);
        }

        return tokenIds;
    }

    /**
     * @dev Update metadata hash (e.g., after re-encryption during transfer)
     * Only the token owner can update
     * @param tokenId Token ID to update
     * @param newMetadataHash New 0G Storage root hash
     */
    function updateMetadata(uint256 tokenId, string memory newMetadataHash)
        public
    {
        require(ownerOf(tokenId) == msg.sender, "Only owner can update metadata");
        require(bytes(newMetadataHash).length > 0, "Metadata hash cannot be empty");

        string memory oldHash = _metadataHashes[tokenId];
        _metadataHashes[tokenId] = newMetadataHash;

        emit MetadataUpdated(tokenId, oldHash, newMetadataHash);
    }

    /**
     * @dev Get the 0G Storage metadata hash for a token
     * @param tokenId Token ID to query
     * @return metadataHash The 0G Storage root hash
     */
    function getMetadataHash(uint256 tokenId) public view returns (string memory) {
        _requireOwned(tokenId);
        return _metadataHashes[tokenId];
    }

    /**
     * @dev Get mint timestamp for a token
     * @param tokenId Token ID to query
     * @return timestamp The Unix timestamp when the token was minted
     */
    function getMintTimestamp(uint256 tokenId) public view returns (uint256) {
        _requireOwned(tokenId);
        return _mintTimestamps[tokenId];
    }

    /**
     * @dev Get all token IDs owned by an address
     * @param owner Address to query
     * @return tokenIds Array of token IDs owned by the address
     */
    function tokensOfOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;

        // Iterate through all minted tokens to find owner's tokens
        // Note: This is gas-intensive for large collections
        // In production, consider using an enumerable extension or indexer
        for (uint256 tokenId = 1; tokenId < _nextTokenId && index < balance; tokenId++) {
            if (_ownerOf(tokenId) == owner) {
                tokens[index] = tokenId;
                index++;
            }
        }

        return tokens;
    }

    /**
     * @dev Get comprehensive info about a token
     * @param tokenId Token ID to query
     * @return owner Owner address
     * @return metadataHash 0G Storage root hash
     * @return mintTimestamp Unix timestamp of minting
     */
    function getTokenInfo(uint256 tokenId)
        public
        view
        returns (
            address owner,
            string memory metadataHash,
            uint256 mintTimestamp
        )
    {
        owner = ownerOf(tokenId);
        metadataHash = _metadataHashes[tokenId];
        mintTimestamp = _mintTimestamps[tokenId];
    }

    /**
     * @dev Get the next token ID that will be minted
     * @return The next token ID
     */
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Get total supply of minted tokens
     * @return Total number of tokens minted
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        // Return the 0G Storage hash as the token URI
        // Frontend can construct the full URL: https://indexer-storage-testnet-turbo.0g.ai/file?root={hash}
        return _metadataHashes[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
