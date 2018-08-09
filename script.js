console.log("Add validation!");

function checkEmpty(item) {
  return item.value.trim() === "";
}
function addErrorMsg(item) {
  var errorDiv = document.createElement("div");
  errorDiv.classList.add("error-msg");
  errorDiv.style.color = "red";
  errorDiv.innerText = "is required";
  item.parentElement.appendChild(errorDiv);
}

function clear(item) {
  item.classList.remove("input-invalid");
  item.classList.remove("input-valid");

  var errorMsg = document.querySelector(".error-msg");
  if (errorMsg) {
    errorMsg.remove();
  }
}
document
  .getElementById("parking-form")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    var childInvalid = false;
    var inputs = document.querySelectorAll("input");
    var inputsFields = document.querySelectorAll(".input-field");
    var inputGroup = document.querySelector(".input-group");

    for (item of inputsFields) {
      clear(item);
    }
    clear(inputGroup);

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
