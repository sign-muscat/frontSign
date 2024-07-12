// SuccessModal.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessModal from './components/SuccessModal';

test('renders SuccessModal component', () => {
    render(<SuccessModal />);
    const successModalElement = screen.getByText(/SuccessModal/i);
    expect(successModalElement).toBeInTheDocument();
});
