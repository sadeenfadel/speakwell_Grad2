document
  .getElementById('child-photo')
  .addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById('child-profile-preview');
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

// document
//   .getElementById('child-profile-form')
//   .addEventListener('submit', function (event) {
//     event.preventDefault();

//     const profileData = {
//       name: document.getElementById('child-name').value,
//       age: document.getElementById('child-age').value,
//       parentName: document.getElementById('parent-name').value,
//       photo: document.getElementById('child-profile-preview').src,
//       bio: document.getElementById('child-bio').value,
//       interests: document.getElementById('child-interests').value,
//     };

//     localStorage.setItem('childProfile', JSON.stringify(profileData));
//     alert('Profile saved successfully!');
//     window.location.href = 'child_profiles.html'; // Redirect to child profiles page
//   });
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    var img = document.querySelector('.imgchild');
    img.style.display = 'inline-block';
  }, 500); // 500 milliseconds = 0.5 seconds
});
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    var formContainer = document.querySelector('.container');
    formContainer.style.display = 'block';
  }, 1000); // 1000 milliseconds = 1 second
});
