require.config({	

	"deps"				: ["app/main"],

	"baseUrl"			: "/javascripts/",
	
	"paths": {

		/* NAMESPACE */
		"namespace"		: "app/namespace",

		/* LIBS */
		"use"			: "vendor/use",
		"jquery"		: "vendor/jquery",
		"backbone"		: "vendor/backbone",
		"underscore"	: "vendor/underscore",

		/* HELPERS */
		"urlApi"		: "app/helpers/api-url",			

		/* ROUTER */
		"router"		: "app/router"
 
 	},

	"use": {
		"backbone": {
			"deps": ["use!underscore", "jquery"],
			"attach": "Backbone"
		},

		"underscore": {
			"attach": "_"
		}
	}
});
