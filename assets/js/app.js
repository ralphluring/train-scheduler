$( document ).ready(function() {
    $("#currentTime").append("The current time is: " + moment().format("hh:mm A"));

// Initialize Firebase
let config = {
    apiKey: "AIzaSyC_Wstpt3eyx5LYcA-UTj6N3ZK8pwEj6Eg",
    authDomain: "train-scheduler-b4fa9.firebaseapp.com",
    databaseURL: "https://train-scheduler-b4fa9.firebaseio.com",
    projectId: "train-scheduler-b4fa9",
    storageBucket: "train-scheduler-b4fa9.appspot.com",
    messagingSenderId: "532427509324"
};

firebase.initializeApp(config);

let database = firebase.database();

  // Event listener for the submission of new train
  $("#newTrainSubmit").on("click", function(event){
    event.preventDefault();

    let trainName = $("#trainName").val().trim();
    let dest = $("#dest").val().trim();
    let firstTrain = $("#firstTrain").val().trim();
    let freq = $("#freq").val().trim();

    let newTrain = {
        name: trainName,
        dest: dest,
        start: firstTrain,
        rate: freq
    };

    database.ref().push(newTrain);

    $("#trainName").val("");
    $("#dest").val("");
    $("#firstTrain").val("");
    $("#freq").val("");

  });

// Create Firebase event for adding a new train to the schedule
  database.ref().on("child_added", function(childSnapshot) {
  
    // Store everything into a variable.
    let trainName = childSnapshot.val().name;
    let trainDest = childSnapshot.val().dest;
    let trainStart = childSnapshot.val().start;
    let tFrequency = parseInt(childSnapshot.val().rate);

    // console.log(trainStart);
       // First Time (pushed back 1 year to make sure it comes before current time)
       let firstTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
      //  console.log(firstTimeConverted);
    
      // Current Time
      let currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
      // Difference between the times
      let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    let tRemainder = diffTime % tFrequency;


      // Minute Until Train
      let tMinutesTillTrain = tFrequency - tRemainder;
    

        // Next Train
    let nextTrain = moment().add(tMinutesTillTrain, "minutes");


  
    // Train Info
    console.log(trainStart);
    console.log(trainName);
    console.log(trainDest);
    console.log(tFrequency);
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);



      // Create the new row
    let newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(tFrequency),
    $("<td>").text(moment(nextTrain).format("HH:mm")),
    $("<td>").text(tMinutesTillTrain),

    );

    // Append the new row to the table
    $(".table > #tableBody").append(newRow);

  
  });

});
