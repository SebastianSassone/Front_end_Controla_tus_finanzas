setInterval(updateDateTime, 1000);

function updateDateTime() {
    const now = new Date();

    const campoFecha = document.getElementById('fecha');
    campoFecha.value = now.toLocaleDateString();

    const campoHora = document.getElementById('hora');
    campoHora.value = now.toLocaleTimeString();
}        

const form = document.getElementById('form_ingreso');
const section_form_ingreso = document.getElementById('section_form_ingreso');
const section_detalle = document.getElementById('section_detalle');
   
   form.addEventListener('submit', async (event) => {
     event.preventDefault();
     
     const producto = document.getElementById('producto').value;
     const categoria = document.getElementById('categoria').value;
     const subcategoria = document.getElementById('subcategoria').value;
     const valor = document.getElementById('valor').value;
     const fecha = document.getElementById('fecha').value;
     const hora = document.getElementById('hora').value;
    
     if (producto.trim() === '' || categoria.trim() === '' || 
         subcategoria.trim() === '' || valor.trim() === '' || 
         fecha.trim() === '' || hora.trim() === '' ) {
       alert('Campos sin completar');
       return;
     }
   
     try {
       const noteData = {producto, categoria, subcategoria, valor, fecha, hora};
       const response = await fetch('https://api-finanzas-deploy.onrender.com/guardar_ingreso', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(noteData),
       });
   
       if (!response.ok) {
         throw new Error('Error al agregar el ingreso.');
       }
       section_form_ingreso.style.display = 'none';

     const produc = document.getElementById('produc');
     const val = document.getElementById('val');
     const catego = document.getElementById('catego');
     const subcatego = document.getElementById('subcatego');
     const fec = document.getElementById('fec');
     const hor = document.getElementById('hor');
         
       produc.innerHTML = producto;
       val.innerHTML = categoria;
       catego.innerHTML = subcategoria;
       subcatego.innerHTML = valor;
       fec.innerHTML = fecha;
       hor.innerHTML = hora;

       section_detalle.style.display = 'flex';
         
       form.reset();
     } catch (error) {
       console.error('Error:', error);
       section_form_ingreso.style.display = 'none';

       product.innerHTML = producto;
       valo.innerHTML = categoria;
       categori.innerHTML = subcategoria;
       subcategori.innerHTML = valor;
       fech.innerHTML = fecha;
       hor.innerHTML = hora;
       
       section_detalle.style.display = 'flex';
     }
   });

const but_acep = document.getElementById('but_acep');

but_acep.addEventListener('click', () => {
  section_form_ingreso.style.display = 'flex';
  section_detalle.style.display = 'none';
})

