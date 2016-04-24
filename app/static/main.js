var CalendarModule = (function () {
    var calendarObj = {};
    calendarObj.now = moment();
    calendarObj.display_date = calendarObj.now;


    calendarObj.addMonth = function () {
        calendarObj.display_date = calendarObj.display_date.add(1, 'months')
        calendarObj.getDaysInMonth()
    }

    calendarObj.subtractMonth = function () {
        calendarObj.display_date = calendarObj.display_date.add(-1, 'months')
    }

    calendarObj.getDaysInMonth = function () {
        calendarObj.display_days_in_month = calendarObj.display_date.daysInMonth()
    }

    calendarObj.getstartOfMonth = function () {
        calendarObj.startOfMonth = calendarObj.display_date.clone().startOf('month')
        calendarObj.startOfMonth = moment(calendarObj.startOfMonth).format("d")
    }

    calendarObj.getendOfMonth = function () {
        calendarObj.endOfMonth = calendarObj.display_date.clone().endOf('month')
        calendarObj.endOfMonth = moment(calendarObj.endOfMonth).format("D")
    }
    calendarObj.getDaysInMonth();
    calendarObj.getstartOfMonth();
    calendarObj.getendOfMonth();
    return calendarObj

})();

function builDaysOfWeek() {
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", 
        "Wednesday", "Thursday", "Friday", "Saturday"];
    calendarDays = "<div class='row row--calendar'>"

    for( var i=0; i < daysOfWeek.length; i++) {

      calendarDays += "<div class='col-md-1'> "+daysOfWeek[i] +"</div>"
    }

    calendarDays += "</div>"

    return calendarDays
}

function buildCalendar() {
  var day = 1;
  var total = 0;
  var calendar = "";
  var total_time = CalendarModule.display_days_in_month + (CalendarModule.startOfMonth-1)

  for(var i=0; i < 6; i++) {
    calendar += "<div class='row row--calendar'>"
    
    for(var j=0; j<7; j++) {
        if (total >= CalendarModule.startOfMonth && total <= total_time){
            calendar += "<div class='col-md-1'>"+ day +"</div>";
            day++
        } else {
            calendar += "<div class='col-md-1'></div>";
        }
        total++
    }
    calendar += "</div>";
  }
  return calendar;
}

$('#calendar').html(buildCalendar())
$('#calendar-days').html(builDaysOfWeek())

$('#calendar-title').text(moment(CalendarModule.now).format("MMMM YYYY"));


$('#nextMonth').on('click', function () {
    CalendarModule.addMonth();
    CalendarModule.getDaysInMonth();
    CalendarModule.getstartOfMonth();
    $("#calendar").empty()
    $('#calendar').html(buildCalendar())

    $('#calendar-title').text(moment(CalendarModule.display_date).format("MMMM YYYY"));
});

$('#prevMonth').on('click', function () {
    CalendarModule.subtractMonth();
    CalendarModule.getDaysInMonth();
    CalendarModule.getstartOfMonth();
    $("#calendar").empty()
    $('#calendar').html(buildCalendar())

    $('#calendar-title').text(moment(CalendarModule.display_date).format("MMMM YYYY"));
});

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

