var colors = {
    "仙Ⅱ": "#B0C4DE",
    "仙Ⅰ": "#87CEEB",
    "逸A": "#48D1CC",
    "逸B": "#D2B48C",
}

function clearTable() {
    $("#course_table tr").slice(1).each(function () {
        $("td", this).slice(1).each(function () {
            $(this).text("");
            $(this).removeAttr("bgcolor");
        })
    })
}

function changeWeek(offset) {
    var current_week = parseInt($("#week").val());
    if ((current_week <= 0 && offset < 0) || (current_week >= 20 && offset > 0))
        alert("周数不对了吧");
    else {
        $("#week").val(current_week + offset);
    }
}

function writeTable() {
    clearTable();
    toggleNoon();
    clearTable();
    var week = parseInt($("#week").val());
    var data = window.localStorage["course_table"];

    if (!data) {
        requireCourseTable();
    }
    data = JSON.parse(JSON.parse(data)["courses"])["data"];

    data.forEach(function (planList){
        planList["planList"].forEach(function (course){
            for (var i = 0;i<parseInt(course["length"]);i++){
                var current_time = parseInt(course["begin"])+i;
                var selector = "#course_table tr:eq({0}) td:eq({1})".format(current_time,course["xqj"]);
                $(selector).text(course["courseName"]);
                var building = course["roomName"].split("-")[0];
                var color = "#FFFFFF";
                if (building in colors) color = colors[building];
                $(selector).attr("bgcolor",color);
                $(selector).attr("onclick",'displayModal("{0}","{1}","{2}");'.format(course["courseName"], course["teacherName"], course["roomName"]));
            }

        })});

    toggleNoon();
    toggleUpdateIndicator();
}

function setCurrentWeek() {
     $("#week").val(window.localStorage["weeksInfo"].split('/')[0]);
     refresh();
}

function refresh() {
    toggleUpdateIndicator();
    window.localStorage['course_table'] = '';
    requireCourseTable();

}

function requireCourseTable() {
    var url = "/api/course_table";
    var week = $("#week").val();
    $.get(url, {"week":week}, function(data){
        window.localStorage["course_table"] = data;
        writeTable();
    }); //data is a form
}

function displayModal(name, teachers, location) {
    var dialog = $("#detailed");
    $("#name", dialog).text(name);
    $("#teachers", dialog).text("老师：" + teachers);
    $("#location", dialog).text("上课地点：" + location);
    dialog.modal();
}

function toggleNoon() {
    if ($("#noon").length === 0) {
        var tr = $("<tr></tr>", {
            class: "gradeA even",
            role: "row",
            id: "noon",
        });
        var td = $("<td></td>", {
            colspan: "8",
        });
        var p = $("<p></p>", {
            class: "text-center",
            text: "午休(12:00~2:00) 睡觉去！"
        });
        td.append(p);
        tr.append(td);
        $("#course_table tr:eq(4)").after(tr);
    }
    else {
        $("#noon").remove();
    }
}

function toggleUpdateIndicator(){
    $("#update_indicator").toggle();
}

setCurrentWeek();