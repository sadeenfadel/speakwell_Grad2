document.getElementById('profile-photo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('profile-preview');
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
  
  // document.getElementById('profile-form').addEventListener('submit', function(event) {
  //   event.preventDefault();
    
    // const profileData = {
    //   photo: document.getElementById('profile-preview').src,
    //   qualifications: document.getElementById('qualifications').value,
    //   certifications: document.getElementById('certifications').value,
    //   experience: document.getElementById('experience').value,
    //   specialization: document.getElementById('specialization').value,
    //   about: document.getElementById('about').value
    // };
  
    // localStorage.setItem('therapistProfile', JSON.stringify(profileData));
    // alert('Profile saved successfully!');
    // window.location.href = 'therapists.html'; 
  // });
 
  