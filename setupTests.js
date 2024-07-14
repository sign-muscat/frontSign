// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';

// React 18 환경 설정
import { createRoot } from 'react-dom/client';
import React from 'react';

configure({
    asyncWrapper: async cb => {
        const root = createRoot(document.createElement('div'));
        return await cb(root);
    },
});



