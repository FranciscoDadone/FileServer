let fileInput, uploadProgress, message, divProgress;

function init() {
    fileInput = document.getElementById('file-input');
    uploadProgress = document.getElementById('upload-progress');
    message = document.getElementById('message');
    divProgress = document.getElementById('div-progress');

    fileInput.addEventListener('change', function () {
        let xhr = new XMLHttpRequest(),
            fd = new FormData();
        
        for(let i = 0; i < fileInput.files.length; i++) {
            fd.append('file', fileInput.files[i]);
        }

        xhr.upload.onloadstart = function (e) {
            uploadProgress.classList.add('visible');
            uploadProgress.value = 0;
            uploadProgress.max = e.total;
            fileInput.disabled = true;
            divProgress.style.display = "flex";
        };

        xhr.upload.onprogress = function (e) {
            let progress = Math.round((e.loaded * 100) / e.total);
            uploadProgress.setAttribute("aria-valuenow", progress);
            uploadProgress.setAttribute("style", "width: " + progress + "%;");
            uploadProgress.innerHTML = progress + "%";
        };

        xhr.upload.onloadend = function (e) {
            uploadProgress.classList.remove('visible');
            fileInput.disabled = false;
        };

        xhr.onload = function () {
            window.open(window.location.href,"_self");
            console.log("dsddsds");
        };

        xhr.open('POST', '', true);
        xhr.send(fd);
    });
}

init();