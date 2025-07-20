window.onload = function attachStudentFormListener() {
    var loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit",
        function (e) {
            e.preventDefault()
            let obj = {
                eMail: e.target.eMail.value,
                password: e.target.password.value,
            };
            let emailError = document.getElementById("emailError");
            emailError.innerHTML = ''
            let passwordError = document.getElementById("passwordError");
            passwordError.innerHTML = ''

            if (obj.eMail === '') {
                emailError.innerHTML = 'Please enter eMail or register'
            } else if (obj.password.length < 8) {
                passwordError.innerHTML = 'please enter password with 8 char'
            } else {
                let usersData = JSON.parse(localStorage.getItem("usersData"));
                let findUser = usersData.find(e => e.email === obj.eMail && e.password === obj.password);
                console.log(findUser)
                if (findUser) {
                    alert("login successful");
                    
                    e.target.reset();
            JSON.parse(localStorage.getItem("logInUserData"))
            localStorage.setItem("logInUserData",JSON.stringify(findUser))
                    window.location.href = "./dashboard.html";
                } else {
                    alert("please enter valid information")
                }

            }
        }
    )

    var registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit",
        function (e) {
            e.preventDefault()
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());
            console.log(data);

            let uNameError = document.getElementById("uNameError");
            uNameError.textContent = '';

            let eMailError = document.getElementById("eMailError");
            eMailError.textContent = '';

            let passWordError = document.getElementById("passWordError");
            passWordError.textContent = '';

            let phoneError = document.getElementById("phoneError");
            phoneError.textContent = '';

            let addressError = document.getElementById("addressError");
            addressError.textContent = '';

            var phonePattern = /^[6-9]\d{9}$/;

            if (data.uName === '') {
                uNameError.textContent = 'Please enter Username';
            }
            if (data.email === '') {
                eMailError.textContent = 'Please enter E-Mail';
            }
            if (data.password === '') {
                passWordError.textContent = 'Please enter Password';
            } else if (data.password.length < 8) {
                passWordError.textContent = 'Please enter > 8 character';
            }

            if (data.phone === '') {
                phoneError.textContent = 'Please enter Phone Number';
            } else if (!phonePattern.test(data.phone)) {
                phoneError.textContent = 'Please enter a valid 10-digit phone number';
            }

            if (data.address === '') {
                addressError.textContent = 'Please enter Address';
            }
            isMailExist();
            if (data.uName && data.email && data.password && data.phone && data.address) {
                let usersData = JSON.parse(localStorage.getItem("usersData"));
                Object.assign(data, { id: usersData.length + 1 });
                Object.assign(data, { todoList: [] });
                usersData.push(data);
                localStorage.removeItem("usersData");
                localStorage.setItem("usersData", JSON.stringify(usersData));
                e.target.reset();
                let abc = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                abc.hide();

            }

        }
    )
}

function openRegisterPopup() {
    let updateModal = new bootstrap.Modal(document.getElementById('registerModal'));
    updateModal.show();
}

function isMailExist() {
    const reeMail = document.getElementById("reeMail").value
    console.log(reeMail)
    let usersData = JSON.parse(localStorage.getItem("usersData"));
    let findUser = usersData.find(e => e.email === reeMail);
    console.log(findUser)
    if (findUser) {
        alert("please enter different mail id");
        document.getElementById("reeMail").value = '';
    }
}





