import React, { Suspense, lazy, useEffect, useContext } from 'react';
import { Backdrop, CircularProgress } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";
import ScrollToTop from './components/ScrollToTop';
import { withAuthentication } from './components/session';
import { DatabaseContext, withFetching } from './components/database';
import { ValidatorForm } from 'react-material-ui-form-validator';
import './App.css';

const Home = lazy(() => import('./Home'));
const Goose = lazy(() => import('./GooseStudyAbroad'));
const Networking = lazy(() => import('./Networking'));
const Schools = lazy(() => import('./Schools'));
const StudyAbroad = lazy(() => import('./StudyAbroadServices'));
const ServiceCentre = lazy(() => import('./ServiceCentre'));
const Privacy = lazy(() => import('./Privacy'));
const Register = lazy(() => import('./Register'));
const Login = lazy(() => import('./Login'));
const ForgotPassword = lazy(() => import('./ForgotPassword'));
const Profile = lazy(() => import('./Profile'));
const EditProfile = lazy(() => import('./EditProfile'));
const Search = lazy(() => import('./Search'));
const Admin = lazy(() => import('./Admin'));
const FallbackElement = <Backdrop open={true}><CircularProgress color="primary"/></Backdrop>;

function App() {
  const { state } = useContext(DatabaseContext);

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
        <Suspense fallback={FallbackElement}>
          <Switch>
            <Route path="/admin" render={props => <Admin {...props} />}/>
            <Route path="/search" render={props => <Search {...props} />}/>
            <Route path="/profile/edit" render={props => <EditProfile {...props} />}/>
            <Route path="/profile" render={() => <Profile/>}/>
            <Route path="/forgotpassword" render={() => <ForgotPassword/>}/>
            <Route path="/login" render={() => <Login/>}/>
            <Route path="/register" render={() => <Register/>}/>
            <Route exact path="/" render={() => <Home /> }/>

            {state.gooseGraphics && 
              <Route path="/goose" 
                render={props => 
                  <Goose 
                    {...props} 
                    pageBanner={state.gooseGraphics.goosePageBanner}/>}
              />}

            {state.networkingGraphics && 
              <Route path="/networking" render={() => <Networking/>}/>}
            
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

            {state.privacyGraphics && <Route path="/privacy" render={() => <Privacy {...state.privacyGraphics.privacyPolicy}/>}/>}

          </Switch>
        </Suspense>
      </ScrollToTop>
    </div>
  );
}

export default withAuthentication(withFetching(App));
