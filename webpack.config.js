const { composePlugins, withNx } = require('@nx/webpack');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('./package.json');
const path = require('path');

module.exports = composePlugins(withNx(), (config) => {
  config.mode = 'production';
  config.devtool = 'source-map';

  config.output.clean = false;
  config.output.filename = 'stacksale-pay-preview.bundle.min.js';

  config.output.library = {
    type: 'umd',
    name: 'stacksalePayPreview',
  };

  config.output.globalObject =
    "typeof self !== 'undefined' ? self : this";

  config.output.assetModuleFilename = 'assets/[name][hash][ext]';

  config.resolve.extensions = ['.ts', '.js', '.scss'];

  // Полностью переопределяем rules
  config.module.rules = [
    // TS
    {
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        configFile: 'libs/stacksale-pay-preview/tsconfig.lib.json',
      },
    },

    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            url: true,
            sourceMap: true,
          },
        },
        {
          loader: 'resolve-url-loader', // добавляем этот лоадер
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true, // должен быть true для resolve-url-loader
            sassOptions: {
              loadPaths: [
                path.resolve(__dirname, '../../node_modules'),
                path.resolve(__dirname, '../../libs'),
              ],
              includePaths: [
                path.resolve(__dirname, '../../node_modules'),
                path.resolve(__dirname, '../../libs'),
              ]
            },
            implementation: require('sass'),
          },
        },
      ],
    },

    // Fonts / images
    {
      test: /\.(woff2?|ttf|eot|svg|png|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
  ];

  config.plugins = config.plugins || [];

  // Отдельный CSS файл
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'stacksale-pay-preview.styles.css',
    })
  );

  // Минификация
  config.optimization.splitChunks = false;
  config.optimization.runtimeChunk = false;
  config.optimization.minimize = true;
  config.optimization.minimizer = [
    new TerserPlugin({
      terserOptions: {
        format: {
          comments: /@unsonet/,
        },
      },
      extractComments: false,
    }),
  ];

  // Banner
  config.plugins.push(
    new webpack.BannerPlugin({
      banner: `/*! ${pkg.name} v${pkg.version} */`,
      raw: true,
    })
  );

  return config;
});
