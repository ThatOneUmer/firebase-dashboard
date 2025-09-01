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
  query,
  where,
  limit,
  orderBy,
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

    let fetchPosts = async () => {
      let div = document.getElementById("myPost");
      div.innerHTML = "";
      const q = query(collection(db, "Posts"), where("productID", "==", uid));
      let querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let productData = doc.data();
        let productDiv = document.createElement("div");
        productDiv.innerHTML = `
    <div class="proBox">
    <h2>${user.fullName}</h2>
    <h6></h6>
  <p>${productData.productName}</p>
  <button class="btn" onClick="deleteProduct(event, '${doc.id}')">Delete</button>
</div>
    `;
        div.appendChild(productDiv);
      });
    };
    fetchPosts();
  }
};

let currentUserID = [];
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
  if (!inpPname) {
    alert("All fields are required!");
    return;
  }
  let loader = document.getElementById("loader");
  loader.style.display = "flex";
  try {
    await addDoc(collection(db, "Posts"), {
      productName: inpPname,
      productID: userID,
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

  let querySnapshot = await getDocs(collection(db, "Posts"));

  querySnapshot.forEach(async(doc) => {
    let productData = doc.data();
    const q = query(
    collection(db, "users"),
    where("uid", "==", productData.productID)
    );
    console.log(q)
    let userSnapshot = await getDocs(q);
    let productDiv = window.document.createElement("div");
    productDiv.innerHTML = `
      <div class="proBox">
        <h4></h4>
        <p>${productData.productName}</p>
      </div>
    `;
    div.appendChild(productDiv);
  });
};
fetchProducts();

window.deleteProduct = async (event, docID) => {
  let loader = document.getElementById("loader");
  loader.style.display = "flex";
  try {
    await deleteDoc(doc(db, "Posts", docID));
    event.target.parentElement.remove();
    loader.style.display = "none";
    fetchProducts();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

let myDashboard = () => {
  let allPosts = document.getElementById("allPosts");
  let myPosts = document.getElementById("myPosts");
  let myPostBtn = document.getElementById("myPostBtn");
  myPostBtn.style.backgroundColor = "green";
  let allPostBtn = document.getElementById("allPostBtn");
  allPostBtn.style.backgroundColor = "#1999ff";
  myPosts.style.display = "flex";
  allPosts.style.display = "none";
};
let myPostBtn = document.getElementById("myPostBtn");
myPostBtn.addEventListener("click", myDashboard);

let alluserPosts = () => {
  let allPosts = document.getElementById("allPosts");
  let myPosts = document.getElementById("myPosts");
  let allPostBtn = document.getElementById("allPostBtn");
  allPostBtn.style.backgroundColor = "green";
  let myPostBtn = document.getElementById("myPostBtn");
  myPostBtn.style.backgroundColor = "#1999ff";
  myPosts.style.display = "none";
  allPosts.style.display = "flex";
};
let allPostBtn = document.getElementById("allPostBtn");
allPostBtn.addEventListener("click", alluserPosts);
