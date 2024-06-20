// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { ipcRenderer} = require("electron");
//const { uploadFile } = require("./upload.js");
const { exec } = require("child_process");


let terminalWindow;
if (terminalWindow && !terminalWindow.closed) {
  // Terminal window is already open, close it
  terminalWindow.close();
}

document.addEventListener("DOMContentLoaded", () => {
  const filePathInput = document.getElementById("file-path");
  const fileUploadInput = document.getElementById("file-upload");
  const submitDumpButton = document.getElementById("submit-dump-btn");
  let terminalWindow;

  fileUploadInput.addEventListener("change", function (event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const allowedExtensions = ["vmem", "raw", "dmp", "mem"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      const isAllowedExtension = allowedExtensions.includes(fileExtension);

      if (isAllowedExtension) {
        submitDumpButton.disabled = false;
        filePathInput.value = selectedFile.name;
        document.getElementById("result").textContent = "";
      } else {
        filePathInput.value = "";
        submitDumpButton.disabled = true;
        alert(
          "Invalid file format. Please select a .vmem, .RAW, .dmp, or .mem file."
        );
      }
    } else {
      filePathInput.value = "";
    }
  });

  const processingElement = document.getElementById("processing");

  function showProcessing() {
    processingElement.style.display = "block";
  }

  function hideProcessing() {
    processingElement.style.display = "none";
  }

  submitDumpButton.addEventListener("click", function () {
    console.log("terminal window opened");
    const selectedFile = fileUploadInput.files[0];
    const bucketName = "malwar";
    showProcessing();
    submitDumpButton.disabled = true;

    if (!terminalWindow || terminalWindow.closed) {
      terminalWindow = window.open("terminal.html");
    }

    ipcRenderer.invoke('upload-file', selectedFile.name,selectedFile.path, bucketName)
      .then(() => {
        
        setTimeout(fetchData, 420000); 
      })
      .catch((error) => {
        console.error(error);
        document.getElementById('result').textContent = 'Error occurred during file upload';
        hideProcessing()
      });
  });

  function fetchData() {
    hideProcessing();
    if (terminalWindow) {
      terminalWindow.close();
    }
  
    submitDumpButton.disabled = false;
  
    ipcRenderer
      .invoke('fetch-data', 'http://blaze30.pythonanywhere.com/json')
      .then((data) => {
        const status = data[0].Status;
  
        if (data && data.length > 0) {
          if (status === 'Success') {
            const standardOutputContent = data[0].StandardOutputContent;
            document.getElementById('result').textContent = standardOutputContent;
          } else {
            document.getElementById('result').textContent =
              'Unable to Scan the Memory Dump. Try again!!...';
          }
        } else {
          document.getElementById('result').textContent = 'No data received,Please check your network';
        }
      })
      .catch((error) => {
        console.error(error);
        document.getElementById('result').textContent = 'Error occurred during data fetch';
      });
  }
  

  const progressBar = document.querySelector(".progress");
  const percentageLabel = document.querySelector(".percentage");

  let progress = 0;
  const totalTime = 8 * 60; // 8 minutes in seconds
  const increment = 100 / totalTime;

  const intervalId = setInterval(() => {
    progress += increment;
    progressBar.style.width = `${progress}%`;
    percentageLabel.textContent = `${Math.round(progress)}%`;

    if (progress >= 100) {
      clearInterval(intervalId);
    }

    if (progress > 52) {
      progressBar.parentElement.classList.add("crossed");
    } else {
      progressBar.parentElement.classList.remove("crossed");
    }
  }, 1000);
  const captureButton = document.getElementById('capture');

      captureButton.addEventListener('click', () => {
        
        const winpmemPath = document.getElementById('winpmemPath').value;
        const destinationPath = document.getElementById('destinationPath').value;
        
        const command = `${winpmemPath} ${destinationPath}`;
        showCapturing();
        
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Command execution error: ${error.message}`);
            console.error(`Command stderr: ${stderr}`);
            return;
          }

          // Command executed successfully
          console.log('Command executed successfully');
          console.log(stdout);
        });
      });
      const capturingElement = document.getElementById("capturing");

    function showCapturing() {
      capturingElement.style.display = "block";
    }

    function hideCapturing() {
      capturingElement.style.display = "none";
    }
    const progress_Bar = document.querySelector(".progress_");
  const percentage_Label = document.querySelector(".percentage_");

  let progress_ = 0;
  const totalTime_ = 2 * 60;
  const increment_ = 100 / totalTime_;

  const intervalId_ = setInterval(() => {
    progress_ += increment_;
    progress_Bar.style.width = `${progress_}%`;
    percentage_Label.textContent = `${Math.round(progress_)}%`;

    if (progress_ >= 97) {
      hideCapturing();
      
      clearInterval(intervalId_);
      
      
    }

    if (progress_ > 52) {
      progress_Bar.parentElement.classList.add("crossed");
    } else {
      progress_Bar.parentElement.classList.remove("crossed");
    }
  }, 1000);

  

  
});

//curl -X POST -H "Content-Type: application/json" -d '{"status":"","message":""}' http://blaze30.pythonanywhere.com/json
//https://belkasoft.com/ram-capturer
