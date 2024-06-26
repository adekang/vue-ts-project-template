import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  rules: {
    'no-console': ['error', { allow: ['log', 'error', 'warn'] }],
    'node/prefer-global/process': 'off',
  },
  ignores: [
    // ...globs
    './types/*',
    './public/mockServiceWorker.js',
  ],
})
