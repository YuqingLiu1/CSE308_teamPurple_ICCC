var path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/main/js/app.js'
    },
    devtool: 'sourcemaps',
    devServer: {
        contentBase: path.join(__dirname, 'src', 'main', 'resources', 'static', 'built'),
        publicPath: '/built/',
        proxy: {
            '/': 'http://localhost:80'
        }
    },
    output: {
        path: path.join(__dirname, 'src', 'main', 'resources', 'static', 'built'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                include: /flexboxgrid/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"],
                            plugins: ['@babel/plugin-proposal-class-properties']
                        }
                    }
                ],
            },
        ],
    },
};