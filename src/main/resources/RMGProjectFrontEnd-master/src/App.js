//import React from 'react';
import logo from './logo.svg';
import './App.css';
import DemoLoginApp from './Components/DemoLoginApp'
import { useHistory } from 'react-router-dom';
import React ,{ useEffect } from 'react';
// function App = () => {
//   const history = useHistory();

//   useEffect(() => {
//     // Retrieve the current page from localStorage
//     const currentPage = localStorage.getItem('currentPage');

//     // Navigate to the stored page
//     if (currentPage) {
//       history.push(currentPage);
//     }
//   }, [history]);

//    return (
//    <DemoLoginApp></DemoLoginApp>
//   );
// };
function App() {
  
  return (
   <DemoLoginApp></DemoLoginApp>
  );
}
export default App;




