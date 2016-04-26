var CalendarModule = (function () {
    // Todo remove public variables in public methods. This is overkill
    var calendarObj = {};
    calendarObj.now = moment();
    calendarObj.display_date = calendarObj.now;
    calendarObj.startOfMonth = undefined;

    calendarObj.addMonth = function () {
        calendarObj.display_date = calendarObj.display_date.add(1, 'months');
        calendarObj.getDaysInMonth();
    }

    calendarObj.subtractMonth = function () {
        calendarObj.display_date = calendarObj.display_date.add(-1, 'months');
        calendarObj.getDaysInMonth();
    }

    calendarObj.getDaysInMonth = function () {
        calendarObj.display_days_in_month = calendarObj.display_date.daysInMonth();
    }

    calendarObj.getstartOfMonth = function () {
        calendarObj.startOfMonth = calendarObj.display_date.clone().startOf('month');
        calendarObj.startOfMonth = moment(calendarObj.startOfMonth).format("d");
    }

    calendarObj.getDayClicked = function (date) {
        calendarObj.getstartOfMonth()
        return calendarObj.display_date.clone().startOf('month').add(date-1, 'days')
    }

    // sp build
    calendarObj.builDaysOfWeek = function () {
        var daysOfWeek = ["Sunday", "Monday", "Tuesday", 
            "Wednesday", "Thursday", "Friday", "Saturday"];
        calendarDays = "<div class='row row--calendar'>";

        for( var i=0; i < daysOfWeek.length; i++) {

          calendarDays += "<div class='col-md-1'> "+daysOfWeek[i] +"</div>";
        }

        calendarDays += "</div>";

        return calendarDays;
    }

    calendarObj.buildCalendar = function () {
      var day = 1;
      // change var
      var total = 0;
      var calendar = "";
      // change var snake
      var total_time = CalendarModule.display_days_in_month + (CalendarModule.startOfMonth-1);

      for(var i=0; i < 6; i++) {
        calendar += "<div class='row row--calendar'>";
        
        for(var j=0; j<7; j++) {
            if (total >= CalendarModule.startOfMonth && total <= total_time){
                calendar += "<div class='col-md-1 dated' data-date-of-month="+day+">"+ day +"</div>";
                day++;
            } else {
                calendar += "<div class='col-md-1'></div>";
            }
            total++;
        }
        calendar += "</div>";
      }
      return calendar;
    }

    calendarObj.getDaysInMonth();
    calendarObj.getstartOfMonth();

    return calendarObj


})();




$(document).ready(function () {
    function foo (change_month) {
        change_month();
        // CalendarModule.getDaysInMonth();
        CalendarModule.getstartOfMonth();
        $("#calendar").empty()
        $('#calendar').html(CalendarModule.buildCalendar())

        $('#calendar-title').text(moment(CalendarModule.display_date).format("MMMM YYYY"));   
    }

    $('#calendar').on('click', '.dated', function () {
        $('#eventModal').modal('show');
        var dateOfMonth = CalendarModule.getDayClicked($(this).data('date-of-month'));
        console.log($('#date-input').data("DateTimePicker"))
        $('#date-input').data("DateTimePicker").date(moment(dateOfMonth,"DD/MM/YYYY"));
    });

    $('#nextMonth').on('click', function () {
        foo(CalendarModule.addMonth);
    });

    $('#prevMonth').on('click', function () {
        foo(CalendarModule.subtractMonth)
    });

    // remove main
    function main () {
        CalendarModule.getDaysInMonth();
        CalendarModule.getstartOfMonth();
        $('#calendar').html(CalendarModule.buildCalendar())
        $('#calendar-days').html(CalendarModule.builDaysOfWeek())
        $('#calendar-title').text(moment(CalendarModule.now).format("MMMM YYYY"));

        $('#date-input').datetimepicker({
            format: 'MM/DD/YYYY'
        });

        $('#start-time-input').datetimepicker({
            format: 'h:mm a'
        });

        $('#end-time-input').datetimepicker({
            format: 'h:mm a'
        });
    }

    main()
});

// socket.on('connect', function() {
//     var calendarURL = $("#calendar").data("calendar-url")
//     // Todo move to function if used again
//     socket.emit("join room", {calendarURL: calendarURL})
// });


$("#add-event-form").on("submit", function (evt) {
    evt.preventDefault();
    var titleVal = $('#event_title').val()
    // mutator
    var dateWithTimeZone = $('#date-input').data("DateTimePicker").date()
    // var dateWithoutTimeZone = dateWithTimeZone.utc()

    var startTimestampVal = $('#start-time-input').data("DateTimePicker").date()
    var endTimestampVal = $('#end-time-input').data("DateTimePicker").date();

    // these are objects not timestamps. Are hour and minute mutators?
    var startTimestampTimeZone = dateWithTimeZone.clone().hour(
            startTimestampVal.hour()
        ).minute(
            startTimestampVal.minute()
        );

    var endTimestampTimeZone = dateWithTimeZone.clone().hour(
            endTimestampVal.hour()
        ).minute(
            endTimestampVal.minute()
        );

    var startTimestampUTC = startTimestampTimeZone.utc().format();
    var endTimestampUTC = endTimestampTimeZone.utc().format();

    var calendarURL = $("#calendar").data("calendar-url")

    var foo = {data: {
        startTimestampUTC: startTimestampUTC,
        endTimestampUTC: endTimestampUTC,
        eventTitle: titleVal,
        calendarURL: calendarURL
    }};

    socket.emit('add calendar event', foo);
})

socket.on('add calendar event response', function(msg) {
    console.log(msg)
});

socket.on('join room response', function(msg) {
    console.log(msg)
});

// socket.on('leave room status', function(msg) {
//     console.log(msg)
// });