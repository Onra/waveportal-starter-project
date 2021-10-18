import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState();

  const checkIfWalletIsConnect = useCallback(async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("Found authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account");
    }
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get metamask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, [checkIfWalletIsConnect]);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span>Hey there!</span>
        </div>

        <div className="bio">
          I am Arnaud from France and I'm currently learning some cool stuff
          around web3! Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton">Wave at Me</button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
