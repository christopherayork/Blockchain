import React, {useState} from 'react';
import './App.css';
import axios from 'axios';

let API_URL = "http://localhost:5000";

function App() {
  let [userID, setUserID] = useState('');
  let [transactions, setTransactions] = useState([]);
  let [currency, setCurrency] = useState(0);
  let updateUser = e => {
    setUserID(e.target.value);
  };

  let submitHandler = e => {
    e.preventDefault();
    return getUserData();
  };

  let getUserData = async () => {
    let res = await axios.get(API_URL + "/chain");
    console.log(res);
    let chain = res.data.chain;
    if(!chain) return;
    let transactions = [];
    chain.forEach(block => {
      console.log(block);
      transactions.push(...block.transactions.filter(t => {
        return t.sender === userID || t.recipient === userID;
      }));
    });
    console.log(transactions);
    let currency = 0;
    transactions.forEach(t => {
      if(t.sender === userID) {
        currency -= t.amount;
      } else if(t.recipient === userID) {
        currency += t.amount;
      }
    });
    setTransactions(transactions);
    setCurrency(currency);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Blockchain Crypto Wallet</h1>
        <main>
          <div className='searchContainer'>
            <form name='userID'>
              <input name='user' value={userID} onChange={updateUser}/>
              <button type='submit' onClick={submitHandler}>Get Wallet</button>
            </form>
          </div>
          <div className='userDetails'>
            <h2>User: {userID}</h2>
            <h3>Currency: {currency}</h3>
          </div>
          <div className='transactions'>
            {transactions.map(t => {
              return (
                <div className='transaction'>
                  <span>Sender: {t.sender}</span><br/>
                  <span>Recipient: {t.recipient}</span><br/>
                  <span>Amount: {t.amount}</span>
                </div>
              );
            })}
          </div>
        </main>
      </header>
    </div>
  );
}

export default App;
