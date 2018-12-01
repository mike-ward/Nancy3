module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: {
        "target": 'es5',
        "module": 'commonjs',
        "esModuleInterop": true,
        "sourceMap": true,
        "outDir": '../tsout'
      }
    }
  }
};