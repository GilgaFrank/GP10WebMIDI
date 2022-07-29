
export function addSpinner(parentElement, 
    clickPlusFunction,
    clickMinusFunction,
    caption,
    rootElementID,
    minValue,
    maxValue,
    startValue) {
    var rootElement = document.createElement("div");
    rootElement.id = rootElementID;
    rootElement.className = "spinControlWrapper";
    parentElement.appendChild(rootElement);

    var captionDiv = document.createElement("div");
    captionDiv.className = "spinControlCaption";
    captionDiv.innerHTML = caption;
    rootElement.appendChild(captionDiv);

    var plusButton = document.createElement("button");
    var minusButton = document.createElement("button");

    var plusTenButton = document.createElement("button");
    var minusTenButton = document.createElement("button");
    
    plusTenButton.addEventListener("click", clickPlusFunction);
    minusTenButton.addEventListener("click", clickMinusFunction);

    plusButton.addEventListener("click", clickPlusFunction);
    minusButton.addEventListener("click", clickMinusFunction);

    plusButton.addEventListener("click", function() {
        var currentValue = parseInt(valueDisplay.innerHTML);
        currentValue+=1;
        if (currentValue > maxValue) {
            currentValue = maxValue;           
        }
        valueDisplay.innerHTML = currentValue;
    });

    minusButton.addEventListener("click", function() {
        var currentValue = parseInt(valueDisplay.innerHTML);
        currentValue-=1;
        if (currentValue < minValue) {
            currentValue = minValue;           
        }
        valueDisplay.innerHTML = currentValue;
    });

    plusTenButton.addEventListener("click", function() {
        var currentValue = parseInt(valueDisplay.innerHTML);
        currentValue+=10;
        if (currentValue > maxValue) {
            currentValue = maxValue;           
        }
        valueDisplay.innerHTML = currentValue;
    });

    minusTenButton.addEventListener("click", function() {
        var currentValue = parseInt(valueDisplay.innerHTML);
        currentValue-=10;
        if (currentValue < minValue) {
            currentValue = minValue;           
        }
        valueDisplay.innerHTML = currentValue;
    });

    var valueDisplay = document.createElement("span");
    valueDisplay.className = "spinValueDisplay";
    valueDisplay.innerHTML = startValue;

    plusButton.id = rootElementID + "_PLUS_BUTTON";
    minusButton.id = rootElementID + "_MINUS_BUTTON";

    plusTenButton.id = rootElementID + "_PLUS_TEN_BUTTON";
    minusTenButton.id = rootElementID + "_MINUS_TEN_BUTTON";

    plusButton.innerHTML = "+1";
    minusButton.innerHTML = "-1";

    plusTenButton.innerHTML = "+10";
    minusTenButton.innerHTML = "-10";

    rootElement.appendChild(minusTenButton);
    rootElement.appendChild(minusButton);
    rootElement.appendChild(valueDisplay);
    rootElement.appendChild(plusButton);
    rootElement.appendChild(plusTenButton);

    

    return rootElement;
}