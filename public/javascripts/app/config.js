require.config({	

	"deps"								: ["app/main"],

	"baseUrl"							: "/javascripts/",
	
	"paths": {

		/* LIBS */
		"use"							: "vendor/use",
		"jquery"						: "vendor/jquery",
		"backbone"						: "vendor/backbone",
		"underscore"					: "vendor/underscore"
	},

	"use": {
		"backbone": {
			"deps": [
				"use!underscore", 
				"jquery"
			],
			"attach": "backbone"
		},

		"underscore": {
			"attach": "_"
		}
	}
});