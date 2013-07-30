require.config({	

	"deps"								: ["app/main"],

	"baseUrl"							: "../../../",
	
	"paths": {

		/* LIBS */
		"use"							: "public/javascript/vendor/use",
		"jquery"						: "public/javascript/vendor/jquery",
		"backbone"						: "public/javascript/vendor/backbone",
		"underscore"					: "public/javascript/vendor/underscore"
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