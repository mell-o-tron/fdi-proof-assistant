


// Function to be executed after delay
function delayedFunction() {
    console.log('This message appears after 2 seconds.');
    const xpath = '/html/body/div/div[1]/div/div/div[1]/textarea';
    // Evaluate the XPath expression
    const xpathResult = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

    // Get the element from the result
    const textareaElement = xpathResult.singleNodeValue;

    console.log(textareaElement)

    textareaElement.textContent = "PIPO"
}

// Run the function after 2000 milliseconds (2 seconds)
setTimeout(delayedFunction, 2000);
