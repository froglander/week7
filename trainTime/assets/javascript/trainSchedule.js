 // Initialize Firebase
var config = {
	apiKey: "AIzaSyBIbW49fs6vk9WPERYvWFYBLD0wgpHbyvc",
	authDomain: "week7homework-2ec6b.firebaseapp.com",
	databaseURL: "https://week7homework-2ec6b.firebaseio.com",
	storageBucket: "week7homework-2ec6b.appspot.com",
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var trainDatabase = firebase.database();


// At the initial load, get a snapshot of the current data.
trainDatabase.ref().on("child_added", function(childSnapshot) {
	console.log(childSnapshot.val());

	var $trainBody = $('#trainRows');

	var $trainRow = $('<tr>');

	var $trainName = $('<td>').html(childSnapshot.val().trainName).appendTo($trainRow);
	var $destination = $('<td>').html(childSnapshot.val().destination).appendTo($trainRow);
	var $frequency = $('<td>').html(childSnapshot.val().frequency).appendTo($trainRow);
	var $nextArrival = $('<td>').html(childSnapshot.val().firstTrainTime).appendTo($trainRow);
	var $minutesAway = $('<td>').html(childSnapshot.val().frequency).appendTo($trainRow);

		
	$trainRow.appendTo($trainBody);

	// If any errors are experienced, log them to console. 
	}, function (errorObject) {
	  	console.log("The read failed: " + errorObject.code);
});

// Whenever a user clicks the click button
$("#submitNewTrain").on("click", function() {	
	console.log("trainName:", $('#trainNameInput').val().trim());
	console.log("destination:", $('#destinationInput').val().trim());
	console.log("firstTrainTime:", $('#firstTrainTimeInput').val().trim());
	console.log("frequency:", $('#frequencyInput').val().trim());

	var trainObj = {
		trainName: $('#trainNameInput').val().trim(),
		destination: $('#destinationInput').val().trim(),
		firstTrainTime: $('#firstTrainTimeInput').val().trim(),
		frequency: $('#frequencyInput').val().trim()
	}
	trainDatabase.ref().push(trainObj);

	return false;
});


// // When first loaded or when the connections list changes...
// trainDatabase.on("value", function(snap) {

//   // Display the viewer count in the html.
//   // The number of online users is the number of children in the connections list.
//   $("#watchers").html(snap.numChildren());

// });