import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

var router = new VueRouter({
	linkActiveClass: 'active'
})

router.map({
	'/': {
		name: 'docs',
		component: function (resolve) {
			require(['./views/layout'], resolve)
		},
		subRoutes: {
			'/': {
				name: 'docs.home',
				component: function (resolve) {
					require(['./views/index'], resolve)
				}
			},
			'/:page': {
				name: 'docs.page',
				component: function (resolve) {
					require(['./views/index'], resolve)
				}
			}
		}
	}
})

router.beforeEach(function () {
	window.scrollTo(0, 0)
})

router.redirect({
	'*': '/'
})

export default router