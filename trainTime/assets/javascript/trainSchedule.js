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
// trainDatabase.ref().on("value", function(snapshot) {

// 	// Print the initial data to the console.
// 	console.log(snapshot.val());

// 	// Change the html to reflect the initial value.
// 	//$("#clickValue").html(snapshot.val().clicks);

// 	// Change the clickcounter to match the data in the database
// 	//clickCounter = snapshot.val().clicks;

// 	// Log the value of the clickCounter
// 	// console.log(clickCounter);

// 	// Change the HTML Value
// 	// $('#clickValue').html(clickCounter);

// // If any errors are experienced, log them to console. 
// }, function (errorObject) {

//   	console.log("The read failed: " + errorObject.code);

// });

// Whenever a user clicks the click button
$("#submitNewTrain").on("click", function() {
	console.log("Submit new train click");
	var trainName = $('#trainNameInput').val().trim();
	var destination = $('#destinationInput').val().trim();
	var firstTrainTime = $('#firstTrainTimeInput').val().trim();
	var frequency = $('#frequencyInput').val().trim();

	// Log the value of clickCounter
	console.log("trainName:", trainName);
	console.log("destination:", destination);
	console.log("firstTrainTime:", firstTrainTime);
	console.log("frequency:", frequency);

	// Save new value to Firebase
	trainDatabase.ref().set({
		trainName: trainName,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	});
	return false;
});