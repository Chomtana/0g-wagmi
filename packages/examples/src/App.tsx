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
        path: "chat",
        element: <ChatPage />,
      },
    ],
  },
]);

// Layout component with Web3Provider
function Layout() {
  return (
    <html lang="en" className="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light" />
        <title>0g-wagmi Demo</title>
        <meta
          name="description"
          content="AI Model Marketplace powered by 0G Network"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        />
      </head>
      <body className="light">
        <Web3Provider>
          <Outlet />
        </Web3Provider>
      </body>
    </html>
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
