// // const formElem = document.querySelector("form")
// const fullNameInput = document.getElementById("fullName");

// // input,keyUp,keyDown,keyPress
// fullNameInput.addEventListener("input", (e) => {
//   console.log(e.target.value);
// })


const formElem = document.querySelector("form");
const tbody = document.querySelector("table tbody")
const searchInput = document.getElementById("searchInput");
const sortBtns = document.querySelectorAll(".sortBtn");
const totalResult = document.getElementById("totalResult");
const paginationBtns = document.getElementById("btns")
let lastList;


let users = [];
let localData = JSON.parse(localStorage.getItem("users"));
if (localData) {
  users = localData;
  usersRender()
}

let id = 0;
let localId = JSON.parse(localStorage.getItem("id"))
if (localId) {
  id = localId;
}
let isEdit = false;
let globalId;


formElem.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullName = formElem.fullName.value.trim()
  const email = formElem.email.value.trim()
  const password = formElem.password.value.trim()

  if (!isEdit) {
    const userExist = users.find(user => user.email === email);
    if (userExist) {
      alert("Bu email artiq istifade olunub!");
      return
    }
    users.push(
      {
        id: ++id,
        fullName,
        email,
        password
      }
    )
    localStorage.setItem("id", id)
  } else {
    const userExist = users.find(user => user.id === globalId);
    userExist.fullName = fullName;
    userExist.email = email;
    userExist.password = password;
    isEdit = false;
  }

  localStorage.setItem("users", JSON.stringify(users))
  usersRender();
  formElem.reset()
})
searchInput.addEventListener("input", () => {
  const val = searchInput.value.trim().toLowerCase();
  const filteredUsers = users.filter(user => user.fullName.toLowerCase().includes(val) ||
    user.email.toLowerCase().includes(val))
  usersRender(filteredUsers)
})
let isSorted = {
  fullName: false,
  email: false
};
sortBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    console.log("Berfore:", isSorted);
    if (isSorted[btn.id]) {
      users.sort((a, b) => {
        return b[btn.id].localeCompare(a[btn.id])
      })
      isSorted[btn.id] = false
    } else {
      users.sort((a, b) => {
        return a[btn.id].localeCompare(b[btn.id])
      })
      isSorted[btn.id] = true
    }
    console.log("After:", isSorted);
    usersRender()
  })
})

function deletUser(id) {
  users = users.filter(user => user.id !== id);
  localStorage.setItem("users", JSON.stringify(users))
  usersRender();
}

function editUser(id) {
  isEdit = true;
  globalId = id
  const foundUser = users.find(user => user.id === id);
  formElem.fullName.value = foundUser.fullName;
  formElem.email.value = foundUser.email;
  formElem.password.value = foundUser.password;
}

function usersRender(list = users, start = 0, end = 10) {
  lastList = list;
  totalResult.innerText = users.length;
  tbody.innerHTML = "";
  list.slice(start, end).forEach(user => {
    tbody.innerHTML += `
            <tr class="hover:bg-gray-50">
              <td class="p-3 border">${user.id}</td>
              <td class="p-3 border">${user.fullName}</td>
              <td class="p-3 border">${user.email}</td>
              <td class="p-3 border">${user.password}</td>
              <td class="p-3 border">
                <div class="flex gap-2 justify-center">
                  <button class="px-3 py-1 text-xs rounded bg-yellow-500 text-white hover:bg-yellow-600"
                  onclick="editUser(${user.id})">
                    Edit
                  </button>
                  <button class="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700" 
                  onclick="deletUser(${user.id})">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
    `
  })
  generateBtn(list)
}


function generateBtn(list) {
  let totalPage = Math.ceil(list.length / 10);
  paginationBtns.innerHTML = "";
  for (let i = 1; i <= totalPage; i++) {
    paginationBtns.innerHTML += `
    <button class="w-10 h-10 bg-[blueviolet] text-white cursor-pointer"
    onclick="getPagination(${i})">${i}</button>
    `
  }
}


function getPagination(num) {
  let start = (num - 1) * 10;
  let end = num * 10;
  usersRender(lastList, start, end);
}
// pagination generate => limit 10, len 16, page 2
