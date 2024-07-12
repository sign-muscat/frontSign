import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './components/Header';

test('renders Header text', () => {
    render(<Header />);
    const headerText = screen.getByText(/소리손글 퀴즈/i);
    expect(headerText).toBeInTheDocument();
});
