import type { Route } from "./+types/home";
import { ConnectButton } from "../components/ConnectButton";
import { ZGBrokerComponent } from "../components/0gBroker";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "0G Wagmi SDK" },
    { name: "description", content: "0G Network Integration with Wagmi" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800">
              0G Network Demo
            </h1>
            <ConnectButton />
          </div>
          <p className="mt-2 text-gray-600">
            Interact with 0G Compute Network using Wagmi hooks
          </p>
        </header>

        <main className="mb-12">
          <ZGBrokerComponent />
        </main>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Add funds to 0G broker
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Query balance from broker
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Wagmi to Ethers signer adapter
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Reown wallet integration
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Installation</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
              <code>{`npm install 0g-wagmi wagmi viem @tanstack/react-query`}</code>
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
              <code>{`import { use0gBalance, use0gAddFunds } from '0g-wagmi'

const { balance } = use0gBalance()
const { addFunds } = use0gAddFunds()`}</code>
            </pre>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with 0g-wagmi SDK</p>
          <p className="mt-2">
            {/* <a
              href="https://docs.0g.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              0G Documentation
            </a>
            {" | "} */}
            <a
              href="https://github.com/Chomtana/0g-wagmi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
