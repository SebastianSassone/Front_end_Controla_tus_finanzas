const tbody = document.querySelector("#category-list tbody");
let isGrayRow = false;

function filtrarMes(data, mesSeleccionado) {
  const mesNumero = parseInt(mesSeleccionado, 10);

  if (mesNumero < 1 || mesNumero > 12) {
    return;
  }

    const resultadosFiltrados = data.filter(entry => {
    const fechaParts = entry.fecha.split('/');
    if (fechaParts.length === 3) {
      const mes = parseInt(fechaParts[1], 10);
      return mes === mesNumero;
    }
    return false;
  });

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  resultadosFiltrados.forEach((entry) => {
    let row = document.createElement("tr");
    row.dataset.id = entry.id;
    row.innerHTML =
      "<td>" + entry.producto + "</td>" +
      "<td>" + entry.categoria + "</td>" +
      "<td>" + entry.subcategoria + "</td>" +
      "<td>" + entry.valor + "</td>" +
      "<td>" + entry.fecha + "</td>" +
      "<td>" + entry.hora + "</td>";

    if (isGrayRow) {
      row.classList.add("gray-row");
    }

    tbody.appendChild(row);

    isGrayRow = !isGrayRow;
  });
}

async function agregarDetalle(mesSeleccionado) {
  try {
    const response = await fetch('https://api-finanzas-deploy.onrender.com/balances_ingreso');
    if (!response.ok) {
      throw new Error('Error al obtener los datos.');
    }
    const data = await response.json();

    filtrarMes(data, mesSeleccionado);
  } catch (error) {
    console.error('Error:', error);
  }
}

const selection = document.getElementById('select_mes');
selection.addEventListener('change', () => {

  const select = document.getElementById('select_mes');
  const mesSeleccionado = select.value;

agregarDetalle(mesSeleccionado);
cargarYTraerCierre(mesSeleccionado);
console.log(select.value);
});

window.addEventListener('load', () => {
  agregarDetalle();
});


//Mostrar cierre 

async function cargarYTraerCierre(mesSeleccionado) {
  try {
    const response = await fetch('https://api-finanzas-deploy.onrender.com/traer_cierre'); 
    const data = await response.json();

    const mesNumero = parseInt(mesSeleccionado, 10);

    if (mesNumero < 1 || mesNumero > 12) {
      return;
    }
           
    const resultadosFiltrados = data.filter(entry => {
    const fechaParts = entry.fecha.split('/');
    if (fechaParts.length === 3) {
      const mes = parseInt(fechaParts[1], 10);
      return mes === mesNumero;
    }
      return false;
    });

    let mont_ini = document.getElementById('val_ini');
    let met_ahorr = document.getElementById('met_ahorr');
    let tot_gas = document.getElementById('tot_gas');
    let tot_ahorr = document.getElementById('tot_ahorr');
    let meta_cumplida = document.getElementById('meta_cumplida');

    resultadosFiltrados .forEach((entry) => {
    mont_ini.innerHTML = entry.monto; 
    met_ahorr.innerHTML = entry.meta;
    tot_gas.innerHTML = entry.gastos;
    tot_ahorr.innerHTML = entry.ahorro;
    meta_cumplida.innerHTML = entry.meta_cumplida;                              
    
    console.log("datos", entry.monto);
    console.log("datos", entry.meta);
    console.log("datos", entry.gastos);
    console.log("datos", entry.ahorro);
    console.log("datos", entry.meta_cumplida);

    })
      
  } catch (error) {
    console.error('Error al cargar los valores:', error);
    }
}