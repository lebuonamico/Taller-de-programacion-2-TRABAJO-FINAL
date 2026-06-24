'use strict'

module.exports = {
    require: ['src/test/integration/helpers/hooks.cjs'],
    spec: 'src/test/integration/**/*.test.js',
    timeout: 30000,
    exit: true,
    recursive: true
}
