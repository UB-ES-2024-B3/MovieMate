// jest.config.mjs
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }], // Asegúrate de usar ESM
    },
};
