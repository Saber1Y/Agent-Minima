"use client";

import { useState, useCallback, useEffect } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

export interface WalletState {
  address: string | null;
  chainId: number | null;
  signer: JsonRpcSigner | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    signer: null,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((s) => ({ ...s, error: "No wallet found. Install MetaMask." }));
      return;
    }

    setState((s) => ({ ...s, isConnecting: true, error: null }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setState({
        address: accounts[0],
        chainId: Number(network.chainId),
        signer,
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
      signer: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth?.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        connect();
      }
    };

    const handleChainChanged = () => {
      connect();
    };

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
