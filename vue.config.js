module.exports = {
    publicPath: './',
    configureWebpack: config => {
        config.entry = './doc/main.js'
    }
};