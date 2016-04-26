var socket = io.connect('http://' + document.domain + ':' + location.port + '/calendar_app');

var CalendarModule = (function (moment) {

    var calendarObj = {};
    var displayDate = moment();

    calendarObj.addMonth = function () {
        displayDate = displayDate.add(1, "months");
        return displayDate
    }

    calendarObj.subtractMonth = function () {
        displayDate = displayDate.add(-1, "months");
        return displayDate
    }

    calendarObj.getDaysInMonth = function () {
        return displayDate.daysInMonth();
    }

    calendarObj.getstartOfMonth = function () {
        var startOfMonth = displayDate.clone().startOf('month');
        var startOfMonth2 = displayDate.clone()
        startOfMonth = moment(startOfMonth).format("d");

        return startOfMonth
    }

    calendarObj.getDateClicked = function (date) {

        return displayDate.clone().startOf('month').add(date-1, 'days')
    }

    calendarObj.buildDaysOfWeek = function () {
        var daysOfWeek = ["Sunday", "Monday", "Tuesday", 
            "Wednesday", "Thursday", "Friday", "Saturday"];
        // TODO change to array
        calendarDays = "<div class='row row--calendar'>";

        for( var i=0; i < daysOfWeek.length; i++) {

          calendarDays += "<div class='col-md-1'> "+daysOfWeek[i] +"</div>";
        }

        calendarDays += "</div>";

        return calendarDays;
    }

    calendarObj.getCalendarTitle = function () {
        return moment(displayDate).format("MMMM YYYY")
    }

    calendarObj.buildCalendar = function () {
      var date = 1;
      var calendar_cell_cnt = 0;
      // TODO change to array
      var calendar = "";
      var daysInMonth = calendarObj.getDaysInMonth();
      var startOfMonthIndex = calendarObj.getstartOfMonth();
      var endOfCalendar = daysInMonth + (startOfMonthIndex-1);

      for(var i=0; i < 6; i++) {
        calendar += "<div class='row row--calendar'>";
        
        for(var j=0; j<7; j++) {
            // move to multiline
            if (calendar_cell_cnt>= startOfMonthIndex && calendar_cell_cnt <= endOfCalendar){
                calendar += "<div class='col-md-1 dated' data-date-of-month="+date+">"
                    + date +"</div>";
                date++;
            } else {
                calendar += "<div class='col-md-1'></div>";
            }
            calendar_cell_cnt++;
        }
        calendar += "</div>";
      }
      return calendar;
    }

    return calendarObj


})(moment);




$(document).ready(function () {
    function buildDisplayCalendar () {
        $("#calendar").empty();
        $('#calendar').html(CalendarModule.buildCalendar());
        $('#calendar-title').text(CalendarModule.getCalendarTitle());
    }

    function updateMonth (change_month) {
        change_month();
        buildDisplayCalendar()
    }

    function updateDatetimeObjHourMin (dateClickedDatetimeObj, datetimeObj) {
        var updateDatetimeObj = dateClickedDatetimeObj.clone().hour(
            datetimeObj.hour()
        ).minute(
            datetimeObj.minute()
        );

        return updateDatetimeObj
    }

    $('#calendar').on('click', '.dated', function () {
        $('#eventModal').modal('show');
        var dateOfMonth = CalendarModule.getDateClicked($(this).data('date-of-month'));
        $('#date-input').data("DateTimePicker").date(moment(dateOfMonth,"DD/MM/YYYY"));
        $('#end-time-input').data("DateTimePicker")
    });

    $('#nextMonth').on('click', function () {
        updateMonth(CalendarModule.addMonth);
    });

    $('#prevMonth').on('click', function () {
        updateMonth(CalendarModule.subtractMonth)
    });

    $('#calendar-days').html(CalendarModule.buildDaysOfWeek())
    buildDisplayCalendar()


    $('#date-input').datetimepicker({
        format: 'MM/DD/YYYY'
    });

    $('#start-time-input').datetimepicker({
        format: 'h:mm a'
    });

    $('#end-time-input').datetimepicker({
        format: 'h:mm a'
    });

    $("#add-event-form").on("submit", function (evt) {
        evt.preventDefault();

        var dateClickedDatetimeObj = $('#date-input').data("DateTimePicker").date();
        var startDatetimeObj = $('#start-time-input').data("DateTimePicker").date();
        var endDatetimeObj = $('#end-time-input').data("DateTimePicker").date();
        var titleVal = $('#event_title').val();
        var calendarURL = $("#calendar").data("calendar-url");

        var startDatetimeObj = updateDatetimeObjHourMin(dateClickedDatetimeObj, startDatetimeObj);
        var endDatetimeObj = updateDatetimeObjHourMin(dateClickedDatetimeObj, endDatetimeObj);

        var startTimestampUTC = startDatetimeObj.utc().format();
        var endTimestampUTC = endDatetimeObj.utc().format();

        var eventObj = {data: {
            startTimestampUTC: startTimestampUTC,
            endTimestampUTC: endTimestampUTC,
            eventTitle: titleVal,
            calendarURL: calendarURL
        }};

        socket.emit('add calendar event', eventObj);
    });

    socket.on('connect', function() {
        var calendarURL = $("#calendar").data("calendar-url")
        // Todo move to function if used again
        socket.emit("join room", {calendarURL: calendarURL})
    });

    socket.on('add calendar event response', function(msg) {
        console.log(msg)
    });

    socket.on('join room response', function(msg) {
        console.log(msg)
    });

    // socket.on('leave room status', function(msg) {
    //     console.log(msg)
    // });
});






