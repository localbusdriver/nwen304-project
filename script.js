var circle = document.getElementById("circle");
var upBtn = document.getElementById("upBtn"); //Its for the upbutton
var downBtn = document.getElementById("downBtn");//Its for the downbutton

var rotateValue = circle.style.transform;
var rotateSum;

upBtn.onclick = function () {
    rotateSum = rotateValue + "rotate(-90deg)";
    circle.style.transform = rotateSum;
    rotateValue = rotateSum;
    };
    downBtn.onclick = function () {
    //By add an action that allows to rotate for 90 degrees
    rotateSum = rotateValue + "rotate(90deg)";  
    circle.style.transform = rotateSum;
    rotateValue = rotateSum;
    };
