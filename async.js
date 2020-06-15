// ESTILO errback
function serie() {
	async1(function() {
		console.log('async1', data);
		async2(function(err, data) {
			if (err) return console.log('fallo async2', err);
			console.log('async2', data);
		});
	}, function(error) {
		console.log('fallo async1', error)
	});
}
serie();

function async1(cb) {
	cb(null, 'data');
}
function async2(cb) {
	cb('error2', 'data');
}

// ESTILO jQuery;
function serie() {
	async1(
		function(data) {
			console.log('async1', data);
			async2(
				function(data) {
					console.log('async2', data);
				},
				function(error) {
					console.log('fallo async2', error);
				}
			);
		},
		function(error) {
			console.log('fallo async1', error);
		}
	);
}
serie();

//	CALLBACKS PARALLEL
function paralelo(cb) {
	var contador = 0;
	var error = false;

	function errback(err, dato) {
		contador++;
		if (error) return;
		if (err) {
			error = true;
			return cb(err, dato);
		}
		if (contador == 2) return cb(null, dato);
	}

	async1(errback);
	async2(errback);
}

// CALLBACKS RACE
function carrera(cb) {
	// Aca NO tengo que guardar cuantas veces se llamó,
	// como es una carrera solo me interesa saber si se llamo.
	var error = false;
	function errback(err, dato) {
		// Llamar al cb de carrera UNA SOLA VEZ con el error
		// o con el dato
		if (error) return;
		error = true;
		if (err) return cb(err, dato);
		else return cb(null, dato);
	}
	async1(errback);
	async2(errback);
}

//	CALLBACK W/SUCCESS & ERROR
function notificacion(datos, exito, error, notif) {
	var huboError = false;
	var contador = 0;
	function okCb(dato) {
		if (huboError) return;
		notif(dato);
		contador++;
		if (contador == datos.length) exito();

	}

	function errCb(err) {
		if (huboError) return;
		huboError = true;
		error(err);
	}
	for (var i = 0; i < datos.length; i++) {
		async(datos[i], okCb, errCb);
	}
}

// ASYNC.SERIES
function uno (cb) {
    setTimeout(function() {
    console.log('1');
  }, 100);
}

function dos (cb) {
  setTimeout(function() {
    console.log('2');
  }, 100);
}

function pi (cb) {
    setTimeout(function() {
    console.log('3.1416');
  }, 100);
}

var lista = [uno, dos, pi];

async.series(lista, function(err, resultados) {
  if(err) {
    return console.log(err);
  }
  for (var i = 0; i < lista.length; i++) {
    console.log(lista[i]);
  }
});

// ASYNC.WATERFALL
function hola(cb) {
	setTimeout(function() {
		cb(null, 'hola');
	}, 100);
}

function que(arg1, cb) {
	setTimeout(function() {
		cb(null, arg1 + 'que');
	}, 100);
}

function tal(arg1, cb) {
	setTimeout(function() {
		cb(null, arg1 + 'tal');
	}, 100);
}

var lista = [hola, que, tal];

async.waterfall(lista, function(err, resultado) {
	if (err) return console.log('Buu', err);
	console.log('Wii', resultado);
});

