import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import store from "./store";
import {ChakraProvider, createStandaloneToast} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
const { ToastContainer } = createStandaloneToast();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
        <ChakraProvider>
            <Provider store={store}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </Provider>
        </ChakraProvider>
        <ToastContainer />
    </>
);