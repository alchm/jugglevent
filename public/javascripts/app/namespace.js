define([
    "use!backbone"

], function (Backbone) {
    
	var namespace = {

		initApp : function() {
            return _.extend({}, Backbone.Events);
        },

    	module : function(typeName, additionalProps) { 
    		var type = {};
    		type[typeName] = {};

    		return _.extend(type , additionalProps);	
    	}

    };

    return namespace;
});