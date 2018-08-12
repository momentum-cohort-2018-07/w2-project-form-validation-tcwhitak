console.log("Add validation!");

function checkEmpty(item) {
  return item.value.trim() === "";
}
function addErrorMsg(item) {
  var errorDiv = document.createElement("div");
  errorDiv.classList.add("error-msg");
  errorDiv.style.color = "red";
  errorDiv.innerText = "is required";
  item.parentElement.firstElementChild.insertAdjacentElement(
    "afterend",
    errorDiv
  );
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
  .getElementById("parking-form")
  .addEventListener("submit", function(event) {
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

    var carYearValue = document.querySelector("#car-year").value.trim();
    var todayinyears = new Date().getTime() / 31557600000 + 1970;
    var today = new Date().getTime();

    //makes sure car year is number after 1900 and before today's date
    if (
      isNaN(carYearValue) ||
      parseInt(carYearValue) < 1900 ||
      parseInt(carYearValue) > todayinyears
    ) {
      childInvalid = true;
      alert(
        "Car Year is required to be a numeric value, after 1900 and before the current date"
      );
    }
    //make sure park start is future date
    var parkStartDateValue = new Date(
      document.querySelector("#start-date").value
    ).getTime();
    if (parkStartDateValue < today) {
      document
        .querySelector("#start-date")
        .parentElement.classList.remove("input-valid");
      document
        .querySelector("#start-date")
        .parentElement.classList.add("input-invalid");
      addErrorMsg(document.querySelector("#start-date"));
      // alert("Date Parking must be a future date")
    }
    //make sure parking days is number between 1 and 30, add message only if not already applied
    var numDaysValue = document.querySelector("#days").value.trim();
    if (isNaN(numDaysValue) || numDaysValue < 1 || numDaysValue > 30) {
      document
        .querySelector("#days")
        .parentElement.classList.remove("input-valid");
      document
        .querySelector("#days")
        .parentElement.classList.add("input-invalid");
      if (numDaysValue !== "") {
        addErrorMsg(document.querySelector("#days"));
      }
      // alert("Number of Days must be a number between 1 and 30")
    }
    //check to see that CVV is 3 digits
    var re = /^\d{3}$/;
    var cvv = document.getElementById("cvv");
    if (!re.test(cvv.value)) {
      cvv.parentElement.classList.remove("input-valid");
      cvv.parentElement.classList.add("input-invalid");
      if (cvv.value !== "") {
        addErrorMsg(cvv);
      }
    }

    //insert functions for credit card validation
    function validateCardNumber(number) {
      var regex = new RegExp("^[0-9]{16}$");
      if (!regex.test(number)) return false;

      return luhnCheck(number);
    }

    function luhnCheck(val) {
      var sum = 0;
      for (var i = 0; i < val.length; i++) {
        var intVal = parseInt(val.substr(i, 1));
        if (i % 2 == 0) {
          intVal *= 2;
          if (intVal > 9) {
            intVal = 1 + (intVal % 10);
          }
        }
        sum += intVal;
      }
      return sum % 10 == 0;
    }

    //if function to check credit card and apply appropriate classes to parent
    var creditCardInt = parseInt(document.getElementById("credit-card").value);
    if (!validateCardNumber(creditCardInt)) {
      document
        .querySelector("#credit-card")
        .parentElement.classList.remove("input-valid");
      document
        .querySelector("#credit-card")
        .parentElement.classList.add("input-invalid");
        if (document.querySelector("#credit-card").value !== "") {
          addErrorMsg(document.querySelector("#credit-card"));
        }
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

    //if expiration is not MM/YY in numbers then apply error class and message
    var expRegEx = /^\d{2}\/\d{2}$/;
    var expire = document.getElementById("expiration");
    var expireDate = new Date(
      2000 + parseInt(expire.value.slice(3, 5)),
      parseInt(expire.value.slice(0, 2)) - 1
    );
    if (
      !expRegEx.test(expire.value) ||
      expireDate.getTime() < new Date().getTime()
    ) {
      expire.parentElement.classList.remove("input-valid");
      expire.parentElement.classList.add("input-invalid");
      if (expire.value !== "") {
        addErrorMsg(expire);
      }
    }

    //show total parking cost if there is no errors
    var errors = document.querySelector(".error-msg");
    //if errors are not present, get total and show it at total div
    if (!errors) {
      var parkStartDate = new Date(document.getElementById("start-date").value);
      var revParkStartDate = new Date(parkStartDate.getTime() + 15250000);
      var daysParking = parseInt(document.getElementById("days").value);
      var datesParked = getDatesParked(revParkStartDate, daysParking);
      function getDatesParked(revParkStartDate, daysParking) {
        var dates = [];
        for (i = 0; i < daysParking; i++) {
          if (i === 0) {
            dates.push(revParkStartDate);
          } else {
            var nextDay = new Date(revParkStartDate.getTime() + 86400000 * i);
            dates.push(nextDay);
          }
        }
        return dates;
      }
      //determine daily rate based on weekday ($5) or weekend rate ($7) and create array of rates
      var dailyRates = datesParked.map(function(day) {
        if (day.getDay() == 6 || day.getDay() == 0) {
          var dailyRate = 7;
        } else {
          var dailyRate = 5;
        }
        return dailyRate;
      });
      //sum up each daily rate from previously created array
      var total = dailyRates.reduce(function(sum, rate) {
        return sum + rate;
      }, 0);
      document.getElementById("total").innerText = "Total: $" + total + ".00";
    }
    //if errors are present, do this
    else {
      document.getElementById("total").innerText = "";
    }
  });
