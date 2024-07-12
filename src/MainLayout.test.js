// MainLayout.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import MainLayout from './layouts/MainLayout';

test('renders MainLayout text', () => {
    render(<MainLayout />);
    const mainLayoutText = screen.getByText(/MainLayout/i);
    expect(mainLayoutText).toBeInTheDocument();
});
