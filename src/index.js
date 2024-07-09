import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

import {Provider} from "react-redux";
import store from "./store";
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import { createStandaloneToast } from '@chakra-ui/react';
const { ToastContainer, toast } = createStandaloneToast();

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