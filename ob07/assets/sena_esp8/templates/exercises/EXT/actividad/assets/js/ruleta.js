//INICIO VARIABLES GENERALES
var descripcion = "Click on the wheel and answer the question to win";
var control_de_tiempo = "180";
var numero_de_preguntas = 4;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "5";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","pregunta":"What are the goals that ought to be achieved by negotiating software licenses?","respuestas":[{"tipo":"texto","respuesta":"Liability ought to be reduced and testing rights need to be considered.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"Software performance","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"Cover the software requirements","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"Check the software performance","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"That ought to be achieved…","correcta":"no"},{"id_pregunta":"2","pregunta":"What ought to be considered cautiously when negotiating software licenses?","respuestas":[{"tipo":"texto","respuesta":"The goals need to be considered.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"The testing rights need to be considered.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"The software needs.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"The software requirements.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"considerations","correcta":"no"},{"id_pregunta":"3","pregunta":"What ought to be addressed when negotiating software licenses?","respuestas":[{"tipo":"texto","respuesta":"The liability ought to be addressed.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"The risks need to be addressed.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"The software performance ought to be addressed.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"the termination rights have to be addressed.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"to be addressed…","correcta":"no"},{"id_pregunta":"4","pregunta":"What ought to be expanded to cover the software needs?","respuestas":[{"tipo":"texto","respuesta":"The goals.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"The software needs.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"The liability.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"The scope of the license.","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"the s...","correcta":"no"},{"id_pregunta":"5","pregunta":"What ought to be studied when negotiation software licenses?","respuestas":[{"tipo":"texto","respuesta":"The license.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"The termination rights.","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"The risks associated to data breach.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"The goals achieved.","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"Situations that may cause negative consequences.","correcta":"no"}]}';
//FIN VARIABLES GENERALES
//INICIO VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var preguntas_realizadas = new Array();
var pregunta_actual;
var intento_actual = 1;
var letras_a_encontrar;
//FIN VARIABLES DE LA ACTIVIDAD
/*INICIO FUNCIONES GENERICAS*/

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

function ocultar_mensaje_de_informacion() {
    $('#ahogado_actividad').css('display', 'block');
    $('#cont_mensaje_interno').css('display', 'none');
}
function mostrar_mensaje_de_informacion(mensaje_de_informacion) {
    $('#cont_mensaje_interno_txt').html(mensaje_de_informacion);
    $('#ahogado_actividad').css('display', 'none');
    $('#cont_mensaje_interno').fadeIn(1500);
}
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
        $('#pantalla_invisible').css('display', 'block');
        setTimeout(mostrar_contenedor_resultados, 2000);
    } else {
        console.log('ERROR GARRAFAL. NO LLEGO TIPO DE CONTENEDOR. CONTACTE AL PROVEEDOR DEL SOFTWARE.');
        return false;
    }
}
function mostrar_contenedor_resultados() {
    $('#cont_actividad').fadeOut(1000);
    $('#inicio_actividad').fadeOut(1000);
    $('#cont_resultados').fadeIn(1000);
    $('#pantalla_invisible').css('display', 'none');
    ocultar_popup_pregunta();
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
    var respuesta_correcta;
    var class_respuesta;
    var imagen_respuesta;
    if (preguntas_realizadas.length > 0) {
        for (var i = 0; i < preguntas_realizadas.length; i++) {
            resultados += '<div class="cont_pregunta">';
            resultados += '<p class="numero_pregunta">' + preguntas_realizadas[i].pregunta + '</p>';
            for (var j = 0; j < preguntas_realizadas[i].respuestas.length; j++) {
                if (preguntas_realizadas[i].respuestas[j].seleccionada === 'si') {
                    tu_respuesta = preguntas_realizadas[i].respuestas[j].respuesta;
                }
                if (preguntas_realizadas[i].respuestas[j].es_correcta === 'si') {
                    respuesta_correcta = preguntas_realizadas[i].respuestas[j].respuesta;
                }
            }
            if (preguntas_realizadas[i].correcta === 'si') {
                class_respuesta = 'txt_respuesta_correcta';
                imagen_respuesta = 'estrella_exito.png';
            } else {
                class_respuesta = 'txt_respuesta_incorrecta';
                imagen_respuesta = 'estrella_fallo.png';
            }
            resultados += '<p class="subtitulo_respuesta_txt">You answer:&nbsp;&nbsp;<span class="' + class_respuesta + '">' + tu_respuesta + '</span></p>';
            resultados += '<p class="subtitulo_respuesta_txt">Correct answer:&nbsp;&nbsp;<span>' + respuesta_correcta + '</span></p>';
            if (preguntas_realizadas[i].justificacion !== '') {
                resultados += '<p class="subtitulo_respuesta_txt">Justification: <span class="justificacion">' + preguntas_realizadas[i].justificacion + '</span></p>';
            }
            resultados += '<img src="../assets/img/' + imagen_respuesta + '" alt="Imagen"/>';
            resultados += '</div>';
        }
    } else {
        resultados = '<div style="font-size:xx-large;text-align:center;"><span id="cantidad_intentos_restantes">The time is over and there ara no more attempts.</span></div>';
    }
    return resultados;
}
function perdio_por_tiempo() {
    activar_contenedor('cont_resultados');
    armar_resultados();
}
function mostrar_popup_pregunta() {
    $('#modalPregunta').css('display', 'block');
    $('#popup_overlay').fadeIn('slow');
    return false;
}

