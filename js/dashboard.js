var todoList = [];

function cardRender(data) {
    let todoList = data;
    const grid = document.getElementById('grid');
    const gridslist = [];
    for (let i = 0; i < todoList.length; i++) {
        gridslist.push(`<div class="card w-100 custom-card">
  <div class="card-body">
        <h5 class="card-title"> ${todoList[i].title}</h5>
        <p class="card-text">${todoList[i].desc}</p>
        
        <div class="row">
           <div class="col-2">
              <b style="color: ${todoList[i].status === 'active' ? 'green' : 'red'};">${todoList[i].status}</b>
          </div>

          <div class="col-3 rating-stars" data-index="${i}">
              <i class="fa fa-star-o pointer" aria-hidden="true" data-star="1"></i>
              <i class="fa fa-star-o pointer" aria-hidden="true" data-star="2"></i>
              <i class="fa fa-star-o pointer" aria-hidden="true" data-star="3"></i>
              <i class="fa fa-star-o pointer" aria-hidden="true" data-star="4"></i>
              <i class="fa fa-star-o pointer" aria-hidden="true" data-star="5"></i>
              <span id="ratingValue-${i}">${todoList[i].rating}</span>
          </div>

           <div class="col-2">  
              <a  onclick="onLikeClick(${i})"> <i class="fa fa-thumbs-o-up pointer" aria-hidden="true"></i> ${todoList[i].like} </a>
        
              <a onclick="onUnLikeClick(${i})"><i class=" pointer fa fa-thumbs-o-down" aria-hidden="true"></i> ${todoList[i].unLike}</a>
           </div>

          <div class="col-2">
             ${todoList[i].comments.length}
             <i class="fa fa-commenting pointer"  onclick="commentsPopup(${i})" aria-hidden="true"></i>
          </div>

          <div class="col-3">
              <a href="#" class="btn btn-danger" onclick="deleteCard(${i})">Delete</a>
              <a href="#" class="btn btn-primary" onclick="editCard(${i})">Edit</a>
          </div>

         </div>
  </div>
</div>`);
    }
    grid.innerHTML = gridslist;
}

function createToDoPopup() {
    let createToDoModal = new bootstrap.Modal(document.getElementById('createToDoModal'));
    createToDoModal.show();
}

function createToDo(event) {
    event.preventDefault();
    let tempStatus = "";
    const createToDoTitle = document.getElementById("title")
    const createToDoDesc = document.getElementById("desc")
    const createToDoDate = document.getElementById("date")
    const active = document.getElementById("active");
    const inactive = document.getElementById("inactive");
    if (active.checked) {
        tempStatus = 'active';
    } else if (inactive.checked) {
        tempStatus = 'inactive';
    }
    let obj = {
        title: createToDoTitle.value,
        desc: createToDoDesc.value,
        date: createToDoDate.value,
        status: tempStatus,
        id: (todoList.length) + 1,
        rating: 4,
        like: 0,
        unLike: 0,
        comments: []
    }

    document.getElementById("titleError").textContent = '';
    document.getElementById("descError").textContent = '';
    document.getElementById("dateError").textContent = '';
    document.getElementById("statusError").textContent = '';

    if (obj.title === '') {
        document.getElementById("titleError").textContent = 'Please enter Title name';
        return;
    } else if (obj.desc === '') {
        document.getElementById("descError").textContent = 'Please enter Description';
        alert()

    } else if (obj.date === '') {
        document.getElementById("dateError").textContent = 'Please enter Date';

    } else {
        todoList.push(obj);
        let createToDoModal = bootstrap.Modal.getInstance(document.getElementById('createToDoModal'));
        createToDoModal.hide();
        document.getElementById("title").value = ''
        document.getElementById("desc").value = ''
        document.getElementById("date").value = ''
        document.getElementById("active").checked = false
        document.getElementById("inactive").checked = false
        console.log(todoList)
        cardRender(todoList)
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Select all containers with stars
    const starContainers = document.querySelectorAll(".rating-stars");

    starContainers.forEach(container => {
        const stars = container.querySelectorAll("i");
        const ratingDisplay = container.querySelector("span");

        stars.forEach(star => {
            star.addEventListener("click", function () {
                let selectedRating = parseInt(this.getAttribute("data-star"));

                // Update visual stars
                stars.forEach((s, index) => {
                    if (index < selectedRating) {
                        s.classList.remove("fa-star-o");
                        s.classList.add("fa-star");
                        s.style.color = "gold";
                    } else {
                        s.classList.remove("fa-star");
                        s.classList.add("fa-star-o");
                        s.style.color = "";
                    }
                });

                // Update rating display (optional)
                ratingDisplay.textContent = selectedRating;

                // Save rating value to todoList or elsewhere as needed
                // let index = container.getAttribute('data-index');
                // todoList[index].rating = selectedRating;
            });
        });
    });
});

function onLikeClick(i) {
    todoList[i].like++;
    cardRender(todoList);
}

