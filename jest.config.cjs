module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
};
