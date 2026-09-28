//INICIO VARIABLES GENERALES
var descripcion = "Put your knowledge to the test so you can win!";
var control_de_tiempo = "0";
var numero_de_preguntas = 6;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "6";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","pregunta":"Since their creation, cloud computing services _______________ to work with a disaster recovery system.","respuestas":[{"tipo":"texto","respuesta":"have supposed","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"have been supposed","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"has been supposed","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"hasn’t been supposed","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"2","pregunta":"The security system is supposed to be robust. Remember that vendors ________________to keep information technology, but personnel information as well.","respuestas":[{"tipo":"texto","respuesta":"isn \\\'t just supposed","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"just aren \\\'t supposed","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"aren \\\'t supposed just","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"aren \\\'t just supposed","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"3","pregunta":"Cloud computing isn \\\'t _____________only data storage but also services involving legal and regulatory requirements of clients.","respuestas":[{"tipo":"texto","respuesta":"suppose to provide","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"supposed to provide","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"expect to provide","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"suppose to give","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no","seleccionada":"no"},{"id_pregunta":"4","pregunta":"Since vendors can focus on using their resources proficiently, savings aren \\\'t supposed ________________without economies of scale.","respuestas":[{"tipo":"texto","respuesta":"to achieve","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"to be achieve","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"to be achieved","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"be achieved","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"5","pregunta":"That is why goods and services ________________on a larger scale with less input costs. Therefore, if a company grows, it will have more chances to decrease its costs.","respuestas":[{"tipo":"texto","respuesta":"are supposed to be produced","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"is supposed to be produce","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"suppose to be produce","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"are supposed to produced","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"6","pregunta":"The service offered by the cloud computing ______________ then with a dual purpose; functioning service and disaster recovery service.","respuestas":[{"tipo":"texto","respuesta":"have been thought","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"is being thought","es_correcta":"no","seleccionada":"no"},{"tipo":"texto","respuesta":"has been thought.","es_correcta":"si","seleccionada":"no"},{"tipo":"texto","respuesta":"has been a thought","es_correcta":"no","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"}]}';
//FI//FIN VARIABLES GENERALES;
//
//INICIO VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var preguntas_realizadas = new Array();
var pregunta_actual;
var intento_actual = 1;
var letras_a_encontrar;
//FIN VARIABLES DE LA ACTIVIDAD;

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

/*INICIO FUNCIONES GENERICAS*/
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
                msg_intentos = "You have " + (numero_de_intentos - intento_actual) + " attempts left";
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
        resultados = '<div style="font-size:xx-large;text-align:center;"><span id="cantidad_intentos_restantes">The time is over and there are no more attempts.</span></div>';
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

if (navigator.userAgent.match("Chrome")) {
} else {
    $('#gray_line_pregunta_right')
            .css("position", "relative")
            .css("float", "right")
            .css("margin-top", "2.5%");
    $('.respuesta_txt_quien_qui_ser_mil')
            .css("font-size", "11px");
    $('.res_quien_qui_ser_mil')
            .css("height", "70px");
    $('.res_quien_qui_ser_mil_selected')
            .css("height", "70px");
    $('.res_quien_qui_ser_mil_error')
            .css("height", "70px");
    $('.gray_line')
            .css("margin-top", "38px");
    $('.circle_line')
            .css("margin-top", "33px");
}
var preguntas_json_original = eval("(" + preguntas_txt + ")");
/*INICIO FUNCIONES PUNTUALES ACTIVIDAD*/

$.preloadImages = function () {
    for (var i = 0; i < arguments.length; i++) {
        $("<img />").attr("src", arguments[i]);
    }
};

$.preloadImages("assets/img/respuesta.png", "assets/img/respuesta_seleccionada.png", "assets/img/respuesta_incorrecta.png");

function inicializar_actividad() {
    preguntas_json = JSON.parse(JSON.stringify(preguntas_json_original));
    $('#cont_puntos').html("0");
    pregunta_actual = 1;
    inicializa_iconos_preguntas();
    inicializar_tablero();
    siguiente_pregunta();
    activar_contenedor('cont_actividad');
    activar_cronometro();
}