function ocultar_popup_pregunta() {
    $('#modalPregunta').css('display', 'none');
    $('#popup_overlay').fadeOut('slow');
    return false;
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
var preguntas_json_original = eval("(" + preguntas_txt + ")");
/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/
function inicializar_actividad() {
    preguntas_json = JSON.parse(JSON.stringify(preguntas_json_original));
    $('#cont_puntos').html("0");
    pregunta_actual = 1;
    inicializa_iconos_preguntas();
    preguntas_json.preguntas.mezclar_preguntas();
    siguiente_pregunta();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}
function siguiente_pregunta() {
    var siguiente_pregunta = preguntas_json.preguntas[pregunta_actual - 1].pregunta;
    if (preguntas_json.preguntas[pregunta_actual - 1].pista !== '') {
        siguiente_pregunta += ' <img onclick="interactuar_con_pista(' + pregunta_actual + '); " id="trigger_pista_' + pregunta_actual + '" class="pista_pregunta" alt="Pista" src="../assets/img/pista_ico.png"/>';
        $('#actividad_pista').html('<p class="pista" id="pista_' + pregunta_actual + '" style="display: none;" >' + preguntas_json.preguntas[pregunta_actual - 1].pista + '</p>');
    }
    preguntas_json.preguntas[pregunta_actual - 1].respuestas.mezclar_respuestas();
    var html_preguntas = '';
    for (var i = 0; i < preguntas_json.preguntas[pregunta_actual - 1].respuestas.length; i++) {
        html_preguntas += '<div onclick="activar_respuesta_popup(' + i + ');"><div class="radio_button_pregunta" id="pregunta_radio_' + i + '"></div><div class="option_pregunta" id="pregunta_txt_' + i + '">' + preguntas_json.preguntas[pregunta_actual - 1].respuestas[i].respuesta + '</div></div>';
    }
    $('#cont_preguntas_actividad').html(html_preguntas);
    $('#titulo_txt_pregunta').html(siguiente_pregunta);
    $('#respuesta_seleccionada').val('-1');
    $('#btn_responder_pregunta').css('display', 'none');
}
function activar_respuesta_popup(id_popup) {
    for (var i = 0; i < preguntas_json.preguntas[pregunta_actual - 1].respuestas.length; i++) {
        if (i === id_popup) {
            $('#pregunta_radio_' + i).html('<div class="active_radio_center_pregunta"></div>');
        } else {
            $('#pregunta_radio_' + i).html('');
        }
    }
    $('#respuesta_seleccionada').val(id_popup);
    $('#btn_responder_pregunta').css('display', 'block');
}
function responder_pregunta() {
    ocultar_popup_pregunta();
    if (preguntas_json.preguntas[pregunta_actual - 1].respuestas[($('#respuesta_seleccionada').val())].es_correcta === 'si') {
        preguntas_json.preguntas[pregunta_actual - 1].correcta = 'si';
        activar_estrella(pregunta_actual, 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
    } else {
        preguntas_json.preguntas[pregunta_actual - 1].correcta = 'no';
        activar_estrella(pregunta_actual, 'fallo');
    }
    preguntas_json.preguntas[pregunta_actual - 1].respuestas[($('#respuesta_seleccionada').val())].seleccionada = 'si';
    if (pregunta_actual === numero_de_preguntas) {
        activar_contenedor('cont_resultados');
        parar_cuenta_regresiva();
        armar_resultados();
    } else {
        pregunta_actual++;
        siguiente_pregunta();
    }
}
/*FIN FUNCIONES PUNTUALES ACTIVIDAD*/
$("#btn_ruleta").rotate({
    bind: {
        click: function () {
            var randomnumber = Math.floor(Math.random(1) * 1000000);
            $("#ruleta").rotate({
                duration: 1000,
                animateTo: randomnumber,
                easing: $.easing.easeOutQuart,
                callback: function () {
                    mostrar_popup_pregunta();
                }
            });
        }
    }
});
$(window).load(setTimeout(inicializar_reglas_actividad(), 1000));