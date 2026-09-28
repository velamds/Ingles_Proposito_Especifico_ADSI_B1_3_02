//INICIO VARIABLES GENERALES
var descripcion = "Find the hidden word without falling into the water!";
var control_de_tiempo = "180";
var numero_de_preguntas = 3;
var numero_de_intentos = 2;
var puntaje = "1";
var puntaje_actual = "0";
var exito_puntaje = "3";
var preguntas_txt = '{"preguntas":[{"id_pregunta":"1","pregunta":"Something you need to negotiate as clear as possible to avoid a loss.","respuestas":[{"tipo":"texto","respuesta":"warrantly","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"2","pregunta":"A written deal. You need to ask for it when you will get the software.","respuestas":[{"tipo":"texto","respuesta":"contract","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"},{"id_pregunta":"3","pregunta":"When a service is as good as possible to satisfy the client’ needs.","respuestas":[{"tipo":"texto","respuesta":"workmanlike","es_correcta":"si","seleccionada":"no"}],"justificacion":"","pista":"","correcta":"no"}]}';
//FIN VARIABLES GENERALES
//INICIO VARIABLES DE LA ACTIVIDAD
var preguntas_json = eval("(" + preguntas_txt + ")");
var preguntas_realizadas = new Array();
var pregunta_actual;
var intento_actual = 1;
var letras_a_encontrar;
//FIN VARIABLES DE LA ACTIVIDAD

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
    var class_respuesta;
    var imagen_respuesta;
    var title_respuesta;
    if (preguntas_realizadas.length > 0) {
        for (var i = 0; i < preguntas_realizadas.length; i++) {
            resultados += '<div class="cont_pregunta">';
            resultados += '<p class="numero_pregunta">' + preguntas_realizadas[i].pregunta + '</p>';
            if (preguntas_realizadas[i].correcta === 'si') {
                tu_respuesta = preguntas_realizadas[i].respuestas[0].respuesta;
                class_respuesta = 'txt_respuesta_correcta';
                imagen_respuesta = 'estrella_exito.png';
                title_respuesta = 'CORRECT';
            } else {
                tu_respuesta = 'Incomplete';
                class_respuesta = 'txt_respuesta_incorrecta';
                imagen_respuesta = 'estrella_fallo.png';
                title_respuesta = 'INCORRECT';
            }
            resultados += '<p class="subtitulo_respuesta_txt">Your answer:&nbsp;&nbsp;<span class="' + class_respuesta + '">' + tu_respuesta + '</span></p>';
            resultados += '<p class="subtitulo_respuesta_txt">Correct answer:&nbsp;&nbsp;<span>' + preguntas_realizadas[i].respuestas[0].respuesta + '</span></p>';
            if (preguntas_realizadas[i].justificacion !== '') {
                resultados += '<p class="subtitulo_respuesta_txt">Justification: <span class="justificacion">' + preguntas_realizadas[i].justificacion + '</span></p>';
            }
            resultados += '<img title="' + title_respuesta + '" src="../assets/img/' + imagen_respuesta + '" alt="Respuesta"/>';
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
        $('#ahogado_actividad_pista').html('<p class="pista" id="pista_' + pregunta_actual + '" style="display: none;" >' + preguntas_json.preguntas[pregunta_actual - 1].pista + '</p>');
    }
    $('#ahogado_actividad_pregunta').html(siguiente_pregunta);
    inicializar_tablero();
    $('#contenedor_respuesta').html(armar_respuesta_correcta(preguntas_json.preguntas[pregunta_actual - 1].respuestas[0].respuesta));
    ocultar_mensaje_de_informacion();
}
function inicializar_tablero() {
    intentos_ahogado = '3';
    letras_encontradas = '0';
    $('#img_ahogado').attr("src", "assets/img/ahogado.gif");
    var letras_fila_uno = '<center><img title="a" onclick="seleccionar_letra(\'a\');" id="clk_a" src="assets/img/letra_a.png" alt="Letra"/><img title="b" onclick="seleccionar_letra(\'b\');" id="clk_b" src="assets/img/letra_b.png" alt="Letra"/><img title="c" onclick="seleccionar_letra(\'c\');" id="clk_c" src="assets/img/letra_c.png" alt="Letra"/><img title="d" onclick="seleccionar_letra(\'d\');" id="clk_d" src="assets/img/letra_d.png" alt="Letra"/><img title="e" onclick="seleccionar_letra(\'e\');" id="clk_e" src="assets/img/letra_e.png" alt="Letra"/><img title="f" onclick="seleccionar_letra(\'f\');" id="clk_f" src="assets/img/letra_f.png" alt="Letra"/><img title="g" onclick="seleccionar_letra(\'g\');" id="clk_g" src="assets/img/letra_g.png" alt="Letra"/><img title="h" onclick="seleccionar_letra(\'h\');" id="clk_h" src="assets/img/letra_h.png" alt="Letra"/><img title="i" onclick="seleccionar_letra(\'i\');" id="clk_i" src="assets/img/letra_i.png" alt="Letra"/></center>';
    $('#letras_fila_uno').html(letras_fila_uno);
    var letras_fila_dos = '<center><img title="j" onclick="seleccionar_letra(\'j\');" id="clk_j" src="assets/img/letra_j.png" alt="Letra"/><img title="k" onclick="seleccionar_letra(\'k\');" id="clk_k" src="assets/img/letra_k.png" alt="Letra"/><img title="l" onclick="seleccionar_letra(\'l\');" id="clk_l" src="assets/img/letra_l.png" alt="Letra"/><img title="m" onclick="seleccionar_letra(\'m\');" id="clk_m" src="assets/img/letra_m.png" alt="Letra"/><img title="n" onclick="seleccionar_letra(\'n\');" id="clk_n" src="assets/img/letra_n.png" alt="Letra"/><img title="o" onclick="seleccionar_letra(\'o\');" id="clk_o" src="assets/img/letra_o.png" alt="Letra"/><img title="p" onclick="seleccionar_letra(\'p\');" id="clk_p" src="assets/img/letra_p.png" alt="Letra"/><img title="q" onclick="seleccionar_letra(\'q\');" id="clk_q" src="assets/img/letra_q.png" alt="Letra"/><img title="r" onclick="seleccionar_letra(\'r\');" id="clk_r" src="assets/img/letra_r.png" alt="Letra"/></center>';
    $('#letras_fila_dos').html(letras_fila_dos);
    var letras_fila_tres = '<center><img title="s" onclick="seleccionar_letra(\'s\');" id="clk_s" src="assets/img/letra_s.png" alt="Letra"/><img title="t" onclick="seleccionar_letra(\'t\');" id="clk_t" src="assets/img/letra_t.png" alt="Letra"/><img title="u" onclick="seleccionar_letra(\'u\');" id="clk_u" src="assets/img/letra_u.png" alt="Letra"/><img title="v" onclick="seleccionar_letra(\'v\');" id="clk_v" src="assets/img/letra_v.png" alt="Letra"/><img title="w" onclick="seleccionar_letra(\'w\');" id="clk_w" src="assets/img/letra_w.png" alt="Letra"/><img title="x" onclick="seleccionar_letra(\'x\');" id="clk_x" src="assets/img/letra_x.png" alt="Letra"/><img title="y" onclick="seleccionar_letra(\'y\');" id="clk_y" src="assets/img/letra_y.png" alt="Letra"/><img title="z" onclick="seleccionar_letra(\'z\');" id="clk_z" src="assets/img/letra_z.png" alt="Letra"/></center>';
    $('#letras_fila_tres').html(letras_fila_tres);
}
function armar_respuesta_correcta(respuesta_a_armar) {
    letras_a_encontrar = 0;
    var abrir_palabra = '<label>';
    var cerrar_palabra = '</label>';
    var respuesta_armada = '<center>' + abrir_palabra;
    for (var i = 0; i < respuesta_a_armar.length; i++) {
        if (respuesta_a_armar.charAt(i) === ' ') {
            imagen = cerrar_palabra + '<img class="espacio_blanco" src="assets/img/circulo_transparente.png" alt="Espacio"/>' + abrir_palabra;
        } else {
            imagen = '<img id="letra_' + (i + 1) + '" src="assets/img/circulo_azul.png" alt="Letra"/>';
            letras_a_encontrar++;
        }
        letra_escondida = '<input class="letras_respuesta" type="hidden" value="' + respuesta_a_armar.charAt(i) + '" id="letra_' + (i + 1) + '_value"/>';
        respuesta_armada += imagen + letra_escondida;
    }
    respuesta_armada += cerrar_palabra + '</center>';
    return respuesta_armada;
}
function seleccionar_letra(letra) {
    $('#pantalla_invisible').css('display', 'block');
    var obj_letra = $('#clk_' + letra);
    obj_letra.fadeOut(500, function () {
        var encontro_letra = validar_existencia_letra_seleccionada_en_respuesta(letra);
        if (encontro_letra) {
            if (intentos_ahogado < 3) {
                intentos_ahogado = parseInt(intentos_ahogado) + 1;
                actualizar_imagen_ahogado();
            }
            mostrar_mensaje_en_imagen('', 'green');
            obj_letra.attr("src", "assets/img/letra_" + letra + "_verde.png");
            obj_letra.fadeIn(500);
        } else {
            if (parseInt(intentos_ahogado) !== 1) {
                mostrar_mensaje_en_imagen('', 'red');
            }
            intentos_ahogado = parseInt(intentos_ahogado) - 1;
            actualizar_imagen_ahogado();
            obj_letra.attr("src", "assets/img/letra_" + letra + "_gris.png");
            obj_letra.fadeIn(500);
        }
        obj_letra.attr("title", letra);
        obj_letra.prop('onclick', null).off('click');
        obj_letra.css('cursor', 'default');
        $('#pantalla_invisible').fadeOut(2000);
    });
}
function mostrar_mensaje_en_imagen(mensaje, color) {
    var msg_fallo = $('#msg_fallo');
    msg_fallo.css('color', color);
    msg_fallo.html(mensaje);
    msg_fallo.fadeIn(1000);
    msg_fallo.fadeOut(1000);
}
function validar_existencia_letra_seleccionada_en_respuesta(letra) {
    var encontro_letra = false;
    for (var i = 1; i <= $('.letras_respuesta').length; i++) {
        if ($('#letra_' + i + '_value').val() === letra) {
            encontro_letra = true;
            activar_letra_respuesta(i, letra);
        }
    }
    return encontro_letra;
}
function activar_letra_respuesta(pos, letra) {
    $('#letra_' + pos).fadeOut(500, function () {
        $('#letra_' + pos).attr("src", "assets/img/letra_" + letra + "_verde.png");
        $('#letra_' + pos).attr("title", letra);
        $('#letra_' + pos).fadeIn(500);
    });
    letras_encontradas = parseInt(letras_encontradas) + 1;
    //DEBEMOS VALIDAR QUE EL USUARIO NO HALLA GANADO PARA CONTINUAR JUGANDO
    if ((letras_a_encontrar) === parseInt(letras_encontradas)) {
        $('#pantalla_invisible').css('display', 'block');
        activar_estrella(pregunta_actual, 'exito');
        puntaje_actual = parseInt(puntaje_actual) + parseInt(puntaje);
        $('#cont_puntos').html(parseInt(puntaje_actual));
        if (pregunta_actual === numero_de_preguntas) {
            activar_contenedor('cont_resultados');
            parar_cuenta_regresiva();
            armar_resultados();
        } else {
            setTimeout(function () {
                mostrar_mensaje_de_informacion('Very good. Press the button to continue with the next question.');
                pregunta_actual++;
            }, 500);
        }
    }
}
function actualizar_imagen_ahogado() {
    $('#img_ahogado').fadeOut(500, function () {
        if (parseInt(intentos_ahogado) === 3) {
            $('#img_ahogado').attr("src", "assets/img/ahogado.gif");
            $('#img_ahogado').fadeIn(500);
        } else if (parseInt(intentos_ahogado) === 2) {
            $('#img_ahogado').attr("src", "assets/img/ahogado_2.gif");
            $('#img_ahogado').fadeIn(500);
        } else if (parseInt(intentos_ahogado) === 1) {
            $('#img_ahogado').attr("src", "assets/img/ahogado_3.gif");
            $('#img_ahogado').fadeIn(500);
        } else if (parseInt(intentos_ahogado) === 0) {
            $('#img_ahogado').attr("src", "assets/img/ahogado_4.gif");
            $('#img_ahogado').fadeIn(500);
            setTimeout(function () {
                perdio_por_no_encontrar_las_letras();
            }, 500);
        }
    });
}
function perdio_por_no_encontrar_las_letras() {
    activar_estrella(pregunta_actual, 'fallo');
    if (pregunta_actual === numero_de_preguntas) {
        activar_contenedor('cont_resultados');
        armar_resultados();
    } else {
        mostrar_mensaje_de_informacion('He`s drowned. Press the button to continue with the next question.');
        pregunta_actual++;
    }
}
function mostrar_mensaje_de_informacion(mensaje_de_fallo) {
    $('#cont_mensaje_interno_txt').html(mensaje_de_fallo);
    $('#ahogado_actividad').css('display', 'none');
    $('#cont_mensaje_interno').fadeIn(1500);
}
function ocultar_mensaje_de_informacion() {
    $('#ahogado_actividad').css('display', 'block');
    $('#cont_mensaje_interno').css('display', 'none');
}
/*FIN FUNCIONES PUNTUALES ACTIVIDAD*/
$(window).load(setTimeout(inicializar_reglas_actividad(), 1000));