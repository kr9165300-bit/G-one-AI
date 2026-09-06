// G ONE AI Parts 7-10 — Files, Images, Advanced Voice, Final Assistant

// PART 7: File/PDF understanding via upload -> server extracts text.
async function uploadGOneFile(file) {
  const fd = new FormData(); fd.append('file', file);
  const r = await fetch('/api/file', { method:'POST', body:fd });
  const data = await r.json(); if(!r.ok) throw new Error(data.error || 'File upload failed');
  return data;
}
function setupGOneFileInput(){
  if(document.getElementById('gOneFileInput')) return;
  const i=document.createElement('input'); i.id='gOneFileInput'; i.type='file'; i.accept='.txt,.md,.pdf,.csv,.json'; i.style.display='none';
  i.onchange=async()=>{ const f=i.files[0]; if(!f)return; addMessage('📎 '+f.name,'user');
    try { const d=await uploadGOneFile(f); addMessage('File ready. '+(d.text||'Text extracted successfully.').slice(0,5000),'ai'); window.gOneFileContext=d.text||''; }
    catch(e){addMessage('File error: '+e.message,'ai');} finally{i.value='';}
  }; document.body.appendChild(i);
}
function openGOneFilePicker(){setupGOneFileInput();document.getElementById('gOneFileInput').click();}

// PART 8: Image understanding. Uploads image to the backend for AI analysis.
async function analyzeGOneImage(file){
  const fd=new FormData();fd.append('image',file);
  const r=await fetch('/api/vision',{method:'POST',body:fd});const d=await r.json();if(!r.ok)throw new Error(d.error||'Image analysis failed');return d;
}
function setupGOneImageInput(){
  if(document.getElementById('gOneImageInput'))return;
  const i=document.createElement('input');i.id='gOneImageInput';i.type='file';i.accept='image/*';i.style.display='none';
  i.onchange=async()=>{const f=i.files[0];if(!f)return;addMessage('🖼️ '+f.name,'user');try{const d=await analyzeGOneImage(f);addMessage(d.reply||'Image analyzed.','ai');if(typeof speak==='function')speak(d.reply||'Image analyzed.');}catch(e){addMessage('Image error: '+e.message,'ai');}finally{i.value='';}};document.body.appendChild(i);
}
function openGOneImagePicker(){setupGOneImageInput();document.getElementById('gOneImageInput').click();}

// PART 9: Advanced voice controls.
let gOneVoiceListening=false;
function startAdvancedVoice(){
  if(gOneVoiceListening){return;}
  if(typeof startVoice==='function'){gOneVoiceListening=true;startVoice();setTimeout(()=>gOneVoiceListening=false,15000);}
  else addMessage('Voice recognition is not supported in this browser.','ai');
}
function stopAdvancedVoice(){gOneVoiceListening=false;if(typeof stopSpeaking==='function')stopSpeaking();}

// PART 10: Final assistant helpers / command router.
function gOneHelp(){return 'G ONE AI commands:\n• search <query> — web search\n• remember <text> — save memory\n• calculate <expression> — calculator\n• upload — attach TXT/PDF/CSV/JSON\n• image — analyze an image\n• voice — start voice input';}
function gOneDownloadConversation(){
  if(typeof exportChat==='function')return exportChat();
  const text=[...document.querySelectorAll('#chat .msg')].map(x=>x.textContent).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download='g-one-ai-chat.txt';a.click();
}
