/* ************************************************************	*/
/* Initialize Firebase 											*/
/* ************************************************************	*/
var config = {
	apiKey: "AIzaSyBIbW49fs6vk9WPERYvWFYBLD0wgpHbyvc",
	authDomain: "week7homework-2ec6b.firebaseapp.com",
	databaseURL: "https://week7homework-2ec6b.firebaseio.com",
	storageBucket: "week7homework-2ec6b.appspot.com",
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var trainDatabase = firebase.database();


/* ************************************************************	*/
/* Function : on child_added									*/
/* Parameters : childSnapshot									*/	
/* Description : This function is part of the firebase library	*/
/*				 and is triggered each time a child is added.	*/
/*				 It will also be triggered when the page loads.	*/
/*				 It is used to build up each row of train data 	*/
/*				 and display it on the page						*/
/* ************************************************************	*/
trainDatabase.ref().on("child_added", function(childSnapshot) {
	console.log(childSnapshot.val());

	// Build up variables useful for calculation how many minutes away
	// the next train is	
	var frequency = childSnapshot.val().frequency;
	var firstTrainTime = moment(childSnapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");	
	// minutes away  = frequency - [minutes(currentTime - startTime) % frequency ]
	var minAway = frequency - (moment().diff(moment(firstTrainTime), "minutes") % frequency);

	// jQuery variable to reference the #trainRows id in html
	var $trainBody = $('#trainRows');
	// Build a jquery object for the train row
	var $trainRow = $('<tr>').attr('id', childSnapshot.key);
	// Build a delete button to remove records from database
	var $deleteBtn = $('<button>').append($('<span>').addClass("glyphicon glyphicon-remove").attr('aria-hidden', "true"))
								.on('click', function() { trainDatabase.ref(childSnapshot.key).remove();});
							
	// Build an edit button to edit records (button there, still need to add functionality)
	var $editBtn = $('<button>').append($('<span>').addClass("glyphicon glyphicon-pencil").attr('aria-hidden', "true"))
								.on('click', editButton );
	// Append the two buttons to a <td> element and append to the row
	var $update = $('<td>').append($deleteBtn).append($editBtn).appendTo($trainRow);

	var $trainName = $('<td>').html(childSnapshot.val().trainName).addClass("editable").appendTo($trainRow);
	var $destination = $('<td>').html(childSnapshot.val().destination).addClass("editable").appendTo($trainRow);
	var $frequency = $('<td>').html(childSnapshot.val().frequency).addClass("editable").appendTo($trainRow);
	var $nextArrival = $('<td>').html(moment(moment().add(minAway, "minutes")).format("hh:mm")).appendTo($trainRow);
	var $minutesAway = $('<td>').html(minAway).appendTo($trainRow);
	// Append trainRow to #trainRows element
	$trainRow.appendTo($trainBody);

	// If any errors are experienced, log them to console. 
	}, function (errorObject) {
	  	console.log("The read failed: " + errorObject.code);
});

/* ************************************************************	*/
/* Function : on child_removed									*/
/* Parameters : childSnapshot									*/	
/* Description : This function is part of the firebase library	*/
/*				 and is triggered each time a child is removed.	*/
/*				 It removes the row with the id of 				*/
/*				 childSnapshot.key
/* ************************************************************	*/
trainDatabase.ref().on("child_removed", function(childSnapshot) {
	$('#'+childSnapshot.key).remove();
});


function editButton() {	
	console.log("editButton this:", this);
	$(this).children('span').removeClass('glyphicon-pencil').addClass('glyphicon-ok');
	$(this).on('click', saveButton);
	editRow($(this).parents('tr').attr('id'));

};

function saveButton() {
	console.log("save");
	$(this).children('span').removeClass('glyphicon-ok').addClass('glyphicon-pencil');
	$(this).on('click', editButton);
	//saveRow($(this).parents('tr').attr('id'));	

	$($(this).parents('tr').attr('id')).find('input').each( function(index, value) {
		console.log("index:", index);
	 	console.log("value:", value);
	});
};

function saveRow(key) {
	console.log("saveRow");
	console.log("key:", key);
	var rowID = '#' + key;
	var trainRef = trainDatabase.ref().child(key);
	// trainRef.update( {
	// 	trainName: trainName,
	// 	destination: destination,
	// 	frequency: frequency
	// });
	// $(rowID).find('input').each( function(index, value) {
	// 	console.log("index:", index);
	// 	console.log("value:", value);
	// });
};

function editRow(key) {
	console.log("editRow key:", key);

	console.log(key);
	var rowID = '#' + key;
	console.log(rowID);		

	$(rowID).children('.editable').each( function(index, value) {
		console.log("value:", value);
		$(this).html($('<input>').attr("type", "text")
								 .attr("value", $(this).text()));

	});
};

/* ************************************************************	*/
/* Function : parsley on field:validated						*/
/* Parameters : none 											*/	
/* Description : I found a javascript library called parsley	*/
/*				 for validation purposes. It uses attributes	*/
/*				 included in the <input> elements to trigger 	*/
/*				 the appropriate valication						*/
/* ************************************************************	*/
$('#addTrainForm').parsley().on('field:validated', function() {
	var ok = $('.parsley-error').length === 0;
	$('.bs-callout-info').toggleClass('hidden', !ok);
	$('.bs-callout-warning').toggleClass('hidden', ok);
})
/* ************************************************************	*/
/* Function : on form submit									*/
/* Parameters : none											*/
/* Description : This is executed when you click the submit		*/
/*				 button for the form and pushes the entered 	*/
/*				 data to the firebase database 					*/
/* ************************************************************	*/
.on('form:submit', function() {
	// Build the train object
	var trainObj = {
		trainName: $('#trainNameInput').val().trim(),
		destination: $('#destinationInput').val().trim(),
		firstTrainTime: moment($('#firstTrainTimeInput').val().trim(), "hhmm").format("hh:mm")	,
		frequency: $('#frequencyInput').val().trim()
	}
	// Push train object to database
	trainDatabase.ref().push(trainObj);

	// Clear form values
	$('#trainNameInput').val("");
	$('#destinationInput').val("");
	$('#firstTrainTimeInput').val("");
	$('#frequencyInput').val("");
	$('#trainNameInput').focus()

	//So page doesn't refresh
	return false; 
}); 
