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


import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Header component', () => {
  render(<App />);
  const headerElement = screen.getByText(/Header/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders MainLayout component', () => {
  render(<App />);
  const mainLayoutElement = screen.getByText(/MainLayout/i);
  expect(mainLayoutElement).toBeInTheDocument();
});
