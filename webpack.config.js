const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssnanoPlugin = require("cssnano-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    context: path.resolve(__dirname, "src"),

    entry: ["./App.js"],

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },

    devtool: "source-map",
    devServer: {
        host: "192.168.0.102",
        port: 8080,
        contentBase: "./src"
    },

    optimization: {
        minimizer: [new CssnanoPlugin(), new TerserPlugin()]
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ],
                exclude: /node_modules/
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            },
            {
                test: /\.svg$/,
                loader: "svg-url-loader",
                options: {
                    limit: 10 * 1024,
                    noquotes: true
                }
            },

            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new copyWebpackPlugin(
            [
                { from: "./img", to: "img" },
                { from: "./fonts", to: "fonts" }
            ],
            {
                ignore: [{ glob: "svg/*" }]
            }
        ),
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== "production", // Disable during development
            pngquant: {
                quality: "85-95"
            }
        }),
        new MiniCssExtractPlugin({
            filename: "style.css"
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        })
    ]
};
