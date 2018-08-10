console.log("Add validation!");

function checkEmpty(item) {
  return item.value.trim() === "";
}
function addErrorMsg(item) {
  var errorDiv = document.createElement("div");
  errorDiv.classList.add("error-msg");
  errorDiv.style.color = "red";
  errorDiv.innerText = "is required";
  item.parentElement.firstElementChild.insertAdjacentElement('afterend', errorDiv)
}

function clear(item) {
  item.classList.remove("input-invalid");
  item.classList.remove("input-valid");

  var errorMsg = document.querySelector(".error-msg");
  if (errorMsg) {
    errorMsg.remove();
  }
}

//submit button listener
document
  .getElementById("parking-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var childInvalid = false;
    var inputs = document.querySelectorAll("input");
    var inputsFields = document.querySelectorAll(".input-field");
    var inputGroup = document.querySelector(".input-group");
//clear previously applied fields and error messages
    for (item of inputsFields) {
      clear(item);
    }
    clear(inputGroup);
//loop through inputs for empty fields and apply classes
    for (singleInput of inputs) {
      if (singleInput.parentElement.classList.value === "input-group") {
        if (checkEmpty(singleInput)) {
          childInvalid = true;
        }
      } else if (checkEmpty(singleInput)) {
        singleInput.parentElement.classList.add("input-invalid");
        addErrorMsg(singleInput);
      } else {
        singleInput.parentElement.classList.add("input-valid");
      }
    }

    var carYearValue = document.querySelector('#car-year').value.trim()
    var todayinyears = (((new Date().getTime()/31557600000))+1970)
    var today = new Date().getTime()

    //makes sure car year is number after 1900 and before today's date
    if (isNaN(carYearValue) || parseInt(carYearValue) < 1900 || parseInt(carYearValue) > todayinyears) {
        childInvalid = true
        alert("Car Year is required to be a numeric value, after 1900 and before the current date")
    }
    //make sure park start is future date
    var parkStartDateValue = new Date(document.querySelector('#start-date').value).getTime()
    if(parkStartDateValue < today){
        document.querySelector('#start-date').parentElement.classList.remove('input-valid')
        document.querySelector('#start-date').parentElement.classList.add('input-invalid')
        addErrorMsg(document.querySelector('#start-date'))
        // alert("Date Parking must be a future date")
    }
    //make sure parking days is number between 1 and 30, add message only if not already applied
    var numDaysValue = document.querySelector('#days').value.trim()
    if(isNaN(numDaysValue) || numDaysValue < 1 || numDaysValue > 30){
        document.querySelector('#days').parentElement.classList.remove('input-valid')
        document.querySelector('#days').parentElement.classList.add('input-invalid')
        if(numDaysValue !== ""){
            addErrorMsg(document.querySelector('#days'))
        }
        // alert("Number of Days must be a number between 1 and 30")
    }
//if any of the car inputs are invalid then apply appropriate class to the input field div, not direct parent
    if (childInvalid === true) {
      addErrorMsg(document.querySelector(".input-group"));
      document
        .querySelector(".input-group")
        .parentElement.classList.add("input-invalid");
      document.querySelector(".input-group").classList.add("input-invalid");
    } else {
      document
        .querySelector(".input-group")
        .parentElement.classList.add("input-valid");
      document.querySelector(".input-group").classList.add("input-valid");
    }
  });
