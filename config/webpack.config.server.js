const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
module.exports = {
	entry: [
		'webpack/hot/poll?1000',
		'./src/index'
	],
	watch: true,
	target: 'node',
	externals: [nodeExternals({
		whitelist: ['webpack/hot/poll?1000']
	})],
	module: {
		rules: [{
			test: /\.js?$/,
			use: 'babel-loader',
			exclude: /node_modules/
		}]
	},
	plugins: [
		new StartServerPlugin('jarviz-receiver.js'),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			"process.env": {
				"BUILD_TARGET": JSON.stringify('jarviz-receiver')
			}
		}),
	],
	output: {
		path: path.join(__dirname, '../build'),
		filename: 'jarviz-receiver.js'
	},
	node: {
		__dirname: false,
		__filename: false,
	}
}