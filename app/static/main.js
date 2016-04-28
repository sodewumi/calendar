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

    calendarObj.startOfDayUTC = function (dateObj) {
        createdDay = dateObj.clone().startOf('day');
        return createdDay.utc().format();
    }
    calendarObj.endOfDayUTC = function (dateObj) {
        createdDay = dateObj.clone().endOf('day');
        return createdDay.utc().format();
    }

    calendarObj.startOfMonthUTC = function () {
        createdMonth = displayDate.clone().startOf('month');
        return createdMonth.utc().format();
    }

    calendarObj.endOfMonthUTC = function () {
        createdMonth = displayDate.clone().endOf('month');
        return createdMonth.utc().format();
    }

    calendarObj.currentMonthIndex = function () {
        createdMonth = displayDate.clone().startOf('month');
        return createdMonth.utc().format("M");
    }


    calendarObj.getDaysInMonth = function () {
        return displayDate.daysInMonth();
    }

    calendarObj.getStartDayOfMonth = function () {
        var startDayOfMonth = displayDate.clone().startOf('month');
        startDayOfMonth = moment(startDayOfMonth).format("d");

        return startDayOfMonth
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

          calendarDays += "<div class='col-md-1 col--days'> "+daysOfWeek[i] +"</div>";
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
      var startOfMonthIndex = calendarObj.getStartDayOfMonth();
      var endOfCalendar = daysInMonth + (startOfMonthIndex-1);

      for(var i=0; i < 6; i++) {
        calendar += "<div class='row row--calendar'>";
        
        for(var j=0; j<7; j++) {
            // move to multiline
            if (calendar_cell_cnt>= startOfMonthIndex && calendar_cell_cnt <= endOfCalendar){
                calendar += "<div class='col-md-1 dated' data-date-of-month="+date+">"
                    + "<p id='date"+date.toString()+"'>" + date +"</p>" +
                    "<div></div></div>";
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
    // De Morgans Law
    calendarObj.findOverlappingDates = function(events) {
        for (var key in events) {

          if (events.hasOwnProperty(key)) {

            for(var k=0; k < events[key].length;k++) {
               events[key][k]['startTimestampUTC'] =  moment.utc(events[key][k]['startTimestampUTC']).local();
                events[key][k]['endTimestampUTC'] = moment.utc(events[key][k]['endTimestampUTC']).local();
            }

            for(var i = 0; i < events[key].length; i++) {
                var startDatetimeObj = events[key][i]['startTimestampUTC'];
                var endDatetimeObj = events[key][i]['endTimestampUTC'];

                for (var j=i+1; j < events[key].length; j++) {
                    var compareStartDatetimeObj = events[key][j]['startTimestampUTC'];
                    var compareEndDatetimeObj = events[key][j]['endTimestampUTC'];

                    if (startDatetimeObj <= compareEndDatetimeObj
                        && endDatetimeObj >= compareStartDatetimeObj) {
                        events[key][i]['overlap'] = true;
                        events[key][j]['overlap'] = true;
                    }

                }
            }

          }
        }
    }

    calendarObj.createCalendarEvents = function(events) {

        for (var key in events) {

          if (events.hasOwnProperty(key)) {
                var $currentDate  = $("#date"+key).parent().find("div");
                $currentDate.empty()

                for(var i=events[key].length-1; i>-1; i--) {
                    anEvent = "<p>";
                    anEvent += events[key][i]["startTimestampUTC"].clone().format("h:mm a") + " : " +
                       events[key][i]["endTimestampUTC"].clone().format("h:mm a") + " - " +
                       events[key][i]["title"] + "</p>"

                    if (events[key][i]['overlap'] === true) {
                       $(anEvent).appendTo($currentDate).addClass('overlap')
                    } else {
                        $currentDate.append(anEvent)
                    }
                }    

          }
        }
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

        return updateDatetimeObj;
    }

    $('#calendar').on('click', '.dated', function () {
        $('#eventModal').modal('show');
        var dateOfMonth = CalendarModule.getDateClicked($(this).data('date-of-month'));
        $('#date-input').data("DateTimePicker").date(moment(dateOfMonth,"DD/MM/YYYY"));
        $('#end-time-input').data("DateTimePicker");
    });
    function fn () {
        var calendarURL = $("#calendar").data("calendar-url");
        var startMonthTimestampUTC = CalendarModule.startOfMonthUTC();
        var roomCode = calendarURL + startMonthTimestampUTC;
        socket.emit('leave room', {room: roomCode})

        var calendarURL = $("#calendar").data("calendar-url");

        var startMonthTimestampUTC = CalendarModule.startOfMonthUTC();
        var endMonthTimestampUTC = CalendarModule.endOfMonthUTC();
        var currentMonth = CalendarModule.currentMonthIndex();

        var calendarData = {
            calendarURL: calendarURL,
            startMonthTimestampUTC: startMonthTimestampUTC,
            endMonthTimestampUTC: endMonthTimestampUTC,
        };

        socket.emit("join room", calendarData);
    }

    $('#nextMonth').on('click', function () {
        updateMonth(CalendarModule.addMonth);
        console.log('lefttt')
        // var promise = new Promise(function(resolve) {
            var calendarURL = $("#calendar").data("calendar-url");
            var startMonthTimestampUTC = CalendarModule.startOfMonthUTC();
            var roomCode = calendarURL + startMonthTimestampUTC;
            socket.emit('leave room', {room: roomCode})

        //   if (true) {
        //     resolve();
        //   }

        // })

        // promise.then(function(result) {
        //   fn() // "Stuff worked!"
        // }, function(err) {
        //   console.log(err); // Error: "It broke"
        // });

    });


    $('#prevMonth').on('click', function () {
        updateMonth(CalendarModule.subtractMonth);
        var calendarURL = $("#calendar").data("calendar-url");
        var startMonthTimestampUTC = CalendarModule.startOfMonthUTC();
        var roomCode = calendarURL + startTimestampUTC;
        socket.emit('leave room',  {room: roomCode})
    });

    $('#calendar-days').html(CalendarModule.buildDaysOfWeek());
    buildDisplayCalendar();


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

        var startTimestampUTC = startDatetimeObj.clone().utc().format();
        var endTimestampUTC = endDatetimeObj.clone().utc().format();

        var eventObj = {data: {
            startTimestampUTC: startTimestampUTC,
            endTimestampUTC: endTimestampUTC,
            eventTitle: titleVal,
            calendarURL: calendarURL,
            startOfDay: CalendarModule.startOfDayUTC(startDatetimeObj),
            endOfDay: CalendarModule.endOfDayUTC(endDatetimeObj)
        }};

        $('#event_title').val("");
        $('#start-time-input').find("input").val("");
        $('#end-time-input').find("input").val("");
        $('#eventModal').modal('hide');

        socket.emit('add calendar event', eventObj);
    });

    socket.on('connect', function() {
        var calendarURL = $("#calendar").data("calendar-url");

        var startMonthTimestampUTC = CalendarModule.startOfMonthUTC();
        var endMonthTimestampUTC = CalendarModule.endOfMonthUTC();
        var currentMonth = CalendarModule.currentMonthIndex();

        var calendarData = {
            calendarURL: calendarURL,
            startMonthTimestampUTC: startMonthTimestampUTC,
            endMonthTimestampUTC: endMonthTimestampUTC,
        };

        socket.emit("join room", calendarData);
    });

    socket.on('add calendar event response', function(msg) {
        msg = $.parseJSON(msg);
        CalendarModule.findOverlappingDates(msg);
        CalendarModule.createCalendarEvents(msg);
    });

    socket.on('join room response', function(msg) {
        msg = $.parseJSON(msg);
        CalendarModule.findOverlappingDates(msg);
        CalendarModule.createCalendarEvents(msg);


    });

    socket.on('leave room response', function(msg) {
        console.log("EHEH")
        console.log(msg)
    });
});






