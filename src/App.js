import React, { useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import './App.css';

// Page Components
import ScrollToTop from './components/ScrollToTop';
import Home from './Home';
import Goose from './GooseStudyAbroad';
import Networking from './Networking';
import Schools from './Schools';
import StudyAbroad from './StudyAbroadServices';
import ServiceCentre from './ServiceCentre';
import Privacy from './Privacy';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Profile from './Profile';
import EditProfile from './EditProfile';
import Search from './Search';
import Admin from './Admin';

// React Context Components
import { withAuthentication } from './components/session';
import { DatabaseContext, withFetching } from './components/database';
import { ValidatorForm } from 'react-material-ui-form-validator';

function App() {
  useEffect(() => {
    // custom validation to check if <ReactQuill> component is empty - or - is only HTML tags (accessible as 'isQuillEmpty' rule)
    ValidatorForm.addValidationRule('isQuillEmpty', value => {
        if (!value || (typeof value === 'string' && value.replace(/<(.|\n)*?>/g, '').trim().length === 0)) return false;
        return true;
    });
  }, []);

  return (
    <div className="App" style={{ overflow:'hidden' }}>
      <ScrollToTop>
        <Switch>
          <Route path="/admin" render={props => <Admin {...props} />}/>
          <Route path="/search" render={props => <Search {...props} />}/>
          <Route path="/profile/edit" render={props => <EditProfile {...props} />}/>
          <Route path="/profile" render={() => <Profile/>}/>
          <Route path="/forgotpassword" render={() => <ForgotPassword/>}/>
          <Route path="/login" render={() => <Login/>}/>
          <Route path="/register" render={() => <Register/>}/>
          <Route path="/privacy" render={() => <Privacy/>}/>
          <Route exact path="/" render={() => <Home /> }/>

          <DatabaseContext.Consumer>
            {({ state }) =>
              <>
                {state.gooseGraphics && 
                  <Route path="/goose" 
                    render={props => 
                      <Goose 
                        {...props} 
                        pageBanner={state.gooseGraphics.goosePageBanner}/>}
                  />}

                {state.networkingGraphics && 
                  <Route path="/networking" 
                    render={props => 
                      <Networking 
                        {...props} 
                        pageBanner={state.networkingGraphics.networkingPageBanner} 
                        poster={state.networkingGraphics.networkingPoster}
                        posterCards={state.networkingGraphics.networkingCards} 
                        wrapper={state.networkingGraphics.networkingWrapper}/>}
                  />}
                
                {state.schoolsGraphics && 
                  <Route path="/schools" 
                    render={props => 
                      <Schools 
                        {...props} 
                        listOfSchools={state.listOfSchools} 
                        posterTop={state.schoolsGraphics.schoolInfoPosterTop}
                        posterBottom={state.schoolsGraphics.schoolInfoPosterBottom}/>}
                  />}

                {state.studyabroadGraphics && 
                  <Route path="/studyabroad" 
                    render={props => 
                      <StudyAbroad 
                        {...props}
                        pageBanner={state.studyabroadGraphics.studyAbroadPageBanner}/>}
                />}
                
                {state.servicesGraphics && 
                  <Route path="/services" 
                    render={props => 
                      <ServiceCentre 
                        {...props} 
                        listOfMessages={state.listOfMessages} 
                        listOfAnnouncements={state.listOfAnnouncements}
                        pageBanner={state.servicesGraphics.serviceCentrePageBanner}/>}
                  />}
              </>
            }
          </DatabaseContext.Consumer>
        </Switch>
      </ScrollToTop>
    </div>
  );
}

export default withAuthentication(withFetching(App));
