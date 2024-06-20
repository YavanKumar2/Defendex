const divs = [
    { id: 'pslist', property: 'message', title: 'Process List' },
    { id: 'dlllist', property: 'message', title: 'DLL List' },
    { id: 'handles', property: 'message', title: 'Handles' },
    { id: 'ldrmodules', property: 'message', title: 'LDR Modules' },
    { id: 'malfind', property: 'message', title: 'Malicious Findings' },
    { id: 'modules', property: 'message', title: 'Modules' },
    { id: 'callbacks', property: 'message', title: 'Callbacks' }
  ];
  
  let currentIndex = 0;
  let previousMessage = '';
  
  function fetchData() {
    fetch('http://blaze30.pythonanywhere.com/json')
      .then(response => response.json())
      .then(data => {
        updateDivData(data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  function updateDivData(data) {
    const currentDiv = divs[currentIndex];
    const divId = currentDiv.id;
    const property = currentDiv.property;
    const currentMessage = data[property];
  
    if (currentMessage !== previousMessage) {
      const divElement = document.getElementById(divId);
      const status = data.status;
      const statusIcon = (status === "completed")
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" class="bi bi-check-circle" viewBox="0 0 16 16">
             <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14" fill="green"/>
             <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" fill="white"/>
           </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
             <circle cx="8" cy="8" r="7" fill="red" />
             <path fill="white" d="M10.354 4.646a.5.5 0 0 0-.708 0L8 6.293 5.354 3.646a.5.5 0 0 0-.708.708L7.293 7l-2.647 2.646a.5.5 0 0 0 .708.708L8 7.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 7l2.647-2.646a.5.5 0 0 0 0-.708z"/>
           </svg>`;
  
      divElement.innerHTML = `
        <div class="tick-container">
          ${statusIcon}
        </div>
        <div id="terminal-output" style="margin-top:3px;">
          <h3>${currentMessage}</h3>
        </div>
      `;
      divElement.style.display = "flex";
      previousMessage = currentMessage;
      
        currentIndex++;
      
    }
    if(currentIndex<divs.length)
    {
        setTimeout(fetchData, 2000);
    }
  
     
  
    
  }
  
  // Call the fetchData function initially
  fetchData();