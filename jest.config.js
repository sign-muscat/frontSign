module.exports = {
    setupFilesAfterEnv: ['./setupTests.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
};
