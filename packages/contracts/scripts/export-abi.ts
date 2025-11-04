import * as fs from "fs";
import * as path from "path";

/**
 * Export contract ABI and deployment addresses for use in frontend
 */
async function main() {
  console.log("📦 Exporting contract ABI and addresses...\n");

  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/IntelligentNFT.sol/IntelligentNFT.json"
  );

  if (!fs.existsSync(artifactPath)) {
    console.error("❌ Contract artifact not found. Please compile first:");
    console.error("   pnpm compile");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  // Read deployment addresses
  const deploymentsDir = path.join(__dirname, "../deployments");
  const deployments: Record<string, any> = {};

  if (fs.existsSync(deploymentsDir)) {
    const files = fs.readdirSync(deploymentsDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const deployment = JSON.parse(
          fs.readFileSync(path.join(deploymentsDir, file), "utf-8")
        );
        const key = `chain_${deployment.chainId}`;
        deployments[key] = {
          address: deployment.contractAddress,
          network: deployment.network,
          deployedAt: deployment.deployedAt,
        };
      }
    }
  }

  // Create export file
  const exportData = {
    contractName: "IntelligentNFT",
    abi: artifact.abi,
    deployments,
  };

  // Save to contracts package
  const contractsExportPath = path.join(__dirname, "../exports/contract.json");
  const exportsDir = path.join(__dirname, "../exports");
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  fs.writeFileSync(contractsExportPath, JSON.stringify(exportData, null, 2));

  console.log("✅ Contract data exported to:", contractsExportPath);

  // Also copy to examples package for easy import
  const examplesExportPath = path.join(
    __dirname,
    "../../examples/src/contracts/IntelligentNFT.json"
  );
  const examplesContractsDir = path.join(
    __dirname,
    "../../examples/src/contracts"
  );

  if (!fs.existsSync(examplesContractsDir)) {
    fs.mkdirSync(examplesContractsDir, { recursive: true });
  }
  fs.writeFileSync(examplesExportPath, JSON.stringify(exportData, null, 2));

  console.log("✅ Contract data copied to:", examplesExportPath);

  console.log("\n📋 Deployment addresses:");
  for (const [key, deployment] of Object.entries(deployments)) {
    console.log(`  ${deployment.network} (${key}): ${deployment.address}`);
  }

  console.log("\n✨ Export complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Export failed:", error);
    process.exit(1);
  });
