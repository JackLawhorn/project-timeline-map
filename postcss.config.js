module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-define-property'),
    require('postcss-nested'),
    require('postcss-custom-units'),
    require('postcss-preset-env')({
      stage: 1,
      features: {
        'nesting-rules': true,
      },
    }),
    require('cssnano'),
  ],
};
