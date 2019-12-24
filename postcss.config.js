module.exports = ({ file, options, env }) => ({
    parser: file.extname === ".sss" ? "sugarss" : false,
    plugins: {
        autoprefixer: { overrideBrowserslist: ["> 0%", "last 4 versions"] }
    }
});
