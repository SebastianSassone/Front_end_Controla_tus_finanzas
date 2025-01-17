let chartdata = [];

let longCharData = 0;

let total_gastos = 0;

async function waitForCounterToReach(targetCount) {

  while (longCharData < targetCount) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
  }
  
  mosGrafic();
}

waitForCounterToReach(6);

const select = document.getElementById('select_mes');
select.addEventListener('change', () => {
  valorAlim();
  valorServi();
  valorHigie();
  valorSalud();
  valorTransp();
  valorOtros();
});

function mosGrafic(){
anychart.onDocumentReady(function () {
    
    let chart = anychart.pie(chartdata);

    chart.title('Grafico de valances consumo diario');
    chart.labels().position('outside');
    chart
      .legend()
      .title()
      .enabled(true)
      .text('Categorias')
      .padding([0, 0, 10, 0]);

    chart
      .legend()
      .position('center-bottom')
      .itemsLayout('horizontal')
      .align('center');

    chart.container('container');

    chart.draw();
  })};

//Filtrar datos

function sumarValoresPorFecha(data, mesSeleccionado) {
  const mesNumero = parseInt(mesSeleccionado, 10);

  if (mesNumero < 1 || mesNumero > 12) {
    alert('Mes no seleccionado');
    return 0; 
  }

  let total = 0;

  const resultadosFiltrados = data.filter(entry => {
    const fechaParts = entry.fecha.split('/');
    if (fechaParts.length === 3) {
      const mes = parseInt(fechaParts[1], 10);
      return mes === mesNumero;
    }
    return false;
  });

  resultadosFiltrados.forEach(entry => {
      total += entry.valor;    
  });

  return total;
}


async function valorAlim() {
  try {
    const response = await fetch('https://api-finanzas-deploy.onrender.com/total_alimentos');
    if (!response.ok) {
      throw new Error('Error al obtener los datos de alimentación.');
    }

    const alimentacionData = await response.json();

    const select = document.getElementById('select_mes');
    const mesSeleccionado = select.value;

    const resultadosFiltrados = sumarValoresPorFecha(alimentacionData, mesSeleccionado);

      chartdata.push(["Alimentacion", resultadosFiltrados]);    
   
      total_gastos += resultadosFiltrados;
    
      longCharData++;
    
  } catch (error) {
    console.error('Error:', error);
  }
}

  async function valorServi() {
    try {
      const response = await fetch('https://api-finanzas-deploy.onrender.com/total_servicios');
      if (!response.ok) {
        throw new Error('Error al obtener las notas.');
      }
  
      const serviciosData = await response.json();

       const select = document.getElementById('select_mes');
       
       const mesSeleccionado = select.value;

       const resultadosFiltrados = sumarValoresPorFecha(serviciosData, mesSeleccionado);

      chartdata.push(["Servicios", resultadosFiltrados]);

      total_gastos += resultadosFiltrados;
      
      longCharData++;;

    } catch (error) {
      console.error('Error:', error);
      
    }
  }

  async function valorHigie() {
    try {
      const response = await fetch('https://api-finanzas-deploy.onrender.com/total_otros');
      if (!response.ok) {
        throw new Error('Error al obtener las notas.');
      }
  
      const higieneData = await response.json();

       const select = document.getElementById('select_mes');
       
       const mesSeleccionado = select.value;

       const resultadosFiltrados = sumarValoresPorFecha(higieneData, mesSeleccionado);

      chartdata.push(["Higiene", resultadosFiltrados]);

      total_gastos += resultadosFiltrados;
      
      longCharData++;;

    } catch (error) {
      console.error('Error:', error);
      
    }
  }

  async function valorSalud() {
    try {
      const response = await fetch('https://api-finanzas-deploy.onrender.com/total_transporte');
      if (!response.ok) {
        throw new Error('Error al obtener las notas.');
      }
  
      const saludData = await response.json();

       const select = document.getElementById('select_mes');
       
       const mesSeleccionado = select.value;

       const resultadosFiltrados = sumarValoresPorFecha(saludData, mesSeleccionado);

      chartdata.push(["Salud", resultadosFiltrados]);

      total_gastos += resultadosFiltrados;
      
      longCharData++;;

    } catch (error) {
      console.error('Error:', error);
      
    }
  }

  async function valorTransp() {
    try {
      const response = await fetch('https://api-finanzas-deploy.onrender.com/total_salud');
      if (!response.ok) {
        throw new Error('Error al obtener las notas.');
      }
  
      const transporteData = await response.json();

       const select = document.getElementById('select_mes');
       
       const mesSeleccionado = select.value;

       const resultadosFiltrados = sumarValoresPorFecha(transporteData, mesSeleccionado);

      chartdata.push(["Transporte", resultadosFiltrados]);

      total_gastos += resultadosFiltrados;
      
      longCharData++;;

    } catch (error) {
      console.error('Error:', error);
      
    }
  }

  async function valorOtros() {
    try {
      const response = await fetch('https://api-finanzas-deploy.onrender.com/total_higiene');
      if (!response.ok) {
        throw new Error('Error al obtener las notas.');
      }
  
      const otrosData = await response.json();

       const select = document.getElementById('select_mes');
       
       const mesSeleccionado = select.value;

       const resultadosFiltrados = sumarValoresPorFecha(otrosData, mesSeleccionado);

      chartdata.push(["Otros", resultadosFiltrados]);

      total_gastos += resultadosFiltrados;
            
      longCharData++;;    } catch (error) {
      console.error('Error:', error);
      
    }
  }

