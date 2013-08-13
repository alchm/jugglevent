require([
	"namespace",
	"use!backbone",
	"router"
],
function (JUGGLEVENT, Backbone, Router) {

	$(function() {
		
		var app = JUGGLEVENT.initApp();
		var module = JUGGLEVENT.module("Views");

		app.router = new Router();

		Backbone.history.start({ pushState: true, root: "/app/"});

	});

});