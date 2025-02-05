// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesConfig from './routes/routes.jsx'; 

import 'bootstrap/dist/css/bootstrap.min.css';  
import Menu from './Components/MenuComponent/Menu.jsx';
import Chatbot from './Components/Chatbot/Chatbot.jsx';

const App = () => {
  return (
    <Router>
      <Menu/>
      <div className="container">
    
        <RoutesConfig />
      </div>
      <Chatbot/>
    </Router>
  );
};

export default App;
