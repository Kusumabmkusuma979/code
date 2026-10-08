// V4 presentation / identity layer.
const demoLines=[
"An artificial self, assembled in real time.",
"It remembers what you tell it.",
"It changes how it responds.",
"It can sound concerned. Curious. Warm.",
"Then ask: what is actually there?",
"Tattva is the question underneath the interface."
];
let demoIndex=0;
$("demoBtn").onclick=()=>{$("demoOverlay").classList.remove("hidden");demoIndex=0;$("demoLine").textContent=demoLines[0]};
$("exitDemo").onclick=()=>$("demoOverlay").classList.add("hidden");
$("demoNext").onclick=()=>{demoIndex=(demoIndex+1)%demoLines.length;$("demoLine").textContent=demoLines[demoIndex]};
document.addEventListener("keydown",e=>{if(e.key==="Escape"){$("demoOverlay").classList.add("hidden");$("accountModal").classList.add("hidden");$("revealModal").classList.add("hidden")};if(e.key.toLowerCase()==="p"&&e.ctrlKey)$("demoBtn").click()});
