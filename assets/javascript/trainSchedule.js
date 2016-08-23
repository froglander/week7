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
	//console.log(childSnapshot.val());

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
	// Build a save button to save an edited record that is not visible to start
	var $saveBtn = $('<button>').append($('<span>').addClass("glyphicon glyphicon-ok").attr('aria-hidden', "true")).hide()
								.on('click', saveButton );
	// Append the two buttons to a <td> element and append to the row
	var $update = $('<td>').append($deleteBtn).append($editBtn).append($saveBtn).appendTo($trainRow);

	var $trainName = $('<td>').html(childSnapshot.val().trainName).addClass("editable trainName").appendTo($trainRow);
	var $destination = $('<td>').html(childSnapshot.val().destination).addClass("editable destination").appendTo($trainRow);
	var $frequency = $('<td>').html(childSnapshot.val().frequency).addClass("editable frequency").appendTo($trainRow);
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

/* ************************************************************	*/
/* Function : editButton										*/
/* Parameters : none											*/	
/* Description : This function is called from the on-click of	*/
/*				 the edit button (as a function object so we 	*/
/*				 have 'this' as the button) and turns the 		*/
/*				 with class .editable into input fields			*/ 
/* ************************************************************	*/
function editButton() {	
	console.log("edit button click");
	// Hide the edit button
	$(this).hide();	
	// Show the save button
	$(this).siblings().find(".glyphicon-ok").parent().show();
	// Variable to hold id of row
	var rowID = '#' + $(this).parents('tr').attr('id');
	// Loop through each editable child and replace the text with an
	// input field containing the text
	$(rowID).children('.editable').each( function(index, value) {		
		var temp = $(this).html();
		console.log("temp:", temp);
		$(this).html($('<input>').attr("type", "text")
								 .attr("value", temp));
	});
};

/* ************************************************************	*/
/* Function : saveButton										*/
/* Parameters : none											*/	
/* Description : This function is called from the on-click of	*/
/*				 the save button (as a function object so we 	*/
/*				 have 'this' as the button) and updates the		*/
/*				 database record with the indicated key			*/ 
/* ************************************************************	*/
function saveButton() {
	$(this).hide();	
	// Show the save button
	$(this).siblings().find(".glyphicon-pencil").parent().show();
	// Variable to hold id of row
	var rowID = '#' + $(this).parents('tr').attr('id');
	// Loop through each editable field and turn it back into just text
	$(rowID).children('.editable').each( function(index, value) {
		var temp = $(this).children('input').val();
		$(this).html(temp);
	});
	// Update record in database with the specified key
	var trainRef = trainDatabase.ref().child($(this).parents('tr').attr('id'));
	trainRef.update( {
		trainName: $(rowID).children(".trainName").text(),
		destination: $(rowID).children(".destination").text(),
		frequency: $(rowID).children(".frequency").text()
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
	// Set focus back to Train Name input field
	$('#trainNameInput').focus()

	//So page doesn't refresh
	return false; 
}); 
