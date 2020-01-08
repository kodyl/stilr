module.exports = function(api) {
  api.cache(true);

  return {
    presets: [["@babel/preset-env"]],
    plugins: [["@babel/plugin-transform-runtime", { corejs: 3 }]]
  };
};
