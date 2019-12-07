import React from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';

import ScrollToTop from './components/ScrollToTop';
import Home from './Home';
import GooseStudyAbroad from './GooseStudyAbroad';
import Networking from './Networking';
import Schools from './Schools';
import StudyAbroadServices from './StudyAbroadServices';
import ServiceCentre from './ServiceCentre';

function App() {
  return (
    <div className="App">
      <ScrollToTop>
        <Switch>
          <Route path="/services" render={(props) => <ServiceCentre {...props}/>}/>
          <Route path="/studyabroad" render={(props) => <StudyAbroadServices {...props} />}/>
          <Route path="/schools" render={(props) => <Schools {...props}/>}/>
          <Route path="/networking" render={(props) => <Networking {...props}/>}/>
          <Route path="/goose" render={(props) => <GooseStudyAbroad {...props} />}/>
          <Route exact path="/" render={() => <Home/>}/>
        </Switch>
      </ScrollToTop>
    </div>
  );
}

export default App;
