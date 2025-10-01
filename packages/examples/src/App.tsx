import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { Web3Provider } from "./context/Web3Provider";

// Import route components
import HomePage from "./routes/home";
import ChatPage from "./routes/chat";

// Import global styles
import "./App.css";

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "chat/:providerAddress",
        element: <ChatPage />,
      },
    ],
  },
]);

// Layout component with Web3Provider
function Layout() {
  return (
    <Web3Provider>
      <Outlet />
    </Web3Provider>
  );
}

// Error boundary component
function ErrorBoundary() {
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>404 - Page Not Found</h1>
      <p>The requested page could not be found.</p>
    </main>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
