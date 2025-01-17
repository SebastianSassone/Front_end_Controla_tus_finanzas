//Registrase

const form_registro = document.getElementById('form_registro');

form_registro.addEventListener('submit', async (event) => {
     event.preventDefault();

     let name = document.getElementById('name').value;
     let lastname = document.getElementById('lastname').value;
     let email = document.getElementById('email').value;
     let password = document.getElementById('password').value;
     let confirmPassword = document.getElementById('confirmPassword').value;

    if (name.trim() === '' || lastname.trim() === '' || 
        email.trim() === '' || password.trim() === '' || 
        confirmPassword.trim() === '') {
       alert('Campos sin completar');
       return;
     }
   
     try {
       const noteData = {
        name, lastname, email, password, confirmPassword
       };
       const response = await fetch('http://localhost:8081/registrar_user', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
        
         body: JSON.stringify(noteData),
       });
   
       if (!response.ok) {
         throw new Error('Error al registrarse');
       }
  
      window.location.replace("http://localhost:5500/html/cuenta.html");
        
     } catch (error) {}
   });

//Mostrar contraseña

let password = document.getElementById('password');
let viewPasswordReg1 = document.getElementById('viewPasswordReg1');
let click = false;

viewPasswordReg1.addEventListener('change', (event)=>{
  if(!click){
    password.type = 'text'
    click = true
  }else if(click){
    password.type = 'password'
    click = false
  }
})

let confirmPassword = document.getElementById('confirmPassword');
let viewPasswordReg2 = document.getElementById('viewPasswordReg2');

viewPasswordReg2.addEventListener('change', (event)=>{
  if(!click){
    confirmPassword.type = 'text'
    click = true
  }else if(click){
    confirmPassword.type = 'password'
    click = false
  }
})