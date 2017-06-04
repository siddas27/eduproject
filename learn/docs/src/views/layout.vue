<template>
	<!-- Navbar -->
	<nav class="navbar navbar-dark bg-primary navbar-full navbar-fixed-top">

		<!-- Brand -->
		<a class="navbar-brand" v-link="{ name: 'docs.home' }">LearnPlus</a>

		<!-- Toggle navbar -->
		<button class="navbar-toggler hidden-md-up pull-xs-right" type="button" data-toggle="collapse" data-target="#navbar-menu" aria-expanded="true"><span class="material-icons">menu</span></button>

		<!-- Collapse -->
  		<div class="collapse navbar-toggleable-xs" id="navbar-menu">
			<ul class="nav navbar-nav">
				<li class="nav-item" v-link-active>
					<a class="nav-link" v-link="{ name: 'docs.home' }">Introduction</a>
				</li>
				<li class="nav-item" v-link-active>
					<a class="nav-link" v-link="{ name: 'docs.page', params: { page: 'changelog' } }">Changelog</a>
				</li>
			</ul>
		</div>
	</nav>
	<!-- // END Navbar -->

	<div class="layout-content" data-scrollable>
		<div class="container-fluid main-container">
			<router-view></router-view>
		</div>
	</div>
</template>