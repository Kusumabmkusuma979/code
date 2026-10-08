const state={userId:localStorage.getItem("maya_user_id")||crypto.randomUUID(),profile:JSON.parse(localStorage.getItem("maya_profile")||"{}"),memories:JSON.parse(localStorage.getItem("maya_memories")||"[]")};
localStorage.setItem("maya_user_id",state.userId);
const $=id=>document.getElementById(id);
function addMessage(who,text){const el=document.createElement("div");el.className=`message ${who.toLowerCase()}`;el.innerHTML=`<span class="who">${who.toUpperCase()}</span><p></p>`;el.querySelector("p").textContent=text;$("chatLog").appendChild(el);$("chatLog").scrollTop=$("chatLog").scrollHeight}
function setEmotion(e){const a=$("avatar");a.className=`avatar ${e}`;$("emotionLabel").textContent=e.toUpperCase()}
function remember(text){state.memories.unshift({text,at:new Date().toLocaleString()});state.memories=state.memories.slice(0,30);localStorage.setItem("maya_memories",JSON.stringify(state.memories));$("memoryCount").textContent=state.memories.length}
async function chat(text){setEmotion("curious");try{const r=await fetch("/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:state.userId,message:text})});const d=await r.json();return d.reply||"I’m here."}catch(e){return `I heard you. I’ll keep that with me: “${text}”`}}
$("startBtn").onclick=()=>{ $("chatSection").scrollIntoView({behavior:"smooth"});$("chatInput").focus() };
$("chatForm").onsubmit=async e=>{e.preventDefault();const input=$("chatInput"),text=input.value.trim();if(!text)return;input.value="";addMessage("user",text);remember(text);$("memoryToast").classList.add("show");setTimeout(()=>$("memoryToast").classList.remove("show"),1400);const reply=await chat(text);addMessage("maya",reply);setEmotion(reply.length>130?"concerned":"happy")};
$("memoryBtn").onclick=()=>{renderMemories();$("memoryDrawer").classList.add("open")};
$("closeMemory").onclick=()=>$("memoryDrawer").classList.remove("open");
function renderMemories(){const box=$("memoryList");box.innerHTML=state.memories.length?state.memories.map(m=>`<div class="memory-item"><b>${escapeHtml(m.text)}</b><br><small class="muted">${m.at}</small></div>`).join(""):`<p class="muted">No memories yet. Tell MAYA something about you.</p>`}
function escapeHtml(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML}
$("accountBtn").onclick=()=>{$("profileName").value=state.profile.name||"";$("profileAbout").value=state.profile.about||"";$("accountModal").classList.remove("hidden")};
$("saveProfile").onclick=()=>{state.profile={name:$("profileName").value.trim(),about:$("profileAbout").value.trim()};localStorage.setItem("maya_profile",JSON.stringify(state.profile));$("accountModal").classList.add("hidden");if(state.profile.name)addMessage("maya",`Nice to meet you, ${state.profile.name}. I’ll remember that.`);remember(`User identity: ${state.profile.name||"unnamed"}. ${state.profile.about||""}`)};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.add("hidden"));
$("revealBtn").onclick=()=>$("revealModal").classList.remove("hidden");
$("backToChat").onclick=()=>{$("revealModal").classList.add("hidden");$("chatSection").scrollIntoView({behavior:"smooth"})};
$("memoryCount").textContent=state.memories.length;
