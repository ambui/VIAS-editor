var API_URL = "https://b6us0ayd59.execute-api.us-east-1.amazonaws.com/prod/entries";

var database = {};

// Get all items from database and load into data object
$(document).ready(function(){
    $.ajax({
		type: 'GET',
		url: API_URL,
		success: function(data){
			data.Items.forEach(function(qaitem){
				database[qaitem.question] = qaitem.answer;
			})
		}
    });
});

// Submit question and answer into database
$('#add_submit').on('click', function(){
    $.ajax({
        type: 'POST',
        url: API_URL,
        data: JSON.stringify({
            "question": $('#qst').val(),
            "answer": $('#ans').val()}),
        contentType: "application/json",

        success: function(data){
            location.reload();
        }
    });
	return false;
});

// Search Function
// On button click or enter keypress
function find_entry(){
    var search_term = $('#search_input').val();
    search_database(search_term);
}
$('#find_button').on('click', function(){
    find_entry();
});
$("input").keypress(function(){
    if (event.which == 13) { find_entry();}
});

// List all result items
function search_database(term){
    $('#results').html('');
    for (item in database){
        if (item.indexOf(term) !== -1){
            $('#results').append('<button type="button" class="list-group-item list-group-item-action" onclick="edit_entry(\''+item+'\',\''+database[item]+'\')">' + 
                "<b>Question</b>: " + item + '<hr><b>Answer</b>: '+ database[item] + '</button>');
            $('#results').append('<div class="divider"></div>');
        }
    }
}

// Put selection into editing area
var ogQst = "";
var ogAns = "";
function edit_entry(question, answer) {
    ogQst = question;
	ogAns = answer;
    $('#selectedQst').html('');
    $('#selectedQst').append(question);
    $('#selectedAns').html('');
    $('#selectedAns').append(answer);
}

// Update Selection
$('#update_button').on('click', function() {
    if ($('#selectedQst').val() !== '' && $('#selectedAns').val() !== '') { // entry is not empty, a selection has been made
        updateEntry();
		alert("Entry Updated");
    }    
    else {
        alert("Invalid Input!");
    }
});

// Delete Selection
$('#delete_button').on('click', function() {
    if ($('#selectedQst').val() !== '' && $('#selectedAns').val() !== '') { // entry is not empty, a selection has been made
        deleteEntry(ogQst);
		alert("Entry Deleted");
    }    
    else {
        alert("Invalid Input!");
    }
});

// Update by deleting original entry
// Then re-adding the updated question
function updateEntry() {
	deleteEntry();
	$.ajax({
        type: 'POST',
        url: API_URL,
        data: JSON.stringify({
            "question": $('#selectedQst').val(),
            "answer": $('#selectedAns').val()}),
        contentType: "application/json",
        success: function(data){
            location.reload();
        }
    });
	return false;
}

// Find entry matching ogKey and delete
function deleteEntry() {
    $.ajax({
        type: 'DELETE',
        url: API_URL,
        data: JSON.stringify({
            "question": ogQst,
			"answer": ogAns }),
        contentType: "application/json",
        success: function(data){
            console.log(ogQst);
			// timer.start();
			// setTimeout(stopTimer,5000);
            location.reload();  
        }            
    });
    return false;
}