function set_countable_class(elem,count)
{
  elem.attr('class').split(' ').filter(function(c){ return c.startsWith("countable-") }).forEach(function(e){ elem.removeClass(e)})
  elem.addClass("countable-"+count)
}
function set_count(day,count)
{
  day.count = count
  set_countable_class(day,count)
}
// What's today?
// subtract 4 hours so that posts late at night count for the previous day
var offset = 1000*60*60*4;
var today = new Date((new Date()) - offset)
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
// Set start to the first day of 6 months ago
var start = new Date(today)
start.setHours(0,0,0,0)
const num_months_before = 6
for(var i=0;i<num_months_before;i++)
{
  start.setDate(1)
  start.setMonth(start.getMonth()-1)
  start.setDate(1)
}
// Set end to the last day of 6 months forward
var end = new Date(today)
const num_months_after = 6
for(var i=0;i<num_months_after;i++)
{
  end.setDate(1)
  end.setMonth(end.getMonth()+1)
  end.setDate(1)
}
var date = new Date(start)
var cur_month = start.getMonth()-1
var month = null
var day_divs = []
while(date < end)
{
  if(cur_month !== date.getMonth())
  {
    // close up previous month
    if(month) { $('#top').append(month); }
    // instantiate new month
    var month = $('<div class=month >');
    cur_month = date.getMonth()
    console.log(months[date.getMonth()])
  }
  var day = $('<div class="day" >');
  set_count(day,0)
  month.append(day);
  day_divs.push(day)
  //day_divs[day_divs.length-1].text(
  //  ""+
  //  day_divs.length-1+","+
  //  Math.floor((date-start)/(1000*60*60*24)) )
  //if(day_divs.length-1 !=
  //  Math.floor((date-start)/(1000*60*60*24)) )
  //{
  //  break
  //}
  // Why can't I use this?
  // date.setDate(date.getDate() + 1)
  date.setUTCDate(date.getUTCDate() + 1);
}

// Today is selected
var selected = null
function get_day_index(date)
{
  return Math.floor((date-start)/(1000*60*60*24))
}
function get_day_div(date)
{
  return day_divs[get_day_index(date)]
}
function update()
{
  if($('#selected'))
  {
    $('#selected').removeAttr('id')
  }
  var day = get_day_div(selected)
  day.attr('id','selected')
  set_countable_class($('#bottomcenter'),day.count)
  $('#bottomcenter').text(day.count)
  //$('#bottomcenter').css("background-color",count_to_color(day.count))
  //$('#bottomcenter').css("color",count_to_color(day.count,0.0))
  //$('#bottomcenter').text(day.count)
}
selected = new Date(today)
update()
$('#bottomright').click(
  function()
  {
    selected.setUTCDate(selected.getUTCDate()+1)
    update()
  }
);
$('#bottomleft').click(
  function()
  {
    selected.setUTCDate(selected.getUTCDate()-1)
    update()
  }
);
$('#bottomcenter').click(
  function()
  {
    ledger.push(selected)
    ledger.sort()
    var day = get_day_div(selected)
    const max_count = 11
    const new_count = (day.count+1)%max_count
    if(new_count == 0)
    {
      // delete all ledger entries from this day
      ledger = ledger.filter(function(e){ return get_day_index(e) != get_day_index(selected) })
    }
    set_count(day, new_count)
    update()
    $.ajax({
            url: "save.php",
            type: "POST",
            data: { 'data': JSON.stringify(ledger,null,"  ")},
            //dataType: "JSON",
            success: function (response) {
              // response from php
              console.log("success: "+response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
  }
);

var ledger = []

$.getJSON('ledger.json',function(jd)
  { 
    ledger = jd.map(function(s){ return new Date(s)})
    replay_ledger()
    update()
  })

function replay_ledger()
{
  day_divs.forEach(function(day){ set_count(day,0) })
  ledger.forEach(function(date)
  {
    var day = get_day_div(date)
    if(day !== undefined)
    {
      set_count(day,day.count+1)
    }
  })
}


//for(var m = today.getMonth()-6;m<today.getMonth()+6;m++)
//{
//  var month = $('<div class=month id=m'+m+' >');
//  $('#top').append(month);
//}

//$( document ).ready(function()
//{
//  $.getJSON('counts.json', function(jd) {
//    counts = jd.counts;
//
//  /* get today */
//  var now = new Date();
//  var start = new Date(now.getFullYear(), 0, 0);
//  var diff = now - start;
//  var oneDay = 1000 * 60 * 60 * 24;
//  var day_of_the_year = Math.floor(diff / oneDay)-1;
//  sel = day_of_the_year;
//
//
//  //for(var i = 0;i< day_of_the_year;i++)
//  //{
//  //  counts[i] = Math.floor(Math.random() * (6 - 0) + 0);
//  //}
//  //for(var i = day_of_the_year+1;i<counts.length;i++)
//  //{
//  //  counts[i] = 0;
//  //}
//
//  var days_in_each_month = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//  {
//    var d = 0;
//    for(var i = 0;i<12;i++)
//    {
//      var month = $('<div class=month id=m'+i+' >');
//      for(var j = 0;j < days_in_each_month[i]; j++)
//      {
//        var day = $('<div class=day id=d'+d+' >');
//        var count = counts[d];
//        var eff_count = (count>=cmap.length?cmap.length-1:count);
//        day.css("background-color",rgb2string(cmap[ eff_count ]));
//        month.append(day);
//        d++;
//      }
//      $('#top').append(month);
//    }
//  }
//
//  function update_sel(sel_in)
//  {
//    $('#d'+sel).css('padding','1px');
//    $('#d'+sel).css('border','1px solid #555');
//    sel = sel_in;
//
//    $('#d'+sel).addClass('today');
//    $('#d'+sel).css('padding','0px');
//    $('#d'+sel).css('border','2px solid var(--todayb)');
//
//    var count = counts[sel];
//    var eff_count = (count>=cmap.length?cmap.length-1:count);
//    $('#bottomcenter').css("background-color",rgb2string(
//      cmap[eff_count]));
//    $('#bottomcenter').css("color",rgb2string(
//      cmap[eff_count].map(x => x * 0.8)
//    ));
//    $('#bottomcenter').text(count);
//    $('#d'+sel).css("background-color",rgb2string(
//      cmap[eff_count]));
//  };
//  function update_sel_count(count_in)
//  {
//    counts[sel] = count_in;
//    $.ajax({
//            url: "save.php",
//            type: "POST",
//      data: { 'data': JSON.stringify({'counts': counts})},
//            //dataType: "JSON",
//            success: function (response) {
//              // response from php
//              console.log("response: "+response);
//            },
//            error: function (jqXHR, textStatus, errorThrown) {
//                console.log(textStatus, errorThrown);
//            }
//        });
//  };
//  update_sel(sel);
//  $('#bottomcenter').click(
//    function()
//    {
//      update_sel_count( (counts[sel]+1)% 11 );
//      update_sel(sel);
//    }
//  );
//  $('#bottomright').click(
//    function()
//    {
//      update_sel((sel+1)%365);
//    }
//  );
//  $('#bottomleft').click(
//    function()
//    {
//      update_sel((sel-1)%365);
//    }
//  );
//
//  });
//  
//});
