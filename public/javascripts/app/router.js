define([
    "use!backbone"

], function(Backbone) {

    var router = Backbone.Router.extend({
        previousRoute: null,
        baseRoute: null,
        routes : {
            ""             : "init",
            "timeline"     : "timeline",
            "dashboard"    : "dashboard"
        }, 

        initialize : function() {
            this.render();
        }, 

        render : function() {
            console.log("Router initialized");
            console.log(this);
        }, 

        init : function() {
            console.log("Route : /");
        },

        timeline : function() {
            console.log("Route : /timeline");
        },

        dashboard : function() {
            console.log("Route : /dashboard");
        }

    });

    return router;

});