function onUnLikeClick(i) {
    todoList[i].unLike++;
    cardRender(todoList);
}

function logOutPage() {
    sessionStorage.removeItem("logInUserData");
    window.location.href = "login.html";
}

var commentIndex = 0;
function commentsPopup(i) {
    commentIndex = i;
    const commentList = document.getElementById("commentList");
    commentList.innerHTML = ''
    for (let j = 0; j < todoList[i].comments.length; j++) {
        let div = document.createElement("div");
        div.textContent = todoList[i].comments[j].desc;
        div.className = 'chat-bubble chat-right';
        commentList.appendChild(div);

        let uName = document.createElement("span");
        uName.textContent = '@' + todoList[i].comments[j].createdBy;
        commentList.appendChild(uName);

        let time = document.createElement("span");
        time.textContent = '   ' + todoList[i].comments[j].time;
        commentList.appendChild(time);

        commentList.appendChild(document.createElement("br"))
    }
    let commentModal = new bootstrap.Modal(document.getElementById('commentModal'));
    commentModal.show();

}

function addTheComment() {
    const comments = document.getElementById("comments").value;
    const logInUserData = JSON.parse(sessionStorage.getItem("logInUserData"));
    const timestamp = new Date().getTime(); // current timestamp in milliseconds
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const timeStr = `${hours}:${minutes} ${ampm}`;
    let comentObj = {
        desc: comments,
        time: timeStr,
        createdBy: logInUserData.uName
    }
    todoList[commentIndex].comments.push(comentObj);
    document.getElementById("comments").value = '';
    cardRender(todoList);
    let commentModal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
    commentModal.hide();
}

function deleteCard(i) {
    todoList.splice(i, 1);
    cardRender(todoList);
}

function ascendingOrder() {
    todoList = todoList.sort((x, y) => x.title.localeCompare(y.title));

    if ((document.getElementById('statusFilter').value !== 'all' && document.getElementById('searchTitle').value)) {
        filerdata = filerdata.sort((x, y) => x.title.localeCompare(y.title));
        cardRender(filerdata);
    } else {
        todoList = todoList.sort((x, y) => x.title.localeCompare(y.title));
        cardRender(todoList);
    }
}

function decendingOrder() {
    if ((document.getElementById('statusFilter').value !== 'all' && document.getElementById('searchTitle').value)) {
        filerdata = filerdata.sort((x, y) => y.title.localeCompare(x.title));
        cardRender(filerdata);
    } else {
        todoList = todoList.sort((x, y) => y.title.localeCompare(x.title));
        cardRender(todoList);
    }
}


function editCard(i) {
    // console.log(todoList)
    document.getElementById("editTitle").value = todoList[i].title;
    document.getElementById("editDesc").value = todoList[i].desc;
    document.getElementById("editDate").value = todoList[i].date;
    if (todoList[i].status === 'active') {
        document.getElementById("editActive").checked = true;
    } else {
        document.getElementById("editInActive").checked = true;
    }
    document.getElementById("editIndex").value = i;

    let editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

function editContent() {
    let editTempStatus = "";
    const editTitle = document.getElementById("editTitle").value;
    const editDesc = document.getElementById("editDesc").value;
    const editDate = document.getElementById("editDate").value;
    const editActive = document.getElementById("editActive");
    const editInActive = document.getElementById("editInActive");
    const editIndex = document.getElementById("editIndex").value;
    if (editActive.checked) {
        editTempStatus = 'active';
    } else if (editInActive.checked) {
        editTempStatus = 'inactive';
    }
    let updated = {
        ...todoList[editIndex],
        title: editTitle,
        desc: editDesc,
        date: editDate,
        status: editTempStatus
    };
    todoList.splice(editIndex, 1, updated);

    cardRender(todoList);
    let editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    editModal.hide();
}
var filerdata = []

function filterTitle(e) {
    const input = e.target.value;
    if (input === '') {
        document.getElementById('statusFilter').value ? cardRender(filerdata) : cardRender(todoList)
    } else {
        filerdata = document.getElementById('statusFilter').value !== 'all' ? filerdata.filter(e => e.title.toLowerCase().includes(input.toLowerCase())) :
            todoList.filter(e => e.title.toLowerCase().includes(input.toLowerCase()));
        cardRender(filerdata);
    }

    if ((document.getElementById('statusFilter').value === '' || document.getElementById('statusFilter').value === 'all')
        && input === '') {
        filerdata = [];
        cardRender(todoList);
    }
}

function filterStatus(e) {
    const status = e.target.value
    if (status !== "all") {
        filerdata = document.getElementById('searchTitle').value ? filerdata.filter(e => e.status === status) : todoList.filter(e => e.status === status);
        cardRender(filerdata);
    } else {
        document.getElementById('searchTitle').value ? cardRender(filerdata) : cardRender(todoList)
    }
    if ((document.getElementById('searchTitle').value === '') && status === '') {
        filerdata = [];
    }
}