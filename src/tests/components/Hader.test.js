import Header from '../../components/Header';
import { act } from "React";
import { render, screen } from '@testing-library/react';


// test('renders Header text', () => {
//     render(<Header />);
//     const headerText = screen.getByText(/소리손글 퀴즈/i);
//     expect(headerText).toBeInTheDocument();
// });

test('renders Header with custom text', () => {
    act(() => {
        render(<Header/>);
    })
});
