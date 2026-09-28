//INICIO VARIABLES GENERALES
var descripcion = "Each letter in its place. Build the word that corresponds to the statement.";
var control_de_tiempo = "180";
var numero_de_preguntas = 3;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "3";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","pregunta":"____________ can cause reputational risks, can\\\'t it?","respuestas":[{"tipo":"texto","respuesta":"infringement","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"a violation or act that breaks a law","correcta":"no"},{"id_pregunta":"2","pregunta":"Everything that includes infringement to copyrights and trade mark, or even selling ____________.","respuestas":[{"tipo":"texto","respuesta":"counterfeits","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"a copy or imitation of something without the owner’s permission, plural ","correcta":"no"},{"id_pregunta":"3","pregunta":"Some risks may be leaded to limitless ________ or custodial sentences.","respuestas":[{"tipo":"texto","respuesta":"fines","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"a quantity of money that is supposed to be paid because of doing something against the law, plural  ","correcta":"no"}]}';
//FIN VARIABLES GENERALES

//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var preguntas_realizadas = new Array();
var mis_respuestas = new Array();
var frase_actual;
var intento_actual = 1;
var letras_a_encontrar;
var draggables;
var droppables;

var preguntas_json_original = eval("(" + preguntas_txt + ")");
/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/

function inicializar_reglas_actividad() {
    $('#cont_descripcion').html(descripcion);
    if (numero_de_preguntas > 1) {
        $('#cont_numero_de_preguntas').html('The activity is composed of ' + numero_de_preguntas + ' questions. This icon will change every time you answer each question.');
    } else {
        $('#cont_numero_de_preguntas').html('The activity is composed of ' + numero_de_preguntas + ' question. This icon will change every time you answer each question.');
    }
    if (numero_de_intentos > 1) {
        $('#cont_numero_de_intentos').html('You have ' + numero_de_intentos + ' attempts to successfully complete the activity.');
    } else {
        $('#cont_numero_de_intentos').html('You have ' + numero_de_intentos + ' attempt to successfully complete the activity.');
    }
    if (exito_puntaje > 1) {
        $('#cont_puntaje').html('To successfully complete this activity, you must get at least ' + exito_puntaje + ' points. Each correct answer gives ');
    } else {
        $('#cont_puntaje').html('To successfully complete this activity, you must get at least ' + exito_puntaje + ' point. Each correct answer gives ');
    }
    if (puntaje > 1) {
        $('#cont_puntaje').html($('#cont_puntaje').html() + ' ' + puntaje + ' points.');
    } else {
        $('#cont_puntaje').html($('#cont_puntaje').html() + ' ' + puntaje + ' point.');
    }
    msg_tiempo = 'This activity has no time limit.';
    if (control_de_tiempo !== '' && control_de_tiempo !== '0') {
        if (control_de_tiempo > 1) {
            msg_tiempo = 'You have  ' + control_de_tiempo + ' seconds to complete the activity.';
        } else {
            msg_tiempo = 'You have  ' + control_de_tiempo + ' second to complete the activity.';
        }
    }
    $('#cont_tiempo').html(msg_tiempo);
    logo_animation();
}

