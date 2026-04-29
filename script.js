// script.js (কিছু ফাংশন)

window.changeAvatar = function(){
  avatarIdx=(avatarIdx+1)%AVATARS.length;
  document.getElementById('profileAvatar').textContent=AVATARS[avatarIdx];
}

window.showPage = function(page){
  // ... rest of your function
}

window.openModal = function(){
    document.getElementById('movl').classList.remove('hidden');
    document.body.style.overflow='hidden';
}
// ... আপনার বাকি সমস্ত ফাংশন একইভাবে
