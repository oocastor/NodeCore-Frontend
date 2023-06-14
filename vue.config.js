const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_I18N_FULL_INSTALL__': 'true',
        '__VUE_I18N_LEGACY_API__': 'false'
        // Weitere Feature Flags hier hinzufügen, falls erforderlich.
      })
    ]
  }
})
