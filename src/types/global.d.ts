interface Window {
  ethereum?: import("ethers").Eip1193Provider & {
    on?: (event: string, cb: (...args: any[]) => void) => void;
    removeListener?: (event: string, cb: (...args: any[]) => void) => void;
  };
}
