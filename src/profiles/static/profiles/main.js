console.log('hellow profiels')


const avatarBox = document.getElementById('avatar-box')
const alertBox = document.getElementById('alert-box')
const profileForm = document.getElementById('profile-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const bioInput = document.getElementById('id_bio')
const avatarInput = document.getElementById('id_avatar')


profileForm.addEventListener('submit', e=>{
    e.preventDefault()

    const formData = new FormData()
    formData.append('avatar', avatarInput.files[0])
    formData.append('bio', bioInput.value)
    formData.append('csrfmiddlewaretoken', csrf[0].value)

    $.ajax({
        type: 'POST',
        url: '',
        enctype: 'multipart/form-data',
        data: formData,
        success: function(response){
            console.log(response)
            avatarBox.innerHTML = `
            <img src="${response.avatar}" class="rounded" height="200px" widht="auto" alt="${response.user}">
            `
            bioInput.value = response.bio
            handleAlerts('success', 'Your Profile has been Updated!')
        },
        error: function(error){
            console.log(error) 
        },
        processData: false,
        contentType: false,
        cache: false,
    })
})