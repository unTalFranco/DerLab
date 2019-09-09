
function descuento(nombre, alicuotaAporte, alicuotacontribucion, empleado, empleador, total) {
    this.nombre = nombre;
    this.alicuotaAporte = alicuotaAporte;
    this.alicuotacontribucion = alicuotacontribucion;
    this.empleado = empleado;
    this.empleador = empleador;
    this.total = total;
}

var listaDescuentos = [
    new descuento('Jubilacion', 0.11, 0.16, 0, 0, 0),
    new descuento('PAMI', 0.03, 0.02, 0, 0, 0),
    new descuento('Obra Social', 0.03, 0.05, 0),
    new descuento('Asignaciones Familiares', 0.00, 0.075, 0, 0, 0),
    new descuento('Seguro de vida', 0, 0.3 / 100, 0, 0, 0),
    new descuento('Fondo nac. de empleo', 0, 0.015, 0, 0, 0),
    new descuento('ART', 0, 0.03, 0, 0, 0)
]

var total = new descuento('TOTAL aportes y contribuciones', 0, 0, 0, 0, 0);

var sueldoBruto = 0;

var captarDatos = function() {
    bruto = document.getElementById('bruto').value;
    calcular(bruto);
}

var calcular = function (bruto) {
    sueldoBruto = bruto;
    listaDescuentos.forEach(element => {
        element.empleado = bruto * element.alicuotaAporte;
        element.empleador = bruto * element.alicuotacontribucion;
        element.total = element.empleado + element.empleador;
        console.log(element.nombre + element.total)
    }); calcularTotal();
    pintarGraficoAportes();
    pintarGraficoContribuciones();
    pintarGraficoTotal();
    pintarGraficoTotalX();
    pintarCard();
}

var pintarDivs = function (id,importe){
    document.getElementById(id).innerHTML = '$' + importe; 
}

var pintarCard = function () {
    var costoEmpleador = sueldoBruto * 1 + total.empleador;
    console.log(sueldoBruto);
    console.log(total.empleador);
    var sueldoNeto = sueldoBruto - total.empleado;
    document.getElementById("card").innerHTML = 'Su empleador pago en total $ ' + costoEmpleador + ' que fueron generados por Ud. que solamente recibio $' + sueldoNeto;
}

var calcularTotal = function () {
    listaDescuentos.forEach(element => {
        total.alicuotaAporte = total.alicuotaAporte + element.alicuotaAporte;
        total.alicuotacontribucion = total.alicuotacontribucion + element.alicuotacontribucion;
        total.empleado = total.empleado + element.empleado;
        total.empleador = total.empleador + element.empleador;
        total.total = total.total + element.total;
        console.log('Se esta sumando en concepto de contribucion ' + element.nombre + 'la suma de' + element.alicuotacontribucion)
    });
    console.log(total)
    pintarDivs('contribuciones', total.empleador);
    pintarDivs('aportes',total.empleado);
    pintarDivs('ayc',total.empleado + total.empleador)
}

var nuevoDescuento = function (nombre, alicuotaAporte, alicuotacontribucion) {
    if (validarAlicouta(alicuotaAporte) &&
        validarAlicouta(alicuotacontribucion) &&
        validarString(nombre)) {
        listaDescuentos.push(new descuento(nombre, alicuotaAporte, alicuotacontribucion, 0, 0, 0))
    }

}

var validarAlicouta = function (alicuota) {
    var validacion = false;
    if (typeof alicuota === 'number') {
        validacion = true;
    } else { alert('La alicuota debe estar expresada en caracter numerico del 0 al 1. Por ejemplo 0.1 para una alicuota del 10%') }
    return validacion
}

var validarString = function (texto) {
    var validacion = false;
    if (typeof texto == 'string') {
        validacion = true;
    } else { alert('el dato ' + texto + ' debe estar ingresado en formato texto y debe ser representativo.') }
    return validacion
}

var calcularHistorico = function (mesesTrabajados) {
    var aportesHistoricos = mesesTrabajados * total.empleado;
    var contribucionesHistoricas = mesesTrabajados * total.empleador;
    var totalHistorico = aportesHistoricos + contribucionesHistoricas;
    console.log('Historicamente a valores corrientes segun su salario actual el sistema a traves de sus aportes y contribuciones le ha cobrado la suma de $' + totalHistorico)
}



