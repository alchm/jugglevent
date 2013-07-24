function showErrors(errors) {
    for (var field in errors) {
        $("#"+field+"Container").addClass("error");
        $("#"+field).after('<small class="error">' + errors[field] + '</small>');
    }
}