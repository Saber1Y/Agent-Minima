"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export default function PrivyWrapper({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold mb-4">Missing Privy App ID</h1>
          <p className="text-sm text-muted mb-4">
            Set <code className="text-accent font-mono">NEXT_PUBLIC_PRIVY_APP_ID</code> in your{" "}
            <code className="text-accent font-mono">.env</code> file.
          </p>
          <p className="text-xs text-muted">
            Create a free app at{" "}
            <a href="https://privy.io" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              privy.io
            </a>
            {" "}and copy the App ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#2dd4bf",
          walletList: ["detected_wallets", "metamask", "coinbase_wallet", "rainbow", "wallet_connect"],
          landingHeader: "Connect your wallet",
          showWalletLoginFirst: true,
        },
        loginMethods: ["wallet"],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
