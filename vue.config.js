module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  },
  devServer: {
    disableHostCheck: true,
    port: 8081
  },
};
