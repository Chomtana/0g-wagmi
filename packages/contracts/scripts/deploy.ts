import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Deploying IntelligentNFT contract...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Get deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const IntelligentNFT = await ethers.getContractFactory("IntelligentNFT");
  const inft = await IntelligentNFT.deploy();

  await inft.waitForDeployment();

  const contractAddress = await inft.getAddress();
  console.log("✅ IntelligentNFT deployed to:", contractAddress);

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId.toString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    contractName: "IntelligentNFT",
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(
    deploymentsDir,
    `${network.name}-${network.chainId}.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📄 Deployment info saved to:", deploymentFile);

  // Verify the deployment
  console.log("\n🔍 Verifying deployment...");
  const name = await inft.name();
  const symbol = await inft.symbol();
  const totalSupply = await inft.totalSupply();

  console.log("  Name:", name);
  console.log("  Symbol:", symbol);
  console.log("  Total Supply:", totalSupply.toString());

  console.log("\n✨ Deployment complete!\n");
  console.log("📋 Next steps:");
  console.log("  1. Update CONTRACT_ADDRESS in your .env file:");
  console.log(`     VITE_INFT_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("  2. Restart your development server");
  console.log("  3. Start minting iNFTs!\n");

  // Return deployment info for programmatic use
  return deploymentInfo;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
