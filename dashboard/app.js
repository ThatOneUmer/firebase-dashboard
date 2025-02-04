import {
  getAuth,
  getDoc,
  signOut,
  deleteUser,
  onAuthStateChanged,
  app,
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
} from "../JS/firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);
let userID;
let isFirestoreCompleted = true;

let dataCatcher = async (uid) => {
  let userMail = document.getElementById("uename");
  let fullName = document.getElementById("ufname");
  let useridName = document.getElementById("uiname");
  useridName.style.color = "red";
  const querySnapshot = await getDoc(doc(db, "users", uid));
  if (querySnapshot.exists()) {
    const user = querySnapshot.data();
    fullName.innerText = user.fullName;
    userMail.innerText = user.email;
    useridName.innerText = uid;
  }
};

let checkUser = async () => {
  try {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userID = user.uid;
        await dataCatcher(userID);
      } else {
        console.log("signed out");
        if (isFirestoreCompleted) {
          let loader = document.getElementById("loader");
          loader.style.display = "flex";
          setTimeout(() => window.location.replace("../index.html"), 2000);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};
checkUser();

let logout = async () => {
  try {
    await signOut(auth);
    document.getElementById("loader").style.display = "flex";
    setTimeout(() => window.location.replace("../index.html"), 2000);
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
document.querySelector("#signOut").addEventListener("click", logout);

let delAcc = async () => {
  isFirestoreCompleted = false;
  let user = auth.currentUser;
  if (user) {
    try {
      await deleteUser(user);
      await deleteDoc(doc(db, "users", userID));
      document.getElementById("loader").style.display = "flex";
      setTimeout(() => window.location.replace("../index.html"), 2000);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  }
};
document.querySelector("#deleteAcc").addEventListener("click", delAcc);

let updateData = async () => {
  let fname = document.getElementById("upd-fname").value;
  let email = document.getElementById("upd-email").value;
  try {
    await updateDoc(doc(db, "users", userID), {
      fullName: fname,
      email: email,
    });
    quitTop();
    checkUser();
  } catch (error) {
    console.error("Error updating data:", error);
  }
};
document.querySelector("#updatedData").addEventListener("click", updateData);

let showData = () => {
  let topUp = document.getElementById("main-top");
  let showDiv = document.getElementById("hideOne");
  let hideDiv = document.getElementById("showOne");
  showDiv.style.display = "flex";
  hideDiv.style.display = "none";
  topUp.style.display = "flex";
};
document.getElementById("updateAcc").addEventListener("click", showData);

let createTopUp = () => {
  let showDiv = document.getElementById("main-top");
  let hideDiv = document.getElementById("hideOne");
  let show_Div = document.getElementById("showOne");
  showDiv.style.display = "flex";
  show_Div.style.display = "flex";
  hideDiv.style.display = "none";
};
let topUpBtn = document.getElementById("showCreate");
topUpBtn.addEventListener("click", createTopUp);

let quitTop = () => {
  let topUp = document.getElementById("main-top");
  if ((topUp.style.display = "flex")) {
    topUp.style.display = "none";
  }
};
document.getElementById("cross").addEventListener("click", quitTop);
document.getElementById("cross2").addEventListener("click", quitTop);

let proMaker = async () => {
  let inpPname = document.getElementById("proName").value.trim();
  let inpCName = document.getElementById("proCompany").value.trim();
  let inpQuantity = document.getElementById("proQuantity").value.trim();

  if (!inpPname || !inpCName || !inpQuantity) {
    alert("All fields are required!");
    return;
  }
  let loader = document.getElementById("loader");
  loader.style.display = "flex";
  try {
    await addDoc(collection(db, "products"), {
      productName: inpPname,
      companyname: inpCName,
      quantity: inpQuantity,
    });
    loader.style.display = "none";
    quitTop();
    fetchProducts();
  } catch (error) {
    console.error("Error adding product:", error);
  }
};
document.getElementById("addProduct").addEventListener("click", proMaker);

let fetchProducts = async () => {
  let div = document.getElementById("products");
  div.innerHTML = "";
  let querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    let productData = doc.data();
    let productDiv = document.createElement("div");
    productDiv.innerHTML = `
    <div class="proBox">
  <p>${productData.productName}</p>
  <p>${productData.companyname}</p>
  <p>${productData.quantity}</p>
  <button onclick="deleteProduct('${doc.id}')" class="btn">Delete</button>
</div>
    `;
    div.appendChild(productDiv);
  });
};
fetchProducts();

window.deleteProduct = async (docID) => {
  let loader = document.getElementById("loader");
  loader.style.display = "flex";
  try {
    await deleteDoc(doc(db, "products", docID));
    loader.style.display = "none";
    fetchProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
