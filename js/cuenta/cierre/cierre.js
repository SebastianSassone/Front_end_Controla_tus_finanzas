window.addEventListener('load', () => {
    consultarCierre();
})

let section_form_cierre = document.getElementById('section_form_cierre'); 

section_form_cierre.style.display = 'none';

let monto_v = 0; 
let meta_v = 0; 
let tot_gas = 0;
let tot_ahorro = 0; 
let meta_cump = "Si"; 
let fech = ""; 

// Consultar cierre
  async function consultarCierre() {
    try {
      
      const response = await fetch('https://api-finanzas-deploy.onrender.com/balances_ingreso');
      if (!response.ok) {
        throw new Error('Error al obtener los datos.');
      }
  
      const data = await response.json();

      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth() + 1; 

      const fechaMesAnterior = data.filter(entry => {
      const fechaParts = entry.fecha.split('/');
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10);

        return mes === (mesActual - 1);
      }
        return false;
      });

      if (fechaMesAnterior.length > 0) {
      fechaMesAnterior.forEach(item => {
        verificarCierre(item.fecha);
      });
      } else {
      }
      } catch (error) {
       console.error('Error:', error.message);
     }
  }

  async function verificarCierre(fecha) {
    try {
      const response = await fetch('https://api-finanzas-deploy.onrender.com/traer_cierre');
      if (!response.ok) {
        throw new Error('Error al obtener los datos.');
      }
  
      const data = await response.json();  

      console.log(data)

      const fechaParts = fecha.split('/');
      const mesNumero = parseInt(fechaParts[1], 10);
    
      const cierreEncontrado = data.filter(entry => {
      const entryFechaParts = entry.fecha.split('/');
      if (entryFechaParts.length === 3) {
        const mes = parseInt(entryFechaParts[1], 10);
        return mes === mesNumero;
      }
      return false;
      });
  
      if (cierreEncontrado.length > 0) {
          console.log(`Se encontró un cierre para el mes ${fecha}.`);         
      } else {
          console.log(`No se encontró ningún cierre para el mes ${fecha}.`);
          traerMontoMeta();
          sumarTotalGastosCierre(fecha);
          fech = fecha;          
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  
  //Calcular total gastos

  async function sumarTotalGastosCierre(fechaVerificada) {
    try {
      const response = await fetch('https://api-finanzas-deploy.onrender.com/balances_ingreso');
      if (!response.ok) {
        throw new Error('Error al obtener los datos.');
      }
  
      const data = await response.json();
    
      const mesNumero = parseInt(fechaVerificada.split('/')[1], 10);

      const resultadosFiltrados = data.filter(entry => {
      const fechaParts = entry.fecha.split('/');
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10);
        return mes === mesNumero;
      }
       return false;
      });

      resultadosFiltrados.forEach((entry) => {
      tot_gas += entry.valor;
      });
  
    } catch (error) {
      console.error('Ocurrió un error:', error);
    }
  }
  
  // Traer monto inicial meta y meta de ahorro

  async function traerMontoMeta() {
    try {
        const response = await fetch('https://api-finanzas-deploy.onrender.com/traer_monto_ini_met_ahor');
        const data = await response.json();

        console.log(data);
       
        data.forEach((entry) => {
        monto_v = entry.monto_inicial;
        meta_v = entry.meta_ahorro;
        
      })
 
    }catch (error) {
        console.error('Error al cargar los valores:', error);
    }
}
  
// Guardar cierre

let form_cierre = document.getElementById('form_cierre'); 

form_cierre.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    monto = monto_v;
    meta = meta_v;
    gastos = tot_gas;     
    ahorro = tot_ahorro;
    fecha = fech;
    meta_cumplida = meta_cump;
    
    try {
      const noteData = {monto,  meta, gastos, ahorro, fecha, meta_cumplida};
      await fetch('https://api-finanzas-deploy.onrender.com/guardar_cierre', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(noteData),
        });
        
        section_form_cierre.style.display = 'none';  
        
        alert('Cierre exitoso');

    } catch (error) {
        console.error('Error al guardar los datos:', error);
    }
}); 

// Calcular cierre
        
 function calcularGastosCierre(){

  monto_v;
  meta_v;
  tot_gas;

 if(tot_gas <= meta_v ){
    tot_ahorro = monto_v - tot_gas;
    meta_cump = "Si";
    }else{
    tot_ahorro = monto_v - tot_gas;
    meta_cump = "No";
  }
     let section_form_cierre = document.getElementById('section_form_cierre'); 
      section_form_cierre.style.display = 'flex';
      let monto = document.getElementById('monto_in'); 
      let meta = document.getElementById('met_aho'); 
      let gastos = document.getElementById('total_gas'); 
      let ahorro = document.getElementById('total_aho'); 
      monto.value = monto_v;
      meta.value = meta_v;
      gastos.value = tot_gas;
      ahorro.value = tot_ahorro;
  };

  async function esperarTotalGastosCierre() {
    while (tot_gas <= 0) {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    }
    calcularGastosCierre(); 
  }
  
esperarTotalGastosCierre();       