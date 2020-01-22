// find post edit form 
let postEditForm = document.getElementById('postEditForm');
postEditForm.addEventListener('submit', function(event){
    

    // find length of uploaded images
    let imageUpload = document.getElementById('imageUpload').files.length;

    // find length of existing images
    let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;

    // find length of choosed for deletion images
    let imgsDeletion = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    let newTotal = existingImgs - imgsDeletion + imageUpload
    // figure out if the form can be submitted or not
    if(newTotal > 16 ) {
        event.preventDefault();
        let removeAmt = newTotal - 16;
        alert(`You need to remove at least ${removeAmt} (more) image${removeAmt === 1 ? '' : 's' }`);
        

    }
});