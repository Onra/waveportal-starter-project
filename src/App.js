import React, {useEffect, useCallback} from "react" 
import './App.css';

export default function App() {

  const checkIfWalletIsConnect = useCallback(() => {
    const {ethereum} = window

    if(!ethereum){
      console.log("Make sure you have Metamask!")
      return
    } else  {
      console.log("We have the ethereum object", ethereum)
    }
  }, [])

  useEffect(() => {
    checkIfWalletIsConnect()
  },[checkIfWalletIsConnect])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        <span>Hey there!</span>
        </div>

        <div className="bio">
        I am Arnaud from France and I'm currently learning some cool stuff around web3! Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton">
          Wave at Me
        </button>
      </div>
    </div>
  );
}
