const mix = require('laravel-mix')
const path = require('path')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')


// Use these functions when resolving paths
const src = relPath => path.resolve(__dirname, 'resources/assets/', relPath)
const dist = relPath => path.resolve(__dirname, 'public/', relPath)

/*
 |--------------------------------------------------------------------------
 | Config
 |--------------------------------------------------------------------------
 */
mix
	// Basic config
	.setPublicPath('public')
	.setResourceRoot('../')

	// Set up SASS entry point
	.sass(src('scss/style.scss'), dist('css'))

	// Set up the JS entry point
	.js(src('js/theme.js'), dist('scripts'))

	// Webpack plugins
	.webpackConfig(() => {
		const plugins = [
			new SVGSpritemapPlugin(src('svg-sprite/*.svg'), {
				output: {
					filename: 'images/svgsprite.svg',
					chunk: { keep: true },
					svgo: {
						plugins: [
							{
								name: 'addClassesToSVGElement',
								params: {
									className: 'svg-sprite'
								}
							}
						]
					}
				},
				sprite: { prefix: false }
			})
		]

		return { plugins }
	})

	// Append version strings in mix-manifest.
	.version()

/*
 |--------------------------------------------------------------------------
 | ENV handling
 |--------------------------------------------------------------------------
 */
if (!mix.inProduction()) {
	// Include separate source maps in development builds.
	mix
		.webpackConfig({ devtool: 'cheap-module-source-map' })
		.sourceMaps()
} else {
	// only run in production
}
