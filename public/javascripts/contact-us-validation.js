const submitBtn = document.getElementById('contact-us-submit');
const userName = document.getElementById('user-name');
const userMobile = document.getElementById('user-mobile');
const validationMessage = document.getElementById('validation-message');

function validateInputs(message, add, remove) {
    validationMessage.textContent = message;
    validationMessage.classList.add(add);
    validationMessage.classList.remove(remove);
}

userName.addEventListener('input', e => {
	e.preventDefault();
	console.log('input')
	if (userName.value.length < 3 ) {
        validateInputs('Введите корректное имя', 'alert', 'green');
        submitBtn.setAttribute('disabled', true)
        userMobile.setAttribute('disabled', true)
	} else {
		validateInputs('','green', 'alert');
        submitBtn.removeAttribute('disabled')
        userMobile.removeAttribute('disabled')
	}
});


userMobile.addEventListener('input', e => {
    e.preventDefault();
    
    if(userMobile.value.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/))
    {
        validateInputs('','green', 'alert');
        
        submitBtn.removeAttribute('disabled')
        userName.removeAttribute('disabled')
    }
    else
    {
        validateInputs('Введите корректный номер телефона', 'alert', 'green');
        submitBtn.setAttribute('disabled', true)
        userName.setAttribute('disabled', true)   
    }
});






