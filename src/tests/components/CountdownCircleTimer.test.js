import React from 'react';
import { render, screen } from '@testing-library/react';
import CountdownCircleTimer from '../../components/CountdownCircleTimer';

test('renders CountdownCircleTimer component', () => {
    render(<CountdownCircleTimer />);
    const countdownElement = screen.getByRole('progressbar');
    expect(countdownElement).toBeInTheDocument();
});
