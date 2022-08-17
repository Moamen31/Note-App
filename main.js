
//get elements
let wrapper = document.querySelector(".wrapper")
let addBox = document.querySelector(".add-box")
let popUp = document.querySelector(".popup-box")
let popUpTitle = document.querySelector(".popup-box header p");
let closeBtn = document.querySelector(".close-btn")
let inputTitle = document.querySelector(".title")
let inputDesc = document.querySelector(".description")
let submitBtn = document.querySelector("button[type=submit]")



//btn to show and hide the popUp when addbox clicked on
addBox.addEventListener("click", (() => {
    // popUp.style.display = "block"
    popUp.classList.add("show")
    inputTitle.focus(); //focus on the title input when we open the popUp
}))
closeBtn.addEventListener("click", (() => {
    // popUp.style.display = "none"
    popUp.classList.remove("show")
    returnInputsToNormal();
}))


//function to empty the inputs and return the texts in it
function returnInputsToNormal() {
    //empty the inputs
    inputTitle.value = "";
    inputDesc.value = "";
    //change the text in addBtn and title back to (add a note)
    popUpTitle.textContent = "Add a new Note";
    submitBtn.textContent = "Add Note"
}


//[4]
//we make a variable that will check if there are notes in local storage
//if no then return an empty array
let notesArrayOrObject = JSON.parse(window.localStorage.getItem("notes") || "[]");


//[6] show note from local storage
function showNote() {
    //delete repeated notes
    document.querySelectorAll(".note").forEach((note) => note.remove())
    notesArrayOrObject.forEach((note, index) => { // we will add index here so we know which note we delete
        let newNote = document.createElement("li")
        newNote.className = "note"
        newNote.innerHTML =
            `<div class="details">
            <p>${note.noteTitle}</p>
            <span>${note.noteDesc}</span>
        </div>
        <div class="bottom-content">
            <span>${note.date}</span>
            <span>${note.hours}:${note.minutes} ${note.amOrPm}</span>
            <div class="settings">
                <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                <ul class="menu">
                    <li onclick="editNotes(${index},'${note.noteTitle}','${note.noteDesc}')">
                    <i class="fa-solid fa-pen"></i> Edit</li>
                    <li onclick="deleteNote(this)" class="del" data-index=${index}>
                    <i class="fa-solid fa-trash-can"></i> Delete</li>
                </ul>
            </div>
        </div>`
        wrapper.appendChild(newNote)
        // console.log(index)
    })
}
showNote();


//show menu (edit / remove)
function showMenu(ele) {
    ele.parentElement.classList.add("show-menu")
    //close the menu by clicking anywhere
    document.addEventListener("click", ((e) => {
        //if the clicked element tagname isn't I (captial cuz tagNames r capital) or isn't equal to i
        if (e.target.tagName !== "I") {
            //console.log(e.target.tagName)
            ele.parentElement.classList.remove("show-menu")
        }
    }))
}


//delete note when clicked on delete btn
function deleteNote(ele) {
    let confirmDeleting = document.querySelector(".confirm-wrapper");
    confirmDeleting.classList.add("show")
    let confirmBtns = document.querySelectorAll(".confirm-del button");
    confirmBtns.forEach((btn) => {
        btn.addEventListener("click", ((e) => {
            if (e.target.classList.contains("cancel")) {
                confirmDeleting.classList.remove("show")
                return;
            }
            else {
                let delBtnDataSet = ele.dataset.index
                //remove the note from local storage
                notesArrayOrObject.splice(delBtnDataSet, 1)
                //update the local storage
                window.localStorage.setItem("notes", JSON.stringify(notesArrayOrObject))
                // delBtn.parentElement.parentElement.parentElement.parentElement.remove()
                //or call the function to show the notes from local storage
                showNote()
                confirmDeleting.classList.remove("show")
            }
        }))
    })
}

let isUpdated = false, updateIndex

//edit note when clicked on edit btn
function editNotes(index, title, desc) {
    isUpdated = true;
    updateIndex = index;
    addBox.click() //means that when I click on the edit icon it will open the popUp
    popUpTitle.textContent = "Update a note";
    submitBtn.textContent = "Update Note"

    inputTitle.value = title;
    inputDesc.value = desc;
}


//[1]
//start on submitting
submitBtn.addEventListener("click", ((e) => {
    e.preventDefault();
    if (inputTitle.value || inputDesc.value !== "") {
        //[2]
        //we want the date to do be dynamic
        let months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]

        let year = new Date().getFullYear();
        let day = new Date().getDate();
        let month = new Date().getMonth();
        let theMonth = months[month];
        let hour = new Date().getHours();
        let minute = new Date().getMinutes();
        let am = "AM"
        let pm = "PM"


        //make an object with the data
        let noteObject = {
            noteTitle: inputTitle.value,
            noteDesc: inputDesc.value,
            date: `${theMonth} ${day}, ${year}`,
            hours: hour < 10 ? `0${hour}` : `${hour}`,
            minutes: minute < 10 ? `0${minute}` : `${minute}`,
            amOrPm : hour > 12 ? `${pm}` : `${am}`,
        }

        if (!isUpdated) { //if isupdated is false
            // console.log(isUpdated)
            // console.log(!isUpdated)
            //push the new object to the array if there are no notes in the local storage
            notesArrayOrObject.push(noteObject)
            //console.log(notesArrayOrObject)
        }
        else {  //if isupdated is true.. if i made an update to a note
            //console.log(updateIndex)
            notesArrayOrObject[updateIndex] = noteObject
        }

        //[3]
        //save to local storage.. stringify to make it a string
        window.localStorage.setItem("notes", JSON.stringify(notesArrayOrObject))

        //[5]
        //close the popup after the data saved
        popUp.classList.remove("show")

        //call the function to show notes
        showNote()
    }
    returnInputsToNormal();
    isUpdated = false // we can add it here or in the else when we edit the note
}))

