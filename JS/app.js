import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  doc,
  setDoc,
  getFirestore,
  app,
} from "./firebase.js";

const auth = getAuth(app);
export const db = getFirestore(app);
let isFirestoreCompleted = true;

let emailOk = false;
let emailInput = (email) => {
  let emailInp = email.target;
  let error = document.getElementById("signupEmailError");
  if (emailInp.value.length === 0) {
    error.style.display = "none";
    return;
  }
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInp.value)) {
    error.style.display = "none";
    emailOk = true;
    return;
  }
  emailOk = false;
  error.style.display = "block";
  error.style.color = "red";
  error.innerText = "Invalid Email Address";
};
let userEmailInput = document.getElementById("signupUserEmail");
userEmailInput.addEventListener("input", emailInput);

let passOk = false;
let passInput = (pass) => {
  let passInp = pass.target;
  let userEmail = document.getElementById("signupUserEmail");
  let error = document.getElementById("signupPassError");
  if (passInp.value.length === 0) {
    error.style.display = "none";
    return;
  }
  if (userEmail.value.length === 0) {
    error.style.display = "block";
    error.innerText = "First you have to enter your Email";
    passOk = false;
    return;
  }
  if (passInp.value.length < 7) {
    error.style.display = "block";
    error.innerText = "password is too weak";
    passOk = false;
    return;
  }
  passOk = true;
  error.style.display = "none";
};
let userPassInput = document.getElementById("signupUserPass");
userPassInput.addEventListener("input", passInput);

let cPassOk = false;
let cPassInput = (pass) => {
  let passInp = pass.target;
  let userPass = document.getElementById("signupUserPass");
  let error = document.getElementById("signupcPassError");
  if (passInp.value.length === 0) {
    error.style.display = "none";
    return;
  }
  if (userPass.value.length === 0) {
    error.style.display = "block";
    error.innerText = "First you have to enter your password";
    cPassOk = false;
    return;
  }
  if (passInp.value !== userPass.value) {
    error.style.display = "block";
    error.innerText = "Password Doesn't Match";
    cPassOk = false;
    return;
  }
  cPassOk = true;
  error.style.display = "none";
};
let userCpassInput = document.getElementById("signupUserCPass");
userCpassInput.addEventListener("input", cPassInput);

let signInUser = async (form) => {
  form.preventDefault();
  let userEmail = document.getElementById("loginUserEmail");
  let userPass = document.getElementById("loginUserPass");
  let loginEmailErr = document.getElementById("loginEmailError");
  let loginPassErr = document.getElementById("loginPassError");

  await signInWithEmailAndPassword(auth, userEmail.value, userPass.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      let loader = document.getElementById("loader");
      loader.style.display = "flex";
      let reDirecting = () => {
        window.location.replace("../dashboard/dashboard.html");
      };
      setTimeout(reDirecting, 2000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error aagaya ", errorMessage);
      loginEmailErr.style.display = "block";
      loginPassErr.style.display = "block";
    });
};
let signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", signInUser);

let signUpUser = async (e) => {
  e.preventDefault();
  if (emailOk === false || passOk === false || cPassOk === false) {
    console.log("Aap nahi jaskte aagay hehe :)")
    console.log(`email: ${emailOk}`, `pass: ${passOk}`, `confirm: ${cPassOk}`);
    return
  }
  try {
    isFirestoreCompleted = false;
    let userEmail = document.getElementById("signupUserEmail");
    let userPass = document.getElementById("signupUserPass");
    let userName = document.getElementById("userFullName");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userEmail.value,
      userPass.value
    ).then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user);
      let ref = await doc(db, "users", user.uid);
      const docRef = await setDoc(ref, {
        fullName: userName.value,
        email: userEmail.value,
        userID: user.uid,
      });
    });
    let loader = document.getElementById("loader");
    loader.style.display = "flex";
    let reDirecting = () => {
      window.location.replace("../dashboard/dashboard.html");
    };
    setTimeout(reDirecting, 3000);
  } catch (error) {
    console.error("Error during sign-up:", error);
  }
};
let signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", signUpUser);

let checkUser = async () => {
  try {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        let loader = document.getElementById("loader");
        loader.style.display = "flex";
        let reDirecting = () => {
          window.location.replace("../dashboard/dashboard.html");
        };
        setTimeout(reDirecting, 2000);
        console.log(user);
        // ...
      } else {
        // User is signed out
        console.log("signed out");
      }
    });
  } catch (error) {
    console.error(error);
  }
};
checkUser();

const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
let allInps = document.getElementsByClassName("input");
let allErrs = document.getElementsByClassName("error");
signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
  for (let i = 0; i < allInps.length; i++) {
    allInps[i].value = "";
  }
  for (let i = 0; i < allErrs.length; i++) {
    allErrs[i].innerText = "";
    allErrs[i].style.display = "none";
  }
};
loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
  for (let i = 0; i < allInps.length; i++) {
    allInps[i].value = "";
  }
  for (let i = 0; i < allErrs.length; i++) {
    allErrs[i].innerText = "";
    allErrs[i].style.display = "none";
  }
};
signupLink.onclick = () => {
  signupBtn.click();
  return false;
};
