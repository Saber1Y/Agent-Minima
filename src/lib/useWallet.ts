"use client";

import { useState, useCallback, useEffect } from "react";

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
      const accounts: unknown = await eth.request({
        method: "eth_requestAccounts",
      });

      const address = Array.isArray(accounts) ? (accounts[0] as string) : null;
      if (!address) {
        throw new Error("No accounts returned");
      }

      const chainHex: unknown = await eth.request({ method: "eth_chainId" });
      const chainId = Number(chainHex);

      setState({
        address,
        chainId,
        isConnecting: false,
        error: null,
      });
    } catch (err) {
      const msg =
        typeof err === "object" && err !== null
          ? ((err as Record<string, unknown>).message as string) || JSON.stringify(err)
          : String(err);
      console.error("Wallet connect error:", err);
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: msg,
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

    const handleAccountsChanged = (accs: unknown) => {
      const accounts = Array.isArray(accs) ? accs : [];
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
