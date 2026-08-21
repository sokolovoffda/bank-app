const HomeScreen = require('@/screens/home.screen')
const AuthScreen = require('@/screens/auth.screen')
const AboutScreen = require('@/screens/about.screen')
const NotFoundScreen = require('@/screens/not-found.screen')

module.exports = [
	{
		path: '/',
		Screen: HomeScreen
	},
	{
		path: '/auth',
		Screen: AuthScreen
	},
	{
		path: '/about-us',
		Screen: AboutScreen
	},
	{
		path: '*',
		Screen: NotFoundScreen
	}
]
