module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./src/setupTests.js'],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    transformIgnorePatterns: [
        "/node_modules/"
    ]
};
