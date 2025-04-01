const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const chooseFileBtn = document.getElementById('chooseFile');
    const fileList = document.getElementById('fileList');

    // Open file selector on button click
    chooseFileBtn.addEventListener('click', () => fileInput.click());

    // Handle file input selection
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) uploadFile(file);
    });

    // Drag & Drop functionality
    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('dragover');
        const file = event.dataTransfer.files[0];
        if (file) uploadFile(file);
    });

    // Upload file function
    function uploadFile(file) {
        const formData = new FormData();
        formData.append('resume', file);

        fetch('upload.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('File uploaded successfully!');
                    fetchResumes(); // Refresh file list
                } else {
                    alert('Upload failed: ' + data.message);
                }
            })
            .catch(error => console.error('Upload Error:', error));
    }

    // Fetch uploaded files from backend
    function fetchResumes() {
        fetch('upload.php?action=list')
            .then(response => response.json())
            .then(data => {
                fileList.innerHTML = '';
                data.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.id = `file-${item.id}`; // Assign a unique ID to each file
                    listItem.innerHTML = `
                        <span class="file-name" title="${item.file_name}">${item.file_name}</span>
                        <span>
                            <a href="uploads/${item.file_name}" download class="btn-download">Download</a>
                            <button class="btn-delete" onclick="confirmDelete(${item.id})">Delete</button>
                        </span>
                    `;
                    fileList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Fetch Error:', error));
    }

    // Confirm delete function
    function confirmDelete(fileId) {
        if (confirm('Are you sure you want to delete this file?')) {
            deleteFile(event, fileId);
        }
    }

    // Delete file function
    function deleteFile(event, fileId) {
        event.preventDefault(); // Prevent the default button behavior

        fetch(`upload.php?action=delete&id=${fileId}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    alert(data.message); // Show success message
                    const fileElement = document.getElementById(`file-${fileId}`);
                    if (fileElement) {
                        fileElement.remove(); // Remove the file from the UI
                    }
                } else {
                    alert(data.message); // Show error message
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the file.');
            });
    }

    // Load resumes on page load
    window.onload = fetchResumes;
