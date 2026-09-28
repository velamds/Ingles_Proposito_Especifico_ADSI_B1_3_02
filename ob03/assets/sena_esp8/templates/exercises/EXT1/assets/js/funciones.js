function interactuar_con_pista(pista) {
    $('#pista_' + pista).toggle('slow');
}
function mostrar_modal(id_modal) {
    var tamano_modal_body = ($(window).height() - ($(window).height() / 4));
    $("#" + id_modal).modal('show');
    $(".modal-body").css('max-height', tamano_modal_body);
    $("#popup_pregunta").css('top', '25%');
}
function ocultar_modal(id_modal) {
    $("#" + id_modal).modal('hide');
}