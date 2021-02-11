import React from 'react'
import ReactDOM from 'react-dom'
import './generated.css'
import reportWebVitals from './reportWebVitals'
import { Router } from 'react-router-dom'
import history from 'utils/history'
import Routes from 'App/Router'
import { ApolloProvider } from '@apollo/client'
import { serverClient } from 'utils/apolloClient'

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={serverClient}>
      <Router history={history}>
        <Routes />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
