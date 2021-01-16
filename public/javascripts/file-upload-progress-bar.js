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
            let progress = Math.round((e.loaded * 100) / e.total),
                totalInMB = (e.total / 1000) / 1000,
                uploadedInMB = (e.loaded / 1000) / 1000;

            uploadProgress.setAttribute("aria-valuenow", progress);
            uploadProgress.setAttribute("style", "width: " + progress + "%;");
            uploadProgress.innerHTML = progress + "%";
            message.innerHTML = uploadedInMB.toFixed(1) + "mb / " + totalInMB.toFixed(1) + "mb";
        };

        xhr.upload.onloadend = function (e) {
            uploadProgress.classList.remove('visible');
            fileInput.disabled = false;
        };

        xhr.onload = function () {
            if(window.location.href.includes('status=success')) {
                window.open(window.location.href, "_self");
            } else if((window.location.href[window.location.href.length - 1] != '/' && window.location.href.includes('status=success')) || window.location.href.includes('?dirname')) {
                window.open(window.location.href + '&status=success', "_self");
            } else if(window.location.href[window.location.href.length - 1] == '?') {
                window.open(window.location.href + 'status=success', "_self");
            } else {
                window.open(window.location.href + '?status=success', "_self");
            }
        };

        xhr.open('POST', '', true);
        xhr.send(fd);
    });
}

init();