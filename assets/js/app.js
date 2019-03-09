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
    let freq = parseInt($("#freq").val().trim());

    // use moment to turn the value of the start of the first train into format
    // returns the the moment at the date of one year ago till now?
    let firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log("FIRST TRAIN TIME CONVERTED: " + firstTrainConverted);
    // Current Time 
    let currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between time between now and 1 year ago in minutes
    let diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // divides a year in minutes by the frequency of the train to get 
    // the minutes since the last bus should have come
    let tRemainder = diffTime % freq;
    console.log("REMAINDER: " + tRemainder);
    // the frequency that the bus comes minus the time past since the last bus 
    // is equal to the time till the next bus
    let tMinutesTillTrain = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // The current time plus the minutes to the next train
    //  Then formated to the same military time   
    let nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    let newTrain = {
        name: trainName,
        dest: dest,
        start: firstTrain,
        rate: freq,
        nextArrival:moment(nextTrain).format("hh:mm"),
        minutesLeft: tMinutesTillTrain
    };

    // console.log(newTrain);
    database.ref().push(newTrain);

    $("#trainName").val("");
    $("#dest").val("");
    $("#firstTrain").val("");
    $("#freq").val("");

});

// 3. Create Firebase event for adding a new train to the schedule
database.ref().on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val());
  
    // Store everything into a variable.
    let trainName = childSnapshot.val().name;
    let trainDest = childSnapshot.val().dest;
    let trainStart = childSnapshot.val().start;
    let trainRate = childSnapshot.val().rate;
    let trainArrival = childSnapshot.val().nextArrival;
    let trainMinutes = childSnapshot.val().minutesLeft;

  
    // Train Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainStart);
    console.log(trainRate);
    console.log(trainArrival);
    console.log(trainMinutes);

      // Create the new row
    let newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainRate),
    $("<td>").text(trainArrival),
    $("<td>").text(trainMinutes),

  );

  // Append the new row to the table
  $(".table > #tableBody").append(newRow);

  
});
