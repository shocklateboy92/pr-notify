import webpack from "webpack";
import path from "path";

const config: webpack.Configuration = {
    entry: "./src/main.ts",
    output: {
        path: path.resolve("./dist"),
        filename: "pr-notify.js"
    },
    mode: "development",
    target: "node",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    devtool: "#@inline-source-map",
    stats: {
        // Ignore warnings due to yarg's dynamic module loading
        warningsFilter: [/node_modules\/yargs/]
    }
};

export default config;
