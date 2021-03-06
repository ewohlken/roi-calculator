import 'bootstrap/dist/css/bootstrap';
import 'bootstrap/dist/css/bootstrap-theme';

import React from "react";
import ReactDOM from "react-dom";

import { AppContainer } from 'react-hot-loader';
//AppContainer is a necessary wrapper component for HMR

import App from './components/App';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('app')
  );
};

render(App);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(App)
  });
}

// import CalculatorService from "./services/calculate.js";
//
// var test = new CalculatorService();
