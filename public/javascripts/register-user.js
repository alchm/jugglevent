$("#firstname").change(updateUsername);
$("#lastname").change(updateUsername);

function updateUsername() {
	var firstname = $("#firstname").val();
	var lastname = $("#lastname").val();
	var username = firstname + "." + lastname;
	$("#username").val(username);
}