//Grafico Aportes------------------------------------------------------------------------------------------------------------------------


var ctxAportes = document.getElementById('aportesChart').getContext('2d');

var pintarGraficoAportes = function () {
    var nombresDatos = [];
    var importeDatos = [];


    listaDescuentos.forEach(element => {
        if (element.alicuotaAporte > 0) {
            nombresDatos.push(element.nombre + ' ' + element.alicuotaAporte * 100 + '%');
            importeDatos.push(element.empleado);
        }
    });
    nombresDatos.push('NETO');
    importeDatos.push(sueldoBruto - total.empleado)

    var myBarChart = new Chart(ctxAportes, {
        type: 'pie',
        data: {
            labels: nombresDatos,
            datasets: [{
                label: 'Num Datos',
                data: importeDatos,
               backgroundColor : ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],             

            }]
        },
        options: {
            plugins: {        
              colorschemes: {        
                scheme: 'brewer.Paired12'        
              }        
            }        
          }
    });
}


//grafico total-------------------------------------------------------------------------------------------------------------

var ctxContribuciones = document.getElementById('totalChart').getContext('2d');

var pintarGraficoContribuciones = function () {
    var nombresDatos = ['Sueldo Neto', 'Aportes + Contribuciones'];
    var importeDatos = [ sueldoBruto - total.empleado , total.empleado + total.empleador ];   
        
    
    var myBarChart = new Chart(ctxContribuciones, {
        type: 'pie',
        data: {
            labels: nombresDatos,
            datasets: [{
                label: 'Num Datos',
                data: importeDatos,
                backgroundColor: [
                    '#a5d6a7',
                    'grey',
                    '#81c784',
                    '#66bb6a',
                    '#4caf50',
                    '#43a047',
                    '#388e3c',
                    '#2e7d32',
                    '#1b5e20'
                ]

            }]
        },
        //options: options
    });
}



//total 1 chart

var ctxTotal1 = document.getElementById('total1Chart').getContext('2d');

var pintarGraficoTotalX = function () {
    var nombresDatos = [];
    var importeDatos = [];
    var sumaAyC = total.empleado + total.empleador;

    listaDescuentos.forEach(element => {
        if (element.total > 0) {
            nombresDatos.push(element.nombre);
            importeDatos.push(element.total);
        }
    });
    var myBarChart = new Chart(ctxTotal1, {
        type: 'horizontalBar',
        data: {
            labels: nombresDatos,
            datasets: [{
                label: 'Aportes + Contribuciones = $' + sumaAyC,
                data: importeDatos,
                backgroundColor: [
                    '#c8e6c9',
                    '#a5d6a7',
                    '#81c784',
                    '#66bb6a',
                    '#4caf50',
                    '#43a047',
                    '#388e3c',
                    '#2e7d32',
                    '#1b5e20'
                ]

            }]
        },
        //options: options
    });
}

var ctxTotal = document.getElementById('contribucionesChart').getContext('2d');
var pintarGraficoTotal = function () {
    var nombresDatos = [];
    var importeDatos = [];


    listaDescuentos.forEach(element => {
        if (element.alicuotacontribucion > 0) {
            nombresDatos.push(element.nombre + ' ' + element.alicuotacontribucion * 100 + '%');
            importeDatos.push(element.empleador);
        }
    });
    var myBarChart = new Chart(ctxTotal, {
        type: 'horizontalBar',
        data: {
            labels: nombresDatos,
            datasets: [{
                label: 'Num Datos',
                data: importeDatos,
                backgroundColor: [
                    '#c8e6c9',
                    '#a5d6a7',
                    '#81c784',
                    '#66bb6a',
                    '#4caf50',
                    '#43a047',
                    '#388e3c',
                    '#2e7d32',
                    '#1b5e20'
                ]

            }]
        },
        //options: options
    });
}

















/*
var grafico = function (ctx) {
    var myBarChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: nombresDatos,
            datasets: [{
                label: 'Num Datos',
                data: importeDatos,
                backgroundColor: [
                    '#c8e6c9',
                    '#a5d6a7',
                    '#81c784',
                    '#66bb6a',
                    '#4caf50',
                    '#43a047',
                    '#388e3c',
                    '#2e7d32',
                    '#1b5e20'
                ]

            }]
        },
        //options: options
    });
}
*/