module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
    'postcss-preset-env', 
    {
        autoprefixer: {
            flexbox: 'no-2009',
        },
        stage: 1,
        features: {
            'custom-properties': false,
        },
    },
    ],
    [
    'cssnano', 
    {
        preset: 'default'
    },
    ],
    'postcss-mixins',
    {
      mixins: {
        icons: function (mixin, dir) {
            fs.readdirSync('/images/' + dir).forEach(function (file) {
                var icon = file.replace(/\.svg$/, '');
                var rule = postcss.rule({ selector: '.icon.icon-' + icon });
                rule.append({
                    prop:  'background',
                    value: 'url(' + dir + '/' + file + ')'
                });
                mixin.replaceWith(rule);
            });
        }
      },
    },
    'postcss-simple-vars',
    'postcss-import'
  ]
}