function inicializar_tablero() {
    $('#btn_actividad_container').html('<button style="display: none;" onclick="responder_pregunta();" class="btn_actividad btn_enviar_morado">Submit</button>');
    $('#res1_quien_qui_ser_mil').click(function () {
        activar_background_pregunta(1);
    });
    $('#res2_quien_qui_ser_mil').click(function () {
        activar_background_pregunta(2);
    });
    $('#res3_quien_qui_ser_mil').click(function () {
        activar_background_pregunta(3);
    });
    $('#res4_quien_qui_ser_mil').click(function () {
        activar_background_pregunta(4);
    });
    $('#btn_cincuenta_cincuenta').css('cursor', 'pointer');
    $('#btn_cincuenta_cincuenta').attr('src', 'assets/img/cincuenta_cincuenta.png');
    $('#btn_cincuenta_cincuenta').click(function () {
        this.src = "assets/img/cincuenta_cincuenta_seleccionada.png";
        $(this).prop('onclick', null).off('click');
        $(this).css('cursor', 'default');
        quitar_dos_falsas();
    });
    $('#btn_ayuda_publico').css('cursor', 'pointer');
    $('#btn_ayuda_publico').attr('src', 'assets/img/publico.png');
    $('#btn_ayuda_publico').click(function () {
        this.src = "assets/img/publico_seleccionada.png";
        $(this).prop('onclick', null).off('click');
        $(this).css('cursor', 'default');
        var alea = Math.floor((Math.random() * 4) + 1);
        $('#imagen_ayuda').attr('src', 'assets/img/resultado_publico_' + alea + '.png');
        mostrar_modal('modalAyudaPublico');
    });
    $('#btn_cambiar_pregunta').css('cursor', 'pointer');
    $('#btn_cambiar_pregunta').attr('src', 'assets/img/cambio_pregunta.png');
    $('#btn_cambiar_pregunta').click(function () {
        this.src = "assets/img/cambio_pregunta_seleecionada.png";
        $(this).prop('onclick', null).off('click');
        $(this).css('cursor', 'default');
        cambiar_pregunta();
    });
}
function volver_visibles_las_preguntas() {
    for (var i = 1; i <= 4; i++) {
        $('#res' + i + '_quien_qui_ser_mil').css('visibility', 'visible');
    }
}
function quitar_dos_falsas() {
    var cantidad_escondida = 0;
    for (var i = 1; i <= 4; i++) {
        if (cantidad_escondida < 2 && $('#es_correcta_' + i).val() === 'no') {
            $('#res' + i + '_quien_qui_ser_mil').css('visibility', 'hidden');
            cantidad_escondida++;
        }
    }
}
function cambiar_pregunta() {
    volver_visibles_las_preguntas();
    preguntas_json.preguntas[5].respuestas.mezclar_respuestas();
    preguntas_json.preguntas[pregunta_actual - 1] = preguntas_json.preguntas[5];
    $('#siguiente_pregunta').html(preguntas_json.preguntas[pregunta_actual - 1].pregunta);
    $('#respuesta_1').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta);
    $('#respuesta_1_selected').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta);
    $('#respuesta_1_error').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta);
    $('#es_correcta_1').val(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].es_correcta);
    $('#respuesta_2').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[1].respuesta);
    $('#respuesta_2_selected').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[1].respuesta);
    $('#respuesta_2_error').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[1].respuesta);
    $('#es_correcta_2').val(preguntas_json.preguntas[pregunta_actual - 1].respuestas[1].es_correcta);
    $('#respuesta_3').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[2].respuesta);
    $('#respuesta_3_selected').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[2].respuesta);
    $('#respuesta_3_error').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[2].respuesta);
    $('#es_correcta_3').val(preguntas_json.preguntas[pregunta_actual - 1].respuestas[2].es_correcta);
    $('#respuesta_4').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[3].respuesta);
    $('#respuesta_4_selected').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[3].respuesta);
    $('#respuesta_4_error').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[3].respuesta);
    $('#es_correcta_4').val(preguntas_json.preguntas[pregunta_actual - 1].respuestas[3].es_correcta);
}
function activar_background_pregunta(id_pregunta) {
    $('#btn_actividad_container button').css('display', 'block');
    for (var i = 1; i <= 4; i++) {
        if (id_pregunta === i) {
            $('#h_respuesta_' + i).val('1');
            $('#respuesta_' + i).css('font-weight', 'bold');
            $('#respuesta_' + i + "_selected").css('font-weight', 'bold');
            $('#res' + i + '_quien_qui_ser_mil').css('display', 'none');
            $('#res' + i + '_quien_qui_ser_mil_selected').css('display', 'block');
        } else {
            $('#h_respuesta_' + i).val('0');
            $('#respuesta_' + i).css('font-weight', 'normal');
            $('#res' + i + '_quien_qui_ser_mil').css('display', 'block');
            $('#res' + i + '_quien_qui_ser_mil_selected').css('display', 'none');
        }
    }
}
function activar_pregunta_incorrecta() {
    for (var i = 1; i <= 4; i++) {
        if ($('#h_respuesta_' + i).val() === '1' && $('#es_correcta_' + i).val() === 'no') {
            $('#res' + i + '_quien_qui_ser_mil').css('display', 'none');
            $('#res' + i + '_quien_qui_ser_mil_selected').css('display', 'none');
            $('#res' + i + '_quien_qui_ser_mil_error').css('display', 'block');
        }
    }
}
function siguiente_pregunta() {
    volver_visibles_las_preguntas();
    for (var i = 1; i <= 4; i++) {
        $('#respuesta_' + i).css('font-weight', 'normal');
        $('#res' + i + '_quien_qui_ser_mil').css('display', 'block');
        $('#res' + i + '_quien_qui_ser_mil_selected').css('display', 'none');
        $('#res' + i + '_quien_qui_ser_mil_error').css('display', 'none');
    }
    preguntas_json.preguntas[pregunta_actual - 1].respuestas.mezclar_respuestas();
    $('#siguiente_pregunta').html(preguntas_json.preguntas[pregunta_actual - 1].pregunta);
    $('#respuesta_1').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta);
    $('#respuesta_1_selected').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta);
    $('#respuesta_1_error').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta);
    $('#es_correcta_1').val(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].es_correcta);
    $('#respuesta_2').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[1].respuesta);
    $('#respuesta_2_selected').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[1].respuesta);
    $('#respuesta_2_error').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[1].respuesta);
    $('#es_correcta_2').val(preguntas_json.preguntas[pregunta_actual - 1].respuestas[1].es_correcta);
    $('#respuesta_3').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[2].respuesta);
    $('#respuesta_3_selected').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[2].respuesta);
    $('#respuesta_3_error').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[2].respuesta);
    $('#es_correcta_3').val(preguntas_json.preguntas[pregunta_actual - 1].respuestas[2].es_correcta);
    $('#respuesta_4').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[3].respuesta);
    $('#respuesta_4_selected').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[3].respuesta);
    $('#respuesta_4_error').html(preguntas_json.preguntas[pregunta_actual - 1].respuestas[3].respuesta);
    $('#es_correcta_4').val(preguntas_json.preguntas[pregunta_actual - 1].respuestas[3].es_correcta);
    $('#btn_actividad_container button').css('display', 'none');
}
function asignar_rank_puntos() {
    var cambiar_anterior = false;
    for (var i = 1; i <= 5; i++) {
        if (i === pregunta_actual) {
            $('#puntos_' + i).attr('id', 'punt_total_quien_qui_ser_mil');
        } else {
            if (!cambiar_anterior) {
                $('#punt_total_quien_qui_ser_mil').attr('id', 'puntos_' + i);
                cambiar_anterior = true;
            }
        }
    }
}
function responder_pregunta() {
    if (pregunta_actual !== 1) {
        asignar_rank_puntos();
    }
    //mostrar_modal('modalPuntosActuales');
    for (var i = 1; i <= 4; i++) {
        if ($('#h_respuesta_' + i).val() === '1') {
            if ($('#es_correcta_' + i).val() === 'si') {
                preguntas_json.preguntas[pregunta_actual - 1].correcta = 'si';
                activar_estrella(pregunta_actual, 'exito');
                puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
                $('#cont_puntos').html(parseInt(puntaje_actual));
            } else {
                activar_pregunta_incorrecta();
                preguntas_json.preguntas[pregunta_actual - 1].correcta = 'no';
                activar_estrella(pregunta_actual, 'fallo');
            }
            preguntas_json.preguntas[pregunta_actual - 1].respuestas[(i - 1)].seleccionada = 'si';
        }
    }
    if (pregunta_actual === numero_de_preguntas) {
        activar_contenedor('cont_resultados');
        parar_cuenta_regresiva();
        armar_resultados();
    } else {
        pregunta_actual++;
        setTimeout(function () {
            siguiente_pregunta();
        }, 500);
    }
}
/*FIN FUNCIONES PUNTUALES ACTIVIDAD*/
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