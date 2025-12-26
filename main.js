// // const formElem = document.querySelector("form")
// const fullNameInput = document.getElementById("fullName");

// // input,keyUp,keyDown,keyPress
// fullNameInput.addEventListener("input", (e) => {
//   console.log(e.target.value);
// })


const formElem = document.querySelector("form");
const tbody = document.querySelector("table tbody")
let users = [];
let id = 0;
let isEdit = false;
let globalId;


formElem.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullName = formElem.fullName.value.trim()
  const email = formElem.email.value.trim()
  const password = formElem.password.value.trim()

  console.log(formElem);
  console.log(formElem.fullName);


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
  } else {
    const userExist = users.find(user => user.id === globalId);
    userExist.fullName = fullName;
    userExist.email = email;
    userExist.password = password;
    isEdit = false;
  }
  // ********
  usersRender();
  formElem.reset()
})
function deletUser(id) {
  users = users.filter(user => user.id !== id);
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

function usersRender() {
  tbody.innerHTML = ""
  users.forEach(user => {
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
}