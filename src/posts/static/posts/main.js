const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const alertBox = document.getElementById('alert-box')

const dropzone = document.getElementById('my-dropzone')
const addBtn = document.getElementById('add-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]


const url = window.location.href


const likeUnlikePost=() =>{
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(form=> form.addEventListener('submit', e=>{
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type : 'POST',
            url: "/like-unlike/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            success: function(response){
                console.log(response)
                clickedBtn.textContent = response.liked ? `Unlike(${response.count})`: `Like(${response.count})`
            },
            error: function (error){
                console.log(error)
            }
        })
    }))
}

const getData=()=> {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}/`,
        success: function(response){
            console.log('success', response)
            const data = response.data
            setTimeout(()=>{
                spinnerBox.classList.add('not-visible')
                
                console.log(data)
                data.forEach(element => {
                  postsBox.innerHTML += `
                    <div class="card mb-2" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${element.title}</h5>
                            <p class="card-text">${element.body}</p>
                        </div>
                        <div class="card-footer">
                            <div class ="row">
                                <div class="col">
                                    <a href="${url}${element.id}" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col">
                                    <form class="like-unlike-forms" data-form-id="${element.id}">                                   
                                        <button class="btn btn-primary" id="like-unlike-${element.id}">${element.liked ? `Unlike(${element.count})`: `Like(${element.count})`}</button>
                                    </form>
                                </div>
                            </div>
                    </div
                    </div>
                  `
                });
                likeUnlikePost()
            }, 100)
            console.log(response.size)
            if(response.size === 0){
                endBox.textContent= 'No posts added yet'
            }
            else if (response.size <= visible){
                loadBtn.classList.add('not-visible')
                endBox.textContent= 'No more posts to load'
            }       
        },
        error: function(error){
            console.log('error', error)
        }
    })
}

loadBtn.addEventListener('click', ()=>{
    spinnerBox.classList.remove('not-visible')
    visible+=3
    getData()
})
let newPostId = null
postForm.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value
        },
        success: function(response){
            console.log(response)
            newPostId = response.id
            postsBox.insertAdjacentHTML('afterbegin', `
                    <div class="card mb-2" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${response.title}</h5>
                            <p class="card-text">${response.body}</p>
                        </div>
                    <div class="card-footer">
                        <div class ="row">
                            <div class="col">
                                <a href="${url}${response.id}" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col">
                                <form class="like-unlike-forms" data-form-id="${response.id}">                                   
                                    <button class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                                </form>
                            </div>
                        </div>
                    </div
                </div> 
            `)
            likeUnlikePost()
           // $('#addPostModal').modal('hide')
            handleAlerts('success', 'New Post Added!')
            //postForm.reset()
        },
        error: function(error){
            console.log(error)
            handleAlerts('danger', 'oops...something went wrong!')
        }
    })
})
