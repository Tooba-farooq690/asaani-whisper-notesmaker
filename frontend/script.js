// const audioFileInput = document.getElementById('audioFile');
// const uploadingText = document.getElementById('uploadingText');
// const message = document.getElementById('message');
// const transcribeBtn = document.getElementById('transcribeBtn');
// const transcriptBox = document.getElementById('transcriptBox');

// let uploadedFile = null;

// audioFileInput.addEventListener('change', () => {
//   if (audioFileInput.files.length > 0) {
//     uploadedFile = audioFileInput.files[0];
//     resetUIBeforeUpload();
//     uploadFile(uploadedFile);
//   }
// });

// transcribeBtn.addEventListener('click', () => {
//   if (!uploadedFile) {
//     alert('Please upload a file first!');
//     return;
//   }
//   transcribeBtn.disabled = true;
//   transcriptBox.textContent = "Transcribing";
//   transcriptBox.classList.add("dot-anim");

//   transcribeAudio(uploadedFile);
// });

// function resetUIBeforeUpload() {
//   uploadingText.style.display = 'block';
//   uploadingText.textContent = 'Uploading';
//   uploadingText.classList.add("dot-anim");

//   message.style.display = 'none';
//   transcribeBtn.disabled = true;
//   transcriptBox.textContent = 'Waiting for upload...';
//   transcriptBox.classList.remove("dot-anim");
// }

// function uploadFile(file) {
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', 'http://127.0.0.1:5000/transcribe');

//   xhr.upload.onloadstart = () => {
//     uploadingText.style.display = 'block';
//   };

//   xhr.onload = () => {
//     if (xhr.status === 200) {
//       uploadingText.style.display = 'none';
//       message.style.display = 'block';
//       transcribeBtn.disabled = false;
//       transcriptBox.textContent = "File uploaded! Click 'Transcribe' to start.";
//     } else {
//       alert('File upload failed. Server responded with status ' + xhr.status);
//       resetUIBeforeUpload();
//     }
//   };

//   xhr.onerror = () => {
//     alert('File upload failed due to a network error.');
//     resetUIBeforeUpload();
//   };

//   const formData = new FormData();
//   formData.append('file', file);
//   xhr.send(formData);
// }

// function transcribeAudio(file) {
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', 'http://127.0.0.1:5000/transcribe');

//   xhr.onload = () => {
//     transcriptBox.classList.remove("dot-anim");

//     if (xhr.status === 200) {
//       const response = JSON.parse(xhr.responseText);
//       if (response.transcript) {
//         transcriptBox.textContent = response.transcript;
//         transcribeBtn.disabled = false;
//       } else if (response.error) {
//         transcriptBox.textContent = "Error: " + response.error;
//         transcribeBtn.disabled = false;
//       }
//     } else {
//       transcriptBox.textContent = "Transcription failed. Server responded with status " + xhr.status;
//       transcribeBtn.disabled = false;
//     }
//   };

//   xhr.onerror = () => {
//     transcriptBox.classList.remove("dot-anim");
//     transcriptBox.textContent = "Transcription failed due to network error.";
//     transcribeBtn.disabled = false;
//   };

//   const formData = new FormData();
//   formData.append('file', file);
//   xhr.send(formData);
// }





const audioFileInput = document.getElementById('audioFile');
const uploadingText = document.getElementById('uploadingText');
const message = document.getElementById('message');
const transcribeBtn = document.getElementById('transcribeBtn');
const transcriptBox = document.getElementById('transcriptBox');
const downloadBtn = document.getElementById('downloadBtn');

let uploadedFile = null;

audioFileInput.addEventListener('change', () => {
  if (audioFileInput.files.length > 0) {
    uploadedFile = audioFileInput.files[0];
    resetUIBeforeUpload();
    uploadFile(uploadedFile);
  }
});

transcribeBtn.addEventListener('click', () => {
  if (!uploadedFile) {
    alert('Please upload a file first!');
    return;
  }
  transcribeBtn.disabled = true;
  transcriptBox.textContent = "Transcribing";
  transcriptBox.classList.add("dot-anim");

  transcribeAudio(uploadedFile);
});

downloadBtn.addEventListener('click', () => {
  const text = transcriptBox.textContent;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 10);
  doc.save("transcription.pdf");
});

function resetUIBeforeUpload() {
  uploadingText.style.display = 'block';
  uploadingText.textContent = 'Uploading';
  uploadingText.classList.add("dot-anim");

  message.style.display = 'none';
  transcribeBtn.disabled = true;
  transcriptBox.textContent = 'Waiting for upload...';
  transcriptBox.classList.remove("dot-anim");
  downloadBtn.style.display = 'none';
}

function uploadFile(file) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:5000/transcribe');

  xhr.upload.onloadstart = () => {
    uploadingText.style.display = 'block';
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      uploadingText.style.display = 'none';
      message.style.display = 'block';
      transcribeBtn.disabled = false;
      transcriptBox.textContent = "File uploaded! Click 'Transcribe' to start.";
    } else {
      alert('File upload failed. Server responded with status ' + xhr.status);
      resetUIBeforeUpload();
    }
  };

  xhr.onerror = () => {
    alert('File upload failed due to a network error.');
    resetUIBeforeUpload();
  };

  const formData = new FormData();
  formData.append('file', file);
  xhr.send(formData);
}

function transcribeAudio(file) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:5000/transcribe');

  xhr.onload = () => {
    transcriptBox.classList.remove("dot-anim");

    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.transcript) {
        transcriptBox.textContent = response.transcript;
        transcribeBtn.disabled = false;
        downloadBtn.style.display = 'block';
      } else if (response.error) {
        transcriptBox.textContent = "Error: " + response.error;
        transcribeBtn.disabled = false;
      }
    } else {
      transcriptBox.textContent = "Transcription failed. Server responded with status " + xhr.status;
      transcribeBtn.disabled = false;
    }
  };

  xhr.onerror = () => {
    transcriptBox.classList.remove("dot-anim");
    transcriptBox.textContent = "Transcription failed due to network error.";
    transcribeBtn.disabled = false;
  };

  const formData = new FormData();
  formData.append('file', file);
  xhr.send(formData);
}
