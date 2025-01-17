const montoInicialMostrado = document.getElementById('montoInicialMostrado');
const metaAhorroMostrada = document.getElementById('metaAhorroMostrada');
const editarBt = document.getElementById('editarBt');
const guardarCambiosBt = document.getElementById('guardarCambiosBt');
const eliminarBt = document.getElementById('eliminarBt');
let meta_cum_ac = document.getElementById('meta_cum_ac'); 
let tot_gas_ac = document.getElementById('tot_gas_ac');

window.addEventListener('load', () => {
    cargarYMostrarValoresDesdeAPI();
    sumarTotalGastos();
});
 
editarBt.addEventListener('click', () => {
    habilitarEdicionValMeta();
});
   
guardarCambiosBt.addEventListener('click', () => {
    guardarCambiosValMeta();
});

eliminarBt.addEventListener('click', () => {
  if (window.confirm("Esta seguro de eliminar el monto inicial y la meta de ahorro actual?")) {
      eliminarMontMeta();
    }}
);

let id_mont_met = 0;

let nuevoMonto;
let nuevaMeta;

let modoEdit = false;

// Data grafico

let dat = [0, 1];

//Calcular meta de ahorro cumplida

let mont_inicial = 0;
let met_ahorro = 0;
let total_gastos = 0;
let total_ahorro = 0;
let meta_cumplida = "Si";

if(mont_inicial == 0 || met_ahorro == 0) {
    let div_valores = document.getElementById('div_valores');
    div_valores.style.display = 'none';
}

const formIngresoValores = document.getElementById('form_ingreso_valores');

formIngresoValores.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    let monto_inicial = document.getElementById('monto_inicial').value;
    let meta_ahorro = document.getElementById('meta_ahorro').value;

    try {
        const noteData = { monto_inicial, meta_ahorro};
        await fetch('http://localhost:8081/guardar_monto_ini_met_ahor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
           
            body: JSON.stringify(noteData),
        });
        
        cargarYMostrarValoresDesdeAPI();
        
    } catch (error) {
        console.error('Error al guardar los datos:', error);
    }
}); 

async function cargarYMostrarValoresDesdeAPI() {
    try {
        const response = await fetch('https://api-finanzas-deploy.onrender.com/traer_monto_ini_met_ahor'); // Ruta de lectura de montos
        const data = await response.json();
       
        data.forEach((entry) => {
        mont_inicial = entry.monto_inicial;
        met_ahorro = entry.meta_ahorro;           
        if(mont_inicial != 0 || met_ahorro != 0){
        formIngresoValores.style.display = 'none';
        
        let div_grafic_cuenta = document.getElementById('div_grafic_cuenta');
        div_grafic_cuenta.style.display = 'flex';

        let div_valores = document.getElementById('div_valores');
        div_valores.style.display = 'flex';

        montoInicialMostrado.value = entry.monto_inicial;
        metaAhorroMostrada.value =  entry.meta_ahorro; 

        mont_inicial = entry.monto_inicial;
        met_ahorro = entry.meta_ahorro; 

        id_mont_met = entry.id;
    }
        });
    } catch (error) {
        console.error('Error al cargar los valores:', error);
    }
};

function habilitarEdicionValMeta() {
    modoEdit = true;
    editarBt.style.display = 'none';
    eliminarBt.style.display = 'none';
    guardarCambiosBt.style.display = 'inline-block';

    montoInicialMostrado.classList.remove('montoInicialMostrado');
    metaAhorroMostrada.classList.remove('metaAhorroMostrada');
    
    montoInicialMostrado.removeAttribute('readonly');
    metaAhorroMostrada.removeAttribute('readonly');

};

async function guardarCambiosValMeta() {
    modoEdit = false;
    editarBt.style.display = 'inline-block';
    eliminarBt.style.display = 'inline-block';
    guardarCambiosBt.style.display = 'none';

    montoInicialMostrado.classList.add('montoInicialMostrado');
    metaAhorroMostrada.classList.add('metaAhorroMostrada');
    
    montoInicialMostrado.setAttribute('readonly', true);
    metaAhorroMostrada.setAttribute('readonly', true);

    const nuevoMontoInicial = montoInicialMostrado.value;
    const nuevaMetaAhorro   = metaAhorroMostrada.value;

    try {        
        await fetch(`https://api-finanzas-deploy.onrender.com/actualizar_monto_ini_met_ahor/${id_mont_met}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ monto_inicial: nuevoMontoInicial, meta_ahorro: nuevaMetaAhorro }),
        });
        
          cargarYMostrarValoresDesdeAPI();
       
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
    }
};        

async function eliminarMontMeta() {
    try {
      const response = await fetch(`https://api-finanzas-deploy.onrender.com/eliminar_monto_ini_met_ahor/${id_mont_met}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar los datos.');
      }else{
        formIngresoValores.style.display = 'flex';
        
        let div_grafic_cuenta = document.getElementById('div_grafic_cuenta');
        div_grafic_cuenta.style.display = 'none';

        let div_valores = document.getElementById('div_valores');
        div_valores.style.display = 'none';
      }
  
      tbody.removeChild(row);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  async function sumarTotalGastos() {
    try {
      const response = await fetch('https://api-finanzas-deploy.onrender.com/balances_ingreso');
      if (!response.ok) {
        throw new Error('Error al obtener los datos.');
      }
  
      const data = await response.json();
  
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth() + 1;
  
      const resultadosFiltrados = data.filter(entry => {
        const fechaParts = entry.fecha.split('/');
        if (fechaParts.length === 3) {
          const mes = parseInt(fechaParts[1], 10);
          return mes === mesActual;
        }
        return false;
      });
  
      resultadosFiltrados.forEach((entry) => {
        total_gastos += entry.valor;
        esperarTotalGastos();
      });
    } catch (error) {
      console.error('Ocurrió un error:', error);
    }
  };
  
//Grafico

let data = {
  labels: ['Gastos', 'Ahorro'],
  datasets: [
      {
          label: 'Dataset 1',
          data: [total_gastos, mont_inicial - total_gastos], // Valores iniciales
          backgroundColor: ['Black', 'Green'],
      }
  ]
};

// Configuración del gráfico
const config = {
  type: 'doughnut',
  data: data,
  options: {
      responsive: true,
      plugins: {
          legend: {
              position: 'top',
          },
          title: {
              display: true,
              text: 'Chart.js Doughnut Chart'
          }
      }
  },
};

// Variable para el gráfico
let myChart;

function cargarGraficCuenta() {
  const ctx = document.getElementById('myChart').getContext('2d');
  if (myChart) myChart.destroy(); // Destruir gráfico previo
  myChart = new Chart(ctx, config); // Crear un nuevo gráfico
}

function calcularGastos() {
  let total_ahorro;
  let meta_cumplida;


  if (total_gastos < met_ahorro) { 
    total_ahorro = mont_inicial - total_gastos;
    meta_cumplida = "Si";
} else {
    total_ahorro = mont_inicial - total_gastos;
    meta_cumplida = "No";
}
 
  console.log("Monto inicial:", mont_inicial);
console.log("Total gastos:", total_gastos);
console.log("Meta de ahorro:", met_ahorro);

  document.getElementById('meta_cum_ac').innerHTML = meta_cumplida;
  document.getElementById('tot_gas_ac').innerHTML = total_gastos;

  data.datasets[0].data = [total_gastos, total_ahorro]; // Actualizar datos
  cargarGraficCuenta(); // Recargar gráfico
}

// Simular promesa para esperar
async function esperarTotalGastos() {
  while (total_gastos <= 0 && met_ahorro <= 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
  }
  calcularGastos();
}




