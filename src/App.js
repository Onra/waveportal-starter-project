import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/wavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState();
  const [wavesCount, setWavesCount] = useState();
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");

  const contractAddress = "0x63e56f63eF192678897206133eE557942EFE13a3";
  const contractABI = abi.abi;

  const getAllWaves = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let waves = await wavePortalContract.getAllWaves();

        const cleanWaves = waves.map((wave) => ({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        }));

        setAllWaves(cleanWaves);
      }
    } catch (error) {
      console.error(error);
    }
  }, [contractABI]);

  const checkIfWalletIsConnected = useCallback(async () => {
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
      getAllWaves();
    } else {
      console.log("No authorized account");
    }
  }, [getAllWaves]);

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

  const fetchNumberOfWaves = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();

        setWavesCount(count.toNumber());
      } else {
        alert("Get Metamask!");
      }
    } catch (error) {
      console.error(error);
    }
  }, [contractABI]);

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count:", count.toNumber());

        const waveTransaction = await wavePortalContract.wave(message);
        console.log("Mining...", waveTransaction.hash);

        await waveTransaction.wait();
        console.log("Mined -- ", waveTransaction.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved new total wave count:", count.toNumber());

        fetchNumberOfWaves();
      } else {
        alert("get Metamask!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    fetchNumberOfWaves();
  }, [checkIfWalletIsConnected, fetchNumberOfWaves]);

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

        <label for="text-input">Message</label>
        <input
          class="input"
          id="text-input"
          type="text"
          value={message}
          onChange={(event) => {
            console.log(event.target.value);
            setMessage(event.target.value);
          }}
        />

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <h2>Total Waves:</h2>
        <h1>{wavesCount}</h1>
        {allWaves.map((wave, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "OldLace",
                marginTop: "16px",
                padding: "8px",
              }}
            >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
