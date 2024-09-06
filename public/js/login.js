const emailEl = document.querySelector('#email');
const password = document.querySelector('#password');
const btnEl = document.querySelector('#mainbtn');

btnEl.addEventListener('submit',function (){
    if(emailEl.value=='' && password.value==''){
        window.alert('please fill the details !');
    }
});
