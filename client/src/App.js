import "./App.css";
import Web3 from "web3";
import Credit from "./contracts/Credit.json"; 
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

function App() {
  const [state, setstate] = useState({
    web3: null,
    contract: null,
  });

  const [account, setaccount] = useState("NULL");
  const [creditBalance, setcreditBalance] = useState("nil");
  
  useEffect(() => {
    const initiate = async () => {
      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      // console.log(web3)
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Credit.networks[networkId];
      // console.log(networkId);
      // console.log(deployedNetwork);
      const contract = new web3.eth.Contract(
        Credit.abi,
        deployedNetwork.address
      );
      // console.log(contract)
      if (provider) {
        try{

          await provider.request({ method: "eth_requestAccounts" });
          setstate({ web3: web3, contract: contract });
          
        } catch(error){
          console.error("Failed to connect to MetaMask:", error);
        }
      } else {
        console.error("Please install MetaMask");
      }

      window.ethereum.on('accountsChanged', function(account) {
        window.location.reload();
        
      })


    };
     initiate();
     

  }, []);

  useEffect(() => {
    const { web3 } = state;
    
    const AccountList = async () => {

      const accounts = await web3.eth.getAccounts();
      const uniqueAccounts = [...new Set(accounts)];
      const Select = document.getElementById("selectacnt");

      Select.innerHTML= " ";

       const selectOption = document.createElement("option");
       selectOption.value = "Select Account";
       selectOption.text = "Select Account";
       Select.add(selectOption);
      // const accounts = await web3.eth.getAccounts();
      
      // console.log(accounts);

      for (let i = 0; i < accounts.length; i++) {
        const option = document.createElement("option");
        option.value = uniqueAccounts[i];
        option.text = uniqueAccounts[i];
        Select.add(option);
      }
    };
    web3 && AccountList();
  }, [state]);

  const selectAccount = async (contract) => {
    try{

      const selecedAddress = document.getElementById("selectacnt").value;
      if (selecedAddress !== "Select Account" && selecedAddress !== null) {
        setaccount(selecedAddress);
      
      
      if (contract !== null && selecedAddress !== "Select Account") {
        const isOwner = await contract.methods.owner().call();
        if (isOwner) {
          const initialized = await contract.methods.initialized(selecedAddress).call();
          console.log(initialized)
          if (!initialized) {
            await contract.methods.initializeAccount().send({ from: selecedAddress, gas: 480000 });
            const updatedCreditBalance = await contract.methods.GetcreditBalance(selecedAddress).call();
            setcreditBalance(updatedCreditBalance);
            alert("done")
          }
        }

        
       
      }
    }
    }catch(error){
      console.log(error)
    }
};
  useEffect(() => {
    const Showcredit = async () => {
      const { contract } = state;
      if (account && account !== null && contract !== null ) {
        const credit = await contract.methods.GetcreditBalance(account).call();
        setcreditBalance(credit);
      }
      // console.log(credit);
    };
    Showcredit();
  }, [account]);

  const MintFunction = async (e) => {
    try {
      e.preventDefault();
      const { contract } = state;
      if (contract !== null) {
        const recipient = document.querySelector("#mintadres").value;
        const amount = document.querySelector("#mintamnt").value;
        await contract.methods
          .mint(recipient, amount)
          .send({ from: account, gas: 480000 });
          alert("Transaction successfull")
          // setcreditBalance(creditBalance);
          const updatedCreditBalance = await contract.methods.GetcreditBalance(account).call();
          setcreditBalance(updatedCreditBalance);
          
        }
      } catch (error) {
        alert(error);
      }
      // window.location.reload()
    };
    

  const TransferCredit = async (e) => {
    try {
      e.preventDefault();
      const { contract } = state;
      if (contract !== null) {
        const recipient = document.querySelector("#adres").value;
        const amount = document.querySelector("#amnt").value;
        const transfer = await contract.methods
          .TransferCredit(recipient, amount)
          .send({ from: account, gas: 480000 });
        // console.log(transfer);
        alert("Transfer successfull")
        const updatedCreditBalance = await contract.methods.GetcreditBalance(account).call();
        setcreditBalance(updatedCreditBalance);

      }
    } catch (error) {
alert(error)    }

window.location.reload()

  };

  

  useEffect(() => {
    document.body.classList.add('loaded');
  }, []);

  return (
    <>
    <div className="container">

    <h1 className="Heading">
        <span>Decentralized</span>
        <span style={{color: "blueviolet"}}>credit</span>
        <span>system</span>
      </h1>
      <p className="CA">Connected Account: {account}</p>
      <form>
        <lable htmlFor=""> Choose an account</lable>
        <select id="selectacnt"  className="innerBox"  onChange= {()=> selectAccount(state.contract)}>
          <option> Select Account</option>
        </select>
      </form>

     <div className="transfer"> 

      <h1>Transfer</h1>
      <form className="Form" onSubmit={TransferCredit}>
        <label htmlFor="address"> Recepient Address: </label>

        <input type="text" className="RA input" id="adres" />
        <label> Transfer credit Amount: </label>
        <input type="number" className="RA input" id="amnt" />

        <button className="btn"  type="submit"> Transfer </button>
      </form>
      </div> 

      <h1>MINT</h1>
      <form className="Form" onSubmit={MintFunction}>
        <label htmlFor="address"> Recepient Address: </label>
        <input type="text" className="RA input" id="mintadres" />
        <label> Credit Amount: </label>
        <input type="number" className="RA input" id="mintamnt" />

        <button className="btn" type="submit"> Mint </button>
      </form>

      <p className="tn" id="balance">
        Credit balance: {creditBalance}
      </p>
    </div>
    </>
  );
}

export default App;
