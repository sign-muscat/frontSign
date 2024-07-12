// CountdownCircleTimer.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import CountdownCircleTimer from './components/CountdownCircleTimer';

test('renders CountdownCircleTimer component', () => {
    render(<CountdownCircleTimer />);
    const countdownElement = screen.getByText(/CountdownCircleTimer/i);
    expect(countdownElement).toBeInTheDocument();
});
