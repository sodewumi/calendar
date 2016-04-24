$('.row--calendar').on("click", 'div', function () {
    $('#eventModal').modal('show')
});

$(function () {
    $('#day-input').datetimepicker({
        format: 'MM/DD/YYYY'
    });

    $('#start-time-input').datetimepicker({
        format: 'h:mm a'
    });

    $('#end-time-input').datetimepicker({
        format: 'h:mm a'
    });
});