function inicializar_actividad() {
    preguntas_json = JSON.parse(JSON.stringify(preguntas_json_original));
    $('#cont_puntos').html("0");
    $('#btn_actividad_container').html('<button id="btn_acciones" onclick="responder_pregunta();" class="btn_actividad btn_enviar_morado">Submit</button>');
    pregunta_actual = 1;
    inicializa_iconos_preguntas();
    preguntas_json.preguntas.mezclar_preguntas();
    siguiente_pregunta();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/
function siguiente_pregunta() {
	$('#scrabble_actividad_pista').html('');
    var siguiente_pregunta = preguntas_json.preguntas[pregunta_actual - 1].pregunta;
    if (preguntas_json.preguntas[pregunta_actual - 1].pista !== '') {
        siguiente_pregunta += ' <img onclick="interactuar_con_pista(' + pregunta_actual + '); " id="trigger_pista_' + pregunta_actual + '" class="pista_pregunta" alt="Pista" src="../assets/img/pista_ico.png"/>';
        $('#scrabble_actividad_pista').html('<p class="pista" id="pista_' + pregunta_actual + '" style="display: none;" >' + preguntas_json.preguntas[pregunta_actual - 1].pista + '</p>');
    }
    $('#cont_pregunta_scrabble').html(siguiente_pregunta);
    inicializar_tablero();
    $('#palabra_oculta').html(armar_respuesta_correcta(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta));
    $('#cont_letras_scrabble').html(armar_letras_a_usar(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta));
    inicializar_draggables_droppables();
}
function inicializar_tablero() {
    $('#but_acciones').css('display', 'none');
    intentos_ahogado = '3';
    letras_encontradas = '0';
    draggables = new Array();
    droppables = new Array();
}
function inicializar_draggables_droppables() {
    for (var i = 0; i < draggables.length; i++) {
        $("#drag_" + draggables[i]).draggable({
//            revert: "invalid"
            revert: "valid"           
        });
    }
    for (var i = 0; i < droppables.length; i++) {
        $("#letra_" + droppables[i]).droppable({
            hoverClass: "ui-state-active",
            drop: function (event, ui) {
                var id = ui.draggable.attr("id");
                seleccionar_letra(id, event.target.id);
                $(this).append(ui.draggable.css('position', 'static'));
                $(this).append(ui.draggable.css('width', '100%'));
                $(this).droppable("destroy");
                ui.draggable.draggable("destroy");
            }
        });
    }
}
function armar_respuesta_correcta(respuesta_a_armar) {
    var respuesta_armada = '<td>';
    letras_a_encontrar = 0;
    for (var i = 0; i < respuesta_a_armar.length; i++) {
        if (respuesta_a_armar.charAt(i) === ' ') {
            imagen = '<div class="espacio_en_blanco_scrabble">';
        } else {
            droppables.push((i + 1));
            imagen = '<div id="letra_' + (i + 1) + '">';
            letras_a_encontrar++;
        }
        letra_escondida = '<input type="hidden" value="" id="h_letra_' + (i + 1) + '"/></div>';
        respuesta_armada += imagen + letra_escondida;
    }
    respuesta_armada += '</td>';
    return respuesta_armada;
}
function armar_letras_a_usar(respuesta_a_armar) {
    for (var i = 0; i < respuesta_a_armar.length; i++) {
        if (respuesta_a_armar.charAt(i) !== ' ') {
            draggables.push(i);
        }
    }
    draggables.mezclar_preguntas();
    var letras_a_usar = '<center>';
    for (var i = 0; i < draggables.length; i++) {
        letras_a_usar += '<img id="drag_' + draggables[i] + '" src="assets/img/scrabble_' + respuesta_a_armar.charAt(draggables[i]) + '.png" alt="Letra"/><input type="hidden" value="' + respuesta_a_armar.charAt(draggables[i]) + '" id="h_drag_' + draggables[i] + '"/>';
    }
    letras_a_usar += '</center>';
    return letras_a_usar;
}
function seleccionar_letra(origen, destino) {
    $('#h_' + destino).val($('#h_' + origen).val());
    var termino_de_armar_palabra = true;
    for (var i = 1; i <= droppables.length; i++) {
        if ($('#h_letra_' + i).val() === '') {
            termino_de_armar_palabra = false;
        }
    }
    if (termino_de_armar_palabra) {
        $('#but_acciones').css('display', 'block');
    }
}
function responder_pregunta() {
    var scrabble_realizado = '';
    for (var i = 1; i <= droppables.length; i++) {
        scrabble_realizado += $('#h_letra_' + i).val();
    }
    if (preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta === scrabble_realizado) {
        activar_estrella(pregunta_actual, 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    } else {
        preguntas_json.preguntas[pregunta_actual - 1].respuestas[0]['incorrecta'] = scrabble_realizado;
        activar_estrella(pregunta_actual, 'fallo');
    }
    if (pregunta_actual === numero_de_preguntas) {
        activar_contenedor('cont_resultados');
        parar_cuenta_regresiva();
        armar_resultados();
    } else {
        pregunta_actual++;
        siguiente_pregunta();
    }
}
function mostrar_mensaje_en_imagen(mensaje, color) {
    var msg_fallo = $('#msg_fallo');
    msg_fallo.css('color', color);
    msg_fallo.html(mensaje);
    msg_fallo.fadeIn(1000);
    msg_fallo.fadeOut(1000);
}
/*FIN FUNCIONES PUNTUALES ACTIVIDAD*/

/*DE ACA EN ADELANTE ESTAN LAS FUNCIONES GENERICAS*/
function reintentar() {
    preguntas_realizadas = new Array();
    $('#cont_puntos').html("0");
    puntaje_actual = "0";
    intento_actual++;
    inicializar_actividad();
}

function activar_estrella(num_pregunta, estado) {
    var obj_pregunta = $('#pregunta_' + num_pregunta);
    var imagen = '../assets/img/estrella_exito.png';
    var titulo = "CORRECT";
    if (estado === 'fallo') {
        imagen = '../assets/img/estrella_fallo.png';
        titulo = "INCORRECT";
    } else {
        preguntas_json.preguntas[pregunta_actual - 1].correcta = 'si';
    }
    preguntas_realizadas.push(preguntas_json.preguntas[pregunta_actual - 1]);
    obj_pregunta.fadeOut(500, function () {
        obj_pregunta.attr("src", imagen);
        obj_pregunta.attr("title", titulo);
        obj_pregunta.fadeIn(500);
    });
}

function inicializa_iconos_preguntas() {
    var html_txt = '';
    for (var i = 1; i <= parseInt(numero_de_preguntas); i++) {
        html_txt += '<div class="pregunta_' + i + '"><img title="QUESTION ' + i + '" id="pregunta_' + i + '" src="../assets/img/estrella_turno_actual.png" alt="Icono"/></div>';
    }
    $('.preguntas').html(html_txt);
}

function activar_contenedor(contenedor) {
    if (contenedor === 'cont_actividad') {
        $('#cont_actividad').fadeIn(1000);
        $('#inicio_actividad').fadeOut(1000);
        $('#cont_resultados').fadeOut(1000);
    } else if (contenedor === 'inicio_actividad') {
        $('#cont_actividad').fadeOut(1000);
        $('#inicio_actividad').fadeIn(1000);
        $('#cont_resultados').fadeOut(1000);
    } else if (contenedor === 'cont_resultados') {
        $('#cont_actividad').fadeOut(1000);
        $('#inicio_actividad').fadeOut(1000);
        $('#cont_resultados').fadeIn(1000);
    } else {
        console.log('ERROR GARRAFAL. NO LLEGO TIPO DE CONTENEDOR. CONTACTE AL PROVEEDOR DEL SOFTWARE.');
        return false;
    }
}

function armar_resultados() {
    if (puntaje_actual >= exito_puntaje) {
        $('#txt_pagina_resultados').html('Success <img src="../assets/img/mano_arriba.png" alt="Success"/>');
        $('.resultados_preguntas').css('display', 'block');
        $('.resultados_preguntas').html(calcular_resultados());
        $('.cont_reintentar').css('display', 'none');
    } else {
        if (intento_actual === numero_de_intentos) {
            $('#txt_pagina_resultados').html('Failure <img src="../assets/img/mano_abajo.png" alt="Failure"/>');
            $('.resultados_preguntas').css('display', 'block');
            $('.resultados_preguntas').html(calcular_resultados());
            $('.cont_reintentar').css('display', 'none');
        } else {
            $('.resultados_preguntas').css('display', 'none');
            $('.cont_reintentar').css('display', 'block');
            if ((numero_de_intentos - intento_actual) > 1) {
                msg_intentos = "You have " + (numero_de_intentos - intento_actual) + " attempts left.";
            } else {
                msg_intentos = "You have 1 try.";
            }
            $('#cantidad_intentos_restantes').html(msg_intentos);
        }
    }
}

function calcular_resultados() {
    var resultados = '';
    var tu_respuesta;
    var class_respuesta;
    var imagen_respuesta;
    if (preguntas_realizadas.length > 0) {
        for (var i = 0; i < preguntas_realizadas.length; i++) {
            resultados += '<div class="cont_pregunta">';
            resultados += '<p class="numero_pregunta">' + preguntas_realizadas[i].pregunta + '</p>';
            if (preguntas_realizadas[i].correcta === 'si') {
                tu_respuesta = preguntas_realizadas[i].respuestas[0].respuesta;
                class_respuesta = 'txt_respuesta_correcta';
                imagen_respuesta = 'estrella_exito.png';
            } else {
                if (preguntas_realizadas[i].respuestas[0].incorrecta.length == 0) {
                    tu_respuesta = 'No usó ninguna letra.';
                } else {
                    tu_respuesta = preguntas_realizadas[i].respuestas[0].incorrecta;
                }
                class_respuesta = 'txt_respuesta_incorrecta';
                imagen_respuesta = 'estrella_fallo.png';
            }
            resultados += '<p class="subtitulo_respuesta_txt">Your answer:&nbsp;&nbsp;<span class="' + class_respuesta + '">' + tu_respuesta + '</span></p>';
            resultados += '<p class="subtitulo_respuesta_txt">Correct answer:&nbsp;&nbsp;<span>' + preguntas_realizadas[i].respuestas[0].respuesta + '</span></p>';
            resultados += '<img src="../assets/img/' + imagen_respuesta + '" alt="Imagen"/>';
            resultados += '</div>';
        }
    } else {
        resultados = '<div style="font-size:xx-large;text-align:center;"><span id="cantidad_intentos_restantes">The time is over and there are no more attempts.</span></div>';
    }
    return resultados;
}

function perdio_por_tiempo() {
    activar_contenedor('cont_resultados');
    armar_resultados();
}

/*INICIO FUNCIONES DEL CRONOMETRO*/
function activar_cronometro() {
    if (control_de_tiempo > 0) {
        $('.tiempo_actividad').css('display', 'block');
        inicio_cuenta_regresiva(control_de_tiempo);
    } else {
        $('.tiempo_actividad').css('display', 'none');
    }
}
function inicio_cuenta_regresiva(control_de_tiempo) {
    if (typeof control !== 'undefined') {
        reinicio_cuenta_regresiva(control_de_tiempo);
    } else {
        segundos = control_de_tiempo;
        control = setInterval(cuenta_regresiva, 1000);
    }
}
function parar_cuenta_regresiva() {
    if (control_de_tiempo > 0) {
        clearInterval(control);
    }
}
function reinicio_cuenta_regresiva(control_de_tiempo) {
    clearInterval(control);
    segundos = control_de_tiempo;
    $('#cont_segundos').html(segundos);
    control = setInterval(cuenta_regresiva, 1000);
}
function cuenta_regresiva() {
    $('#cont_segundos').html(segundos);
    if (segundos === 0) {
        parar_cuenta_regresiva();
        perdio_por_tiempo();
    } else {
        segundos--;
    }
}
/*FIN FUNCIONES DEL CRONOMETRO*/

Array.prototype.mezclar_preguntas = function () {
    var m = this.length - 1;
    for (var i = m; i > 1; i--) {
        var alea = Math.floor(i * Math.random());
        var temp = this[i];
        this[i] = this[alea];
        this[alea] = temp;
    }
};

$(window).load(setTimeout(inicializar_reglas_actividad(), 1000));