import React from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';

import ScrollToTop from './components/ScrollToTop';
import Home from './Home';
import GooseStudyAbroad from './GooseStudyAbroad';

function App() {
  return (
    <div className="App">
      <ScrollToTop>
        <Switch>
          <Route path="/goose" render={() => <GooseStudyAbroad />}/>
          <Route exact path="/" render={() => <Home/>}/>
        </Switch>
      </ScrollToTop>
    </div>
  );
}

export default App;
