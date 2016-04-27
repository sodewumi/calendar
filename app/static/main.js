var socket = io.connect('http://' + document.domain + ':' + location.port + '/calendar_app');

var CalendarModule = (function (moment) {

    var calendarObj = {};
    var displayDate = moment();

    calendarObj.addMonth = function () {
        displayDate = displayDate.add(1, "months");
        return displayDate
    }

    calendarObj.startOfDay1 = function (dateObj) {
        createdDay = dateObj.clone().startOf('day');
        return createdDay.utc().format();
    }
    calendarObj.endOfDay1 = function (dateObj) {
        createdDay = dateObj.clone().endOf('day');
        return createdDay.utc().format();
    }

    calendarObj.startOfMonth1 = function () {
        createdMonth = displayDate.clone().startOf('month');
        return createdMonth.utc().format();
    }

    calendarObj.endOfMonth1 = function () {
        createdMonth = displayDate.clone().endOf('month');
        return createdMonth.utc().format();
    }

    calendarObj.currentMonth1 = function () {
        createdMonth = displayDate.clone().startOf('month');
        return createdMonth.utc().format("M");
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
      var startOfMonthIndex = calendarObj.getstartOfMonth();
      var endOfCalendar = daysInMonth + (startOfMonthIndex-1);

      for(var i=0; i < 6; i++) {
        calendar += "<div class='row row--calendar'>";
        
        for(var j=0; j<7; j++) {
            // move to multiline
            if (calendar_cell_cnt>= startOfMonthIndex && calendar_cell_cnt <= endOfCalendar){
                calendar += "<div class='col-md-1 dated' data-date-of-month="+date+">"
                    + "<p id='date"+date.toString()+"'>" + date +"</p>" +"</div>";
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

    // De Morgans Law
    function find_overlapping_dates(events) {
        for (var key in events) {

          if (events.hasOwnProperty(key)) {
            for(var k=0; k < events[key].length;k++) {
                console.log(events[key][k])
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
                        console.log("hey")
                        events[key][i]['overlap'] = true;
                        events[key][j]['overlap'] = true;
                    }

                }
            }

          }
        }
    }

    function create_calendar(events) {
        console.log(events)
        for (var key in events) {

          if (events.hasOwnProperty(key)) {
            console.log(events[key])
                var $currentDate  = $("#date"+key).parent()

                for(var i=0; i<events[key].length; i++) {
                    anEvent = "<p>";
                    anEvent += events[key][i]["startTimestampUTC"].clone().format("h:mm") + " : " +
                       events[key][i]["endTimestampUTC"].clone().format("h:mm") + " - " +
                       events[key][i]["title"] + "</p>"

                    if (events[key][i]['overlap'] === true) {
                        $(anEvent).appendTo("#date"+key).addClass('overlap')
                    } else {
                        $currentDate.append(anEvent)
                    }
                }    

          }
        }
    }

    function update_calendar(calendarEvent, key) {

        var $currentDate  = $("#date"+key).parent()

        for(var i=0; i<calendarEvent[key].length; i++) {
            calendarEvent = "<p>";
            calendarEvent += calendarEvent[key][i]["startTimestampUTC"] + " : " +
               calendarEvent[key][i]["endTimestampUTC"] + " - " +
               calendarEvent[key][i]["title"] + "</p>"

            if (calendarEvent[key][i]['overlap'] === true) {
                $(calendarEvent).appendTo("#date"+key).addClass('overlap')
            } else {
                $currentDate.append(anEvent)
            }
        } 

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
        console.log("calendarUrl")
        console.log("#")

        var startDatetimeObj = updateDatetimeObjHourMin(dateClickedDatetimeObj, startDatetimeObj);
        var endDatetimeObj = updateDatetimeObjHourMin(dateClickedDatetimeObj, endDatetimeObj);

        var startTimestampUTC = startDatetimeObj.clone().utc().format();
        var endTimestampUTC = endDatetimeObj.clone().utc().format();
        console.log("YEINSUDE")
        console.log(CalendarModule.startOfMonth1(startDatetimeObj))
        console.log(CalendarModule.endOfMonth1(startDatetimeObj))
        var eventObj = {data: {
            startTimestampUTC: startTimestampUTC,
            endTimestampUTC: endTimestampUTC,
            eventTitle: titleVal,
            calendarURL: calendarURL,
            startOfDay: CalendarModule.startOfDay1(startDatetimeObj),
            endOfDay: CalendarModule.endOfDay1(endDatetimeObj)
        }};
        $('#eventModal').modal('hide');
        socket.emit('add calendar event', eventObj);
    });

    socket.on('connect', function() {
        var calendarURL = $("#calendar").data("calendar-url");
                console.log(calendarURL)
        console.log("#")
        var startMonthTimestampUTC = CalendarModule.startOfMonth1()
        var endMonthTimestampUTC = CalendarModule.endOfMonth1()
        var currentMonth = CalendarModule.currentMonth1()

        var calendarData = {
            calendarURL: calendarURL,
            startMonthTimestampUTC: startMonthTimestampUTC,
            endMonthTimestampUTC: endMonthTimestampUTC,
        }

        socket.emit("join room", calendarData)
    });

    socket.on('add calendar event response', function(msg) {
        console.log("HEY")
        msg = $.parseJSON(msg)
        $("#date"+msg.day).empty()
        find_overlapping_dates(msg)
        create_calendar(msg)
    });

    socket.on('join room response', function(msg) {
        msg = $.parseJSON(msg)
        find_overlapping_dates(msg)
        create_calendar(msg)


    });

    // socket.on('leave room status', function(msg) {
    //     console.log(msg)
    // });
});






