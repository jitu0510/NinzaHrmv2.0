import React, { useEffect, useState } from 'react';
// import './styles.css'; // Import the CSS file

const LoginWithDelay = () => {
  const [words, setWords] = useState([]);
  const delay = 300; // Adjust the delay between words in milliseconds
//Your Path to Seamless HR Management with Our Innovative Software Solutions.
  useEffect(() => {
    // const wordsToPrint = ['Your', 'Trusted', 'Partner', 'for', 'Effortless', 'Transactions', 'Anytime', 'Anywhere','.','.','.'];
    const wordsToPrint = ['Your', 'Path', 'to', 'Seamless', 'HR', 'Management', 'with', 'Our','Innovative','Software','Solutions','.','.','.'];
    const printWordsWithDelay = async () => {
      for (const word of wordsToPrint) {
        await new Promise(resolve => setTimeout(resolve, delay));
        setWords(prevWords => [...prevWords, word]);
      }
    };

    printWordsWithDelay();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="login-page">
      <h1 style={{fontSize:"22px",marginTop:"0px",fontFamily:'cursive' ,marginLeft:"-40px",fontWeight:'bold',color:"#FFFFFF"}}>{words.join(' ')}</h1>
    </div>
  );
};

export default LoginWithDelay;
