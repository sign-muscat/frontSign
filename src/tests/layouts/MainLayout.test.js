import React from 'react';
import { render, screen } from '@testing-library/react';
import MainLayout from '../../layouts/MainLayout.js';

test('renders MainLayout text', () => {
    render(<MainLayout />);
    const mainLayoutText = screen.getByText(/소리손글 퀴즈/i);
    expect(mainLayoutText).toBeInTheDocument();
});
