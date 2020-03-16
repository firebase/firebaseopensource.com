module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    '@nuxtjs/eslint-config-typescript'
  ],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'object-shorthand': 'warn',
    "vue/no-v-html": "off"
  }
}
