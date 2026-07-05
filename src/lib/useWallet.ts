"use client";

import { useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    const eth = window.ethereum;
    if (!eth?.request) {
      setState((s) => ({ ...s, error: "No wallet found. Install MetaMask." }));
      return;
    }

    setState((s) => ({ ...s, isConnecting: true, error: null }));

    try {
      const accounts: string[] = await eth.request({
        method: "eth_requestAccounts",
      });

      if (!accounts?.[0]) {
        throw new Error("No accounts returned");
      }

      const provider = new BrowserProvider(eth);
      const network = await provider.getNetwork();

      setState({
        address: accounts[0],
        chainId: Number(network.chainId),
        isConnecting: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: err instanceof Error ? err.message : "Failed to connect",
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      chainId: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth?.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else connect();
    };

    const handleChainChanged = () => connect();

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    return () => {
      if (eth.removeListener) {
        eth.removeListener("accountsChanged", handleAccountsChanged);
        eth.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [connect, disconnect]);

  return { ...state, connect, disconnect };
}
