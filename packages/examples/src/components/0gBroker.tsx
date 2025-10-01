import { useState } from "react";
import {
  use0gAddFunds,
  use0gBalance,
  use0gServices,
  use0gWithdrawFunds,
} from "0g-wagmi";
import { useAccount } from "wagmi";

export function ZGBrokerComponent() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("0.1");

  const {
    balance,
    isLoading: isLoadingBalance,
    refetch,
  } = use0gBalance({
    enabled: isConnected,
    refetchInterval: 10000,
  });

  const { addFunds, isLoading: isAddingFunds } = use0gAddFunds({
    onSuccess: (txHash) => {
      console.log(`Success! Transaction: ${txHash}`);
      refetch();
      setAmount("");
    },
    onError: (error) => {
      console.error(`Error: ${error.message}`);
    },
  });

  const { withdrawFunds, isLoading: isWithdrawingFunds } = use0gWithdrawFunds({
    onSuccess: (txHash) => {
      console.log(`Success! Transaction: ${txHash}`);
      refetch();
      setAmount("");
    },
  });

  const { services } = use0gServices();

  console.log("services", services);

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      console.error("Please enter a valid amount");
      return;
    }
    console.log("Adding funds...");
    await addFunds(amount);
  };

  const handleWithdrawFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      console.error("Please enter a valid amount");
      return;
    }
    console.log("Withdrawing funds...");
    await withdrawFunds(amount);
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">0G Broker</h2>
        <p className="text-gray-600">Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">0G Broker Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Connected Account</h3>
        <p className="text-sm text-gray-600 break-all">{address}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Balance Information</h3>
        {isLoadingBalance ? (
          <p className="text-gray-500">Loading balance...</p>
        ) : balance ? (
          <div className="space-y-2 bg-gray-50 p-4 rounded">
            <div className="flex justify-between">
              <span className="font-medium">Total Balance:</span>
              <span>{(Number(balance.totalBalance) / 1e18).toFixed(6)} OG</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Available Balance:</span>
              <span>
                {(Number(balance.availableBalance) / 1e18).toFixed(6)} OG
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No balance data available</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Add Funds to Broker</h3>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in OG"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isAddingFunds}
          />

          <button
            onClick={handleAddFunds}
            disabled={isAddingFunds || !amount}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAddingFunds ? "Adding..." : "Add"}
          </button>

          <button
            onClick={handleWithdrawFunds}
            disabled={isWithdrawingFunds || !amount}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isWithdrawingFunds ? "Withdrawing..." : "Withdraw"}
          </button>
        </div>
      </div>

      {/* {status && (
        <div className={`p-4 rounded-md ${
          status.includes('Error') ? 'bg-red-50 text-red-700' : 
          status.includes('Success') ? 'bg-green-50 text-green-700' : 
          'bg-blue-50 text-blue-700'
        }`}>
          {status}
        </div>
      )} */}
    </div>
  );
}
