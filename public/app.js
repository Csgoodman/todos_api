$(document).ready(function(){
    $.getJSON("/api/todos")
    .then(addTodos)
    .catch(function(err){
        res.send(err);
    });
    $('#todoInput').keypress(function(event){
       if(event.which == 13) {
           //if the enter key is pressed...
           createTodo();
       } 
    });
    
    $('.list').on('click', 'li', function(){
        updateTodo($(this)); //the li that was clicked
    });
    
    //add listener to the list - but only listen to clicks on the span
    $('.list').on('click', 'span', function(e){
        e.stopPropagation(); //stops event from bubbling up - span will not trigger parent (li)
        removeTodo($(this).parent());
    });
});





function addTodos(todos) {
    //add todos to page here
    todos.forEach(function(todo){
        addTodo(todo); //for each to do item, add that to the list
    });
}

function addTodo(todo){
    var newTodo = $('<li class="task">' + todo.name + ' <span>X</span></li>');
    newTodo.data('id', todo._id); //adding ID from mongoDB to jQuery element so that we can delete it later
    newTodo.data('completed', todo.completed); //saving whether the todo item is true or false 
    if(todo.completed){
        newTodo.addClass("done");
    }
    $('.list').append(newTodo);
}

function createTodo(){
    //send request to create new todo list item
    var userInput = $('#todoInput').val();
    $.post('/api/todos', {name: userInput})
    .then(function(newTodo){
        addTodo(newTodo);
        $('#todoInput').val(''); //clear the userInput field
    })
    .catch(function(err){
        console.log(err);
    })
}

function removeTodo(todo){
    var clickedID = todo.data('id'); //gives us the li so that we can remove it - only deletes on the front end
    var deleteUrl = '/api/todos/' + clickedID; // creating the url needed to delete to do items
    $.ajax({
        method: 'DELETE',
        url: deleteUrl
    })
    .then(function(data){
        todo.remove(); //immediately remove the todo item from the list
    })
    .catch(function(err){
        console.log(err);
    });
}

function updateTodo(todo){
    var updateUrl = '/api/todos/' + todo.data('id');
    var isDone = !todo.data('completed'); //grabs the inverse of current state
    var updateData = {completed: isDone} //switch the state
    console.log(updateData);
    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
    .then(function(updatedTodo){
        todo.toggleClass("done");
        todo.date('completed', isDone);
    });
}