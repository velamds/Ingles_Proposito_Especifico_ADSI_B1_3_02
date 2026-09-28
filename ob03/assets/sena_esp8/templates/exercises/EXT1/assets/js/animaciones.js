
var icono_actividad = $('.titulo_actividad img');
var titulo_actividad = $('.titulo_actividad p');
var descripcion_actividad = $('.descripcion_actividad');
var icono_actividad_img = $('.icono_actividad_img img');
var reglas_actividad = $('.reglas_actividad p');
var icono_1 = $('#icono_1 img');
var icono_2 = $('#icono_2 img');
var icono_3 = $('#icono_3 img');
var icono_4 = $('#icono_4 img');
var icono_5 = $('#icono_5 img');
var icono_6 = $('#icono_6 img');
var icono_1_text = $('.reglas_actividad #icono_1 span');
var icono_2_text = $('.reglas_actividad #icono_2 span');
var icono_3_text = $('.reglas_actividad #icono_3 span');
var icono_4_text = $('.reglas_actividad #icono_4 span');
var icono_5_text = $('.reglas_actividad #icono_5 span');
var icono_6_text = $('.reglas_actividad #icono_6 span');
var hr_reglas_actividad = $('.reglas_actividad hr');
var btn_iniciar = $('#btn_iniciar');

function mostrar_modal(id_modal) {
    $("#" + id_modal).modal('show');
}

function interactuar_con_pista(pista) {
    $('#pista_' + pista).toggle('slow');
}

function logo_animation() {
    icono_actividad.animate({
        opacity: '1',
        left: '2%'
    }, 1000, 'easeOutBack');
    // - TITULO ACTIVIDAD
    var show_titulo_actividad = function () {
        titulo_actividad.animate({
            left: '2.5%',
            opacity: '1'
        }, 1000, 'easeOutBack');
    };
    setTimeout(show_titulo_actividad, 500);
    // - DESCRIPCION
    var show_descripcion_actividad = function () {
        descripcion_actividad.animate({
            left: '1%',
            opacity: '1'
        }, 1500, 'easeOutBack');
    };
    setTimeout(show_descripcion_actividad, 1000);
    // - ICONO ACTIVIDAD
    var show_icono_actividad = function () {
        if (screen.width >= 1045) {
            icono_actividad_img.animate({
                width: '40%',
                opacity: '1'
            }, 1500, 'easeOutBack');
        } else if (screen.width <= 1024) {
            icono_actividad_img.animate({
                width: '70%',
                opacity: '1'
            }, 1500, 'easeOutBack');
        }
    };
    setTimeout(show_icono_actividad, 1500);
    // - REGLAS ACTIVIDAD TXT
    var show_reglas_actividad = function () {
        reglas_actividad.animate({
            left: '1%',
            opacity: '1'
        }, 1500, 'easeOutBack');
        hr_reglas_actividad.animate({
            opacity: '1',
            width: '100%'
        }, 4100, 'swing');
    };
    setTimeout(show_reglas_actividad, 2000);
    // - ICONO_1
    var show_icono_tiempo = function () {
        icono_1.animate({
            opacity: '1'
        }, 800, 'easeOutBack');
    };
    setTimeout(show_icono_tiempo, 2500);
    // - ICONO_1 TXT
    var show_icono_tiempo_text = function () {
        icono_1_text.animate({
            left: '1%',
            opacity: '1'
        }, 500, 'easeOutBack');
    };
    setTimeout(show_icono_tiempo_text, 3000);
    // - ICONO_2
    var show_icono_puntos = function () {
        icono_2.animate({
            opacity: '1'
        }, 800, 'easeOutBack');
    };
    setTimeout(show_icono_puntos, 3300);
    // - ICONO_2 TXT
    var show_icono_puntos_text = function () {
        icono_2_text.animate({
            left: '1%',
            opacity: '1'
        }, 500, 'easeOutBack');
    };
    setTimeout(show_icono_puntos_text, 3800);
    // - ICONO_3
    var show_icono_instruccion = function () {
        icono_3.animate({
            opacity: '1'
        }, 800, 'easeOutBack');
    };
    setTimeout(show_icono_instruccion, 4100);
    // - ICONO_3 TXT
    var show_icono_instruccion_text = function () {
        icono_3_text.animate({
            left: '1%',
            opacity: '1'
        }, 500, 'easeOutBack');
    };
    setTimeout(show_icono_instruccion_text, 4600);
    // - ICONO_4
    var show_icono_estrella = function () {
        icono_4.animate({
            opacity: '1'
        }, 800, 'easeOutBack');
    };
    setTimeout(show_icono_estrella, 5100);
    // - ICONO_4 TXT
    var show_icono_estrella_text = function () {
        icono_4_text.animate({
            left: '1%',
            opacity: '1'
        }, 500, 'easeOutBack');
    };
    setTimeout(show_icono_estrella_text, 5600);
    // - ICONO_5
    var show_icono_5 = function () {
        icono_5.animate({
            opacity: '1'
        }, 800, 'easeOutBack');
    };
    setTimeout(show_icono_5, 6100);
    // - ICONO_5 TXT
    var show_icono_5_text = function () {
        icono_5_text.animate({
            left: '1%',
            opacity: '1'
        }, 500, 'easeOutBack');
    };
    setTimeout(show_icono_5_text, 6600);
    // - ICONO_6
    var show_icono_6 = function () {
        icono_6.animate({
            opacity: '1'
        }, 800, 'easeOutBack');
    };
    setTimeout(show_icono_6, 7000);
    // - ICONO_5 TXT
    var show_icono_6_text = function () {
        icono_6_text.animate({
            left: '1%',
            opacity: '1'
        }, 500, 'easeOutBack');
    };
    setTimeout(show_icono_6_text, 7600);
    // - BTN INICIAR
    var show_btn_iniciar = function () {
        btn_iniciar.fadeIn();
        mostrar_modal('modalInstruccion');
    };
    setTimeout(show_btn_iniciar, 8000);
}

function logo_animation_eva() {
    icono_actividad.animate({
        opacity: '1',
        left: '2%'
    }, 1000, 'easeOutBack');
    // - TITULO ACTIVIDAD
    var show_titulo_actividad = function () {
        titulo_actividad.animate({
            left: '7.5%',
            opacity: '1'
        }, 1000, 'easeOutBack');
    };
    setTimeout(show_titulo_actividad, 500);
    // - ICONO ACTIVIDAD
    var show_icono_actividad = function () {
        if (screen.width >= 1045) {
            icono_actividad_img.animate({
                width: '40%',
                opacity: '1'
            }, 1500, 'easeOutBack');
        } else if (screen.width <= 1024) {
            icono_actividad_img.animate({
                width: '70%',
                opacity: '1'
            }, 1500, 'easeOutBack');
        }
    };
    setTimeout(show_icono_actividad, 1000);
    // - ICONO_1
    var show_icono_tiempo = function () {
        icono_1.animate({
            opacity: '1'
        }, 800, 'easeOutBack');
    };
    setTimeout(show_icono_tiempo, 1500);
    // - ICONO_1 TXT
    var show_icono_tiempo_text = function () {
        icono_1_text.animate({
            left: '1%',
            opacity: '1'
        }, 500, 'easeOutBack');
    };
    setTimeout(show_icono_tiempo_text, 2000);
    // - BTN INICIAR
    var show_btn_iniciar = function () {
        btn_iniciar.fadeIn();
        mostrar_modal('modalInstruccion');
    };
    setTimeout(show_btn_iniciar, 2500);
}