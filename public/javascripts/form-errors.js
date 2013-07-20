function showErrors(errors) {
    for (var field in errors) {
        //alert(errors[field]);
        $("#"+field+"Container").addClass("error");
        $("#"+field).after('<small class="error">' + errors[field] + '</small>');
    }
}
