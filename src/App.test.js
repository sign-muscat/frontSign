// import { render, screen } from '@testing-library/react';
// import App from './App';
//
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

//
// // App.test.js
// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import App from './App';
// import Header from './components/Header';
// import MainLayout from './layouts/MainLayout';
//
// test('renders Header component', () => {
//   render(<App />);
//   const headerElement = screen.getByText(/Header/i);
//   expect(headerElement).toBeInTheDocument();
// });
//
// test('renders MainLayout component', () => {
//   render(<App />);
//   const mainLayoutElement = screen.getByText(/MainLayout/i);
//   expect(mainLayoutElement).toBeInTheDocument();
// });
// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import App from './App';
//
// test('renders Header component', () => {
//   render(<App />);
//   const headerElement = screen.getByText(/소리손글 퀴즈/i);
//   expect(headerElement).toBeInTheDocument();
// });
//
// test('renders MainLayout component', () => {
//   render(<App />);
//   const mainLayoutElement = screen.getByText(/소리손글 퀴즈/i);
//   expect(mainLayoutElement).toBeInTheDocument();
// });
import React from 'react';
import { createRoot } from 'react-dom/client';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<App />);
  const appElement = screen.getByText(/Welcome to the Quiz App/i);
  expect(appElement).toBeInTheDocument();
});
