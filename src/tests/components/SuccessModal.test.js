import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessModal from '../../components/SuccessModal';

test('renders SuccessModal component', () => {
    render(<SuccessModal />);
    const successModalElement = screen.getByText(/Open Modal/i);
    expect(successModalElement).toBeInTheDocument();
});
