const toggleLogBtn=document.getElementById("toggle-log");
const logPanel=document.getElementById("log-panel");
toggleLogBtn.addEventListener("click",()=>{
  logPanel.classList.toggle("hidden");
});