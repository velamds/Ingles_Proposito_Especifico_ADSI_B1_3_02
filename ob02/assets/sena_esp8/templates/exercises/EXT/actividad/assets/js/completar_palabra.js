//INICIO VARIABLES GENERALES
var descripcion = "Select the correct option to complete the idea.";
var control_de_tiempo = "300";
var numero_de_preguntas = 1;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "1";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","pregunta":"Some companies just don’t","respuestas":[{"tipo":"texto","respuesta":"get across","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"get around","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"get down","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"1"},{"id_pregunta":"2","pregunta":"to analyzing how data is treated in the cloud or they don’t","respuestas":[{"tipo":"texto","respuesta":"get up","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"get across","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"get down to","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"1"},{"id_pregunta":"3","pregunta":"signing detailed contracts that ensure data protection.  They need to know that the rights of data access are guaranteed by the government data protection laws. That’s why the organizations should go","respuestas":[{"tipo":"texto","respuesta":"through","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"by","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"around","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"1"},{"id_pregunta":"4","pregunta":"the process of analyzing and understanding their rights thoroughly when working with a cloud provider. Therefore, It is crucial that companies","respuestas":[{"tipo":"texto","respuesta":"go","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"got","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"getting","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"1"},{"id_pregunta":"5","pregunta":"over the different considerations that","respuestas":[{"tipo":"texto","respuesta":"taken account","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"take into account","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"take into count","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","frase":"1"}],"frases_finales":[{"frase":"1","texto_final":"how data should be dealt with both by the business that’s hiring the service and the outsourcing company."}]}';
//FIN VARIABLES GENERALES

//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var preguntas_realizadas = new Array();
var mis_respuestas = new Array();
var frase_actual;
var intento_actual = 1;
var letras_a_encontrar;
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
    $('#btn_acciones').css('display', 'block');
    $('#cont_puntos').html("0");
    $('#btn_actividad_container').html('<button id="btn_acciones" onclick="responder_pregunta();" class="btn_actividad btn_enviar_morado">Submit</button>');
    frase_actual = 1;
    inicializa_iconos_preguntas();
    siguiente_pregunta();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/
function siguiente_pregunta() {
    var siguiente_pregunta = armar_la_frase(frase_actual);
    $('#la_frase').html(siguiente_pregunta);
    $('#btn_responder_pregunta').css('display', 'none');
    ocultar_mensaje_de_informacion();
}
function armar_la_frase(frase) {
    var html_frase = '';
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        if (parseInt(frase) === parseInt(preguntas_json.preguntas[i].frase)) {
            html_frase += '<span id="txt_pregunta_' + parseInt(preguntas_json.preguntas[i].id_pregunta) + '">' + preguntas_json.preguntas[i].pregunta + ' </span>';
            html_frase += armar_respuesta_pregunta(preguntas_json.preguntas[i]);
        }
    }
    html_frase += '<span class="pregunta_span">' + armar_final_de_frase(frase) + '</span>';
    return html_frase;
}
function armar_final_de_frase(frase) {
    frase_final = '';
    if (typeof preguntas_json.frases_finales === 'undefined' || preguntas_json.frases_finales === null) {
        return frase_final;
    }
    for (var o = 0; o < preguntas_json.frases_finales.length; o++) {
        if (parseInt(frase) === parseInt(preguntas_json.frases_finales[o].frase)) {
            frase_final = preguntas_json.frases_finales[o].texto_final;
        }
    }
    return frase_final;
}
function armar_respuesta_pregunta(pregunta) {
    pregunta.respuestas.mezclar_respuestas();
    var respuestas = '<span id="cont_respuesta_' + pregunta.id_pregunta + '">';
    respuestas += '<select id="respuesta_' + pregunta.id_pregunta + '">';
    respuestas += '<option value="">--</option>';
    for (var i = 0; i < pregunta.respuestas.length; i++) {
        respuestas += '<option value="' + pregunta.respuestas[i]['es_correcta'] + '">' + pregunta.respuestas[i]['respuesta'] + '</option>';
    }
    respuestas += '</select>';
    respuestas += '</span>';
    return respuestas;
}
function responder_pregunta() {
    var error_color = '#a01e2b';
    var correct_color = '#004c5e';
    var falta_responder_selects = false;
    for (var i = 1; i <= preguntas_json.preguntas[frase_actual - 1].respuestas.length; i++) {
        if ($('#respuesta_' + i).val() === '') {
            $('#respuesta_' + i).css('background-color', error_color);
            falta_responder_selects = true;
        } else {
            $('#respuesta_' + i).css('background-color', correct_color);
        }
    }
    if (falta_responder_selects) {
        return false;
    } else {
        validar_la_frase();
    }
}
function validar_la_frase() {
    var todas_las_respuestas_de_la_frase_son_correctas = true;
    var mis_respuestas_detalladas = new Array();
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        if (parseInt(frase_actual) === parseInt(preguntas_json.preguntas[i].frase)) {
            if (!validar_respuestas_pregunta_frase(mis_respuestas_detalladas, preguntas_json.preguntas[i])) {
                todas_las_respuestas_de_la_frase_son_correctas = false;
            }
        }
    }
    mis_respuestas.push(mis_respuestas_detalladas);
    if (todas_las_respuestas_de_la_frase_son_correctas) {
        activar_estrella(frase_actual, 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    } else {
        activar_estrella(frase_actual, 'fallo');
    }
    if (frase_actual === numero_de_preguntas) {
        activar_contenedor('cont_resultados');
        parar_cuenta_regresiva();
        armar_resultados();
    } else {
        frase_actual++;
        siguiente_pregunta();
    }
}
function validar_respuestas_pregunta_frase(mis_respuestas_detalladas, pregunta) {
    for (var i = 0; i < pregunta.respuestas.length; i++) {
        if ($('#respuesta_' + pregunta.id_pregunta + ' :selected').text() === pregunta.respuestas[i].respuesta) {
            pregunta.respuestas[i].seleccionada = 'si';
            mis_respuestas_detalladas.push(pregunta.pregunta + ' ' + $('#respuesta_' + pregunta.id_pregunta + ' :selected').text());
            if ($('#respuesta_' + pregunta.id_pregunta).val() === 'si') {
                return true;
            } else {
                return false;
            }
        }
    }
}
function calcular_resultados() {
    var resultados = '';
    var tu_respuesta = '';
    var respuesta_correcta = '';
    var class_respuesta;
    var imagen_respuesta;
    if (preguntas_realizadas.length > 0) {
        for (var i = 0; i < preguntas_realizadas.length; i++) {
            resultados += '<div class="cont_pregunta">';
            resultados += '<p class="numero_pregunta">Question ' + (i + 1) + '</p>';
            var frase_final = ' ' + armar_final_de_frase(i + 1);
            tu_respuesta = armar_mi_respuesta(i) + frase_final;
            respuesta_correcta = armar_respuesta_correcta(i + 1) + frase_final;
            if (preguntas_realizadas[i].correcta === 'si') {
                class_respuesta = 'txt_respuesta_correcta';
                imagen_respuesta = 'estrella_exito.png';
            } else {
                class_respuesta = 'txt_respuesta_incorrecta';
                imagen_respuesta = 'estrella_fallo.png';
            }
            resultados += '<p class="subtitulo_respuesta_txt">Your answer:&nbsp;&nbsp;<span class="' + class_respuesta + '">' + tu_respuesta + '</span></p>';
            resultados += '<p class="subtitulo_respuesta_txt">Correct answer:&nbsp;&nbsp;<span>' + respuesta_correcta + '</span></p>';
            if (preguntas_realizadas[i].justificacion !== '') {
                resultados += '<p class="subtitulo_respuesta_txt">Justification: <span class="justificacion">' + preguntas_realizadas[i].justificacion + '</span></p>';
            }
            resultados += '<img src="../assets/img/' + imagen_respuesta + '" alt="Imagen"/>';
            resultados += '</div>';
        }
    } else {
        resultados = '<div style="font-size:xx-large;text-align:center;"><span id="cantidad_intentos_restantes">The time is over and there are no more attempts.</span></div>';
    }
    return resultados;
}
function armar_mi_respuesta(posicion) {
    var tu_respuesta = '';
    for (var j = 0; j < mis_respuestas[posicion].length; j++) {
        tu_respuesta += mis_respuestas[posicion][j] + ' ';
    }
    return tu_respuesta;
}
function armar_respuesta_correcta(frase) {
    var respuesta_correcta = '';
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        if (parseInt(frase) === parseInt(preguntas_json.preguntas[i].frase)) {
            respuesta_correcta += preguntas_json.preguntas[i].pregunta + ' ';
            for (var j = 0; j < preguntas_json.preguntas[i].respuestas.length; j++) {
                if (preguntas_json.preguntas[i].respuestas[j].es_correcta === 'si') {
                    respuesta_correcta += preguntas_json.preguntas[i].respuestas[j].respuesta + ' ';
                }
            }
        }
    }
    return respuesta_correcta;
}
/*FIN FUNCIONES PUNTUALES ACTIVIDAD*/

/*DE ACA EN ADELANTE ESTAN LAS FUNCIONES GENERICAS*/
function mostrar_mensaje_de_informacion(mensaje_a_mostrar) {
    $('#cont_mensaje_interno_txt').html(mensaje_a_mostrar);
    $('#ahogado_actividad').css('display', 'none');
    $('#cont_mensaje_interno').fadeIn(1500);
}
function ocultar_mensaje_de_informacion() {
    $('#ahogado_actividad').css('display', 'block');
    $('#cont_mensaje_interno').css('display', 'none');
}
function reintentar() {
    preguntas_realizadas = new Array();
    mis_respuestas = new Array();
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
        preguntas_json.preguntas[frase_actual - 1].correcta = 'si';
    }
    preguntas_realizadas.push(preguntas_json.preguntas[frase_actual - 1]);
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
Array.prototype.mezclar_respuestas = function () {
    var m = this.length - 1;
    for (var i = m; i > 1; i--) {
        var alea = Math.floor(i * Math.random());
        var temp = this[i];
        this[i] = this[alea];
        this[alea] = temp;
    }
};

$(window).load(setTimeout(inicializar_reglas_actividad(), 1000));