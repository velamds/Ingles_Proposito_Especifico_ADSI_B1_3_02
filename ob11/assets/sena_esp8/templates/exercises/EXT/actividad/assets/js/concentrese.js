//INICIO VARIABLES GENERALES
var descripcion = "Challenge your memory and put your knowledge to the test.";
var control_de_tiempo = "180";
var numero_de_preguntas = 6;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "6";
var preguntas_txt = '{"tiempo_mostrar_cartas":"2","tablero_size":"4x3","preguntas":[{"id_pregunta":"1","pregunta":"When there is an indemnity, the customer ________________ the indemnity against the costs or damages associated with the claim.","imagen_carta":"assets/img/enpe8n7le02ob11re4ac06img01.jpg","respuestas":[{"tipo":"texto","respuesta":"will not receive ","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"will receive","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"is going to receive","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"2","pregunta":"It is possible that the customer _________________ to terminate the license.","imagen_carta":"assets/img/enpe8n7le02ob11re4ac06img02.jpg","respuestas":[{"tipo":"texto","respuesta":"will be able ","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"will not be able","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"not will be able","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"3","pregunta":"When the customer is not able to terminate the license, the work of the customer has not infringed the license, and the IT provider ___________________ to keep the contract with them.","imagen_carta":"assets/img/enpe8n7le02ob11re4ac06img03.jpg","respuestas":[{"tipo":"texto","respuesta":"will not be able ","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"not will be able","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"will be able","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","seleccionada":"no"},{"id_pregunta":"4","pregunta":"In some cases, neither the IT provider ___________________ to return the paid fees or accept a cancellation.","imagen_carta":"assets/img/enpe8n7le02ob11re4ac06img04.jpg","respuestas":[{"tipo":"texto","respuesta":"will be obliged ","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"will oblige","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"will not be obliged","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","seleccionada":"no"},{"id_pregunta":"5","pregunta":"If customers are asked to uninstall software within a short period of time, they __________________ the impact of that on their companies.","imagen_carta":"assets/img/enpe8n7le02ob11re4ac06img05.jpg","respuestas":[{"tipo":"texto","respuesta":"will have to consider ","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"will be have to consider","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"will consider","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","seleccionada":"no"},{"id_pregunta":"6","pregunta":"Most of the times, customers ________________ against the cost or damages caused.","imagen_carta":"assets/img/enpe8n7le02ob11re4ac06img06.jpg","respuestas":[{"tipo":"texto","respuesta":"will indemnify","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"will not be indemnify","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"will be indemnified","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","seleccionada":"no"}]}';

//VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var preguntas_realizadas = new Array();
var pregunta_actual;
var intento_actual = 1;
var pareja_actual;
var primera_carta_seleccionada;
var segunda_carta_seleccionada;
var preguntas_json_original = eval("(" + preguntas_txt + ")");

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

/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/
function inicializar_actividad() {
    preguntas_json = JSON.parse(JSON.stringify(preguntas_json_original));
    $('#btn_actividad_container').css('display', 'none');
    $('#cont_puntos').html("0");
    pregunta_actual = 1;
    inicializa_iconos_preguntas();
    preguntas_json.preguntas.mezclar_preguntas();
    armar_tablero();
    siguiente_pregunta();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

function armar_tablero() {
    $("#pantalla_invisible").css('display', 'block');
    var el_tablero = '<div class="actividad_concentrese_3x2">';
    var columnas = 2;
    var filas = 3;
    var escondidos = 3;
    if (preguntas_json.tablero_size === '4x3') {
        el_tablero = '<div class="actividad_concentrese_4x3">';
        columnas = 3;
        filas = 4;
        escondidos = 6;
    }
    var hiddens = new Array();
    for (var i = 0; i < escondidos; i++) {
        hiddens.push(preguntas_json.preguntas[i].id_pregunta);
        hiddens.push(preguntas_json.preguntas[i].id_pregunta);
    }
    hiddens.mezclar_preguntas();
    var k = 1;
    for (var i = 1; i <= columnas; i++) {
        el_tablero += '<div class="conc_fila_' + i + '">';
        for (var j = 1; j <= filas; j++) {
            el_tablero += '<div id="carta_' + k + '" class="conc_imagen_' + j + '">';
            el_tablero += '<div style="display:none;" class="front">';
            el_tablero += '<img src="assets/img/sena_img.png" alt="Imagen"/>';
            el_tablero += '</div>';
            el_tablero += '<div style="display:block;" class="back">';
            el_tablero += '<img src="' + buscar_imagen_pregunta(hiddens[(k - 1)]) + '" alt="Imagen"/>';
            el_tablero += '</div>';
            el_tablero += '<input type="hidden" value="' + hiddens[(k - 1)] + '" id="h_carta_' + k + '">';
            el_tablero += '<input type="hidden" value="0" id="h_status_carta_' + k + '">';
            el_tablero += '</div>';
            k++;
        }
        el_tablero += '</div>';
    }
    $('.contenedor_actividad').html(el_tablero);
    k = 1;
    for (var i = 1; i <= columnas; i++) {
        for (var j = 1; j <= filas; j++) {
            $("#carta_" + k).click(function () {
                voltear_carta($(this).attr('id'));
            });
            k++;
        }
    }
    setTimeout(ocultar_cartas, (preguntas_json.tiempo_mostrar_cartas * 1000));
}

function buscar_imagen_pregunta(id_pregunta) {
    for (var i = 0; i < preguntas_json.preguntas.length; i++) {
        if (parseInt(preguntas_json.preguntas[i].id_pregunta) === parseInt(id_pregunta)) {
            return preguntas_json.preguntas[i].imagen_carta;
        }
    }
    return "assets/img/a.png";
}

function ocultar_cartas() {
    $('.back').css('display', 'none');
    $('.front').fadeIn(1000);
    $("#pantalla_invisible").css('display', 'none');
}

function ocultar_carta(id_carta) {
    setTimeout(
            function ()
            {
                $('#' + id_carta).rotarCarta(360, 500, 'easeOutQuart');
                $('#' + id_carta + ' .front').css('display', 'block');
                $('#' + id_carta + ' .back').css('display', 'none');
            }, 1000);
    $('#h_status_' + id_carta).val('0');
}

function voltear_carta(id_carta) {
    $('#' + id_carta).rotarCarta(360, 500, 'linear');
    if ($('#h_status_' + id_carta).val() === '0') {
        $('#' + id_carta + ' .front').css('display', 'none');
        $('#' + id_carta + ' .back').css('display', 'block');
        $('#h_status_' + id_carta).val('1');
        if (typeof pareja_actual !== 'undefined' && pareja_actual !== null && pareja_actual !== '') {
            segunda_carta_seleccionada = id_carta;
            if (pareja_actual === $('#h_' + segunda_carta_seleccionada).val()) {
                $('#' + primera_carta_seleccionada).prop('onclick', null).off('click');
                $('#' + segunda_carta_seleccionada).prop('onclick', null).off('click');
                mostrar_modal('modalPregunta');
            } else {
                ocultar_carta(primera_carta_seleccionada);
                ocultar_carta(segunda_carta_seleccionada);
                pareja_actual = null;
                primera_carta_seleccionada = null;
                segunda_carta_seleccionada = null;
            }
        } else {
            pareja_actual = $('#h_' + id_carta).val();
            primera_carta_seleccionada = id_carta;
        }
    } else {
        $('#' + id_carta + ' .front').css('display', 'block');
        $('#' + id_carta + ' .back').css('display', 'none');
        $('#h_status_' + id_carta).val('0');
        pareja_actual = null;
        primera_carta_seleccionada = null;
        segunda_carta_seleccionada = null;
    }
}

$.fn.rotarCarta = function (angle, duration, easing, complete) {
    return this.each(function () {
        var $elem = $(this);
        $({deg: 0}).animate({deg: angle}, {
            duration: duration,
            easing: easing,
            step: function (now) {
                $elem.css({
                    transform: 'rotateY(' + now + 'deg)'
                });
            },
            complete: complete || $.noop
        });
    });
};

$.preloadImages = function () {
    for (var i = 0; i < arguments.length; i++) {
        $("<img />").attr("src", arguments[i]);
    }
};

$.preloadImages("assets/img/sena_img.png");

function siguiente_pregunta() {
	$('#actividad_pista').html('');
    pareja_actual = null;
    primera_carta_seleccionada = null;
    segunda_carta_seleccionada = null;
    var siguiente_pregunta = preguntas_json.preguntas[pregunta_actual - 1].pregunta;
    if (preguntas_json.preguntas[pregunta_actual - 1].pista !== '') {
        siguiente_pregunta += '<img onclick="interactuar_con_pista(' + pregunta_actual + ');" id="trigger_pista_' + pregunta_actual + '" class="pista_pregunta" alt="Pista" src="../assets/img/pista_ico.png">';
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
    ocultar_mensaje_de_informacion();
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
    // $('#modalPregunta').css('display', 'none');
    $('#modalPregunta').modal('hide');
    if (preguntas_json.preguntas[pregunta_actual - 1].respuestas[($('#respuesta_seleccionada').val())].es_correcta === 'si') {
        preguntas_json.preguntas[pregunta_actual - 1].correcta = 'si';
        activar_estrella(pregunta_actual, 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
        $('#' + primera_carta_seleccionada).css('background-color', '#fccd1e');
        $('#' + segunda_carta_seleccionada).css('background-color', '#fccd1e');
    } else {
        preguntas_json.preguntas[pregunta_actual - 1].correcta = 'no';
        activar_estrella(pregunta_actual, 'fallo');
        $('#' + primera_carta_seleccionada).css('background-color', '#70706e');
        $('#' + segunda_carta_seleccionada).css('background-color', '#70706e');
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

function ocultar_popup_pregunta() {
    $('#modalPregunta').fadeOut('slow');
    $('#popup_overlay').fadeOut('slow');
    return false;
}

function armar_resultados() {
    ocultar_popup_pregunta();
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
                msg_intentos = "You have" + (numero_de_intentos - intento_actual) + " attempts left.";
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
