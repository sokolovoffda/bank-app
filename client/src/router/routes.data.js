const HomeScreen = require('@/screens/home/home.screen')
const AuthScreen = require('@/screens/auth/auth.screen')
const AboutScreen = require('@/screens/about/about.screen')
const NotFoundScreen = require('@/screens/not-found/not-found.screen')

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
