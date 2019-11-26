import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';

import ScrollToTop from './components/ScrollToTop';
import Home from './Home';
import GooseEdu from './GooseEdu';

function App() {
  return (
    <div className="App">
      <ScrollToTop>
        <Switch>
          <Route path="/goose" render={() => <GooseEdu/>}/>
          <Route exact path="/" render={() => <Home/>}/>
        </Switch>
      </ScrollToTop>
    </div>
  );
}

export default App;
