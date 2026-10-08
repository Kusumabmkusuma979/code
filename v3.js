// V3 compatibility layer: emotion and presence controls.
window.mayaSetEmotionV3=function(emotion){if(["calm","curious","happy","concerned"].includes(emotion))setEmotion(emotion)};
setInterval(()=>{const p=["PRESENT","LISTENING","PROCESSING"];$("presenceLabel").textContent=p[Math.floor(Date.now()/5000)%p.length]},5000);
