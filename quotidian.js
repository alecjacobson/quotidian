function quotidian(ledger_address, max_count)
{
  function set_countable_class(elem,count)
  {
    elem.attr('class').split(' ').filter(function(c){ return c.startsWith("countable-") }).forEach(function(e){ elem.removeClass(e)})
    elem.addClass("countable-"+count)
  }
  function wait()
  {
    $('#bottomcenter').addClass("waiting")
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
    }
    var day = $('<div class="day" >');
    set_count(day,0)
    month.append(day);
    day_divs.push(day)
    // Why can't I use this?
    // date.setDate(date.getDate() + 1)
    date.setUTCDate(date.getUTCDate() + 1);
  }
  
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
    $('#bottomcenter').removeClass("waiting")
    if(max_count > 1) { $('#bottomcenter').text(day.count) }
  }
  $('#bottomright').click(
    function()
    {
      selected.setUTCDate(selected.getUTCDate()+1)
      update()
    }
  )
  $('#bottomleft').click(
    function()
    {
      selected.setUTCDate(selected.getUTCDate()-1)
      update()
    }
  )
  $('#bottomcenter').click(
    function()
    {

      ledger.push(new Date(selected))
      ledger.sort()
      var day = get_day_div(selected)
      const new_count = (day.count+1)%(max_count+1)
      if(new_count == 0)
      {
        // delete all ledger entries from this day
        ledger = ledger.filter(function(e){ return get_day_index(e) != get_day_index(selected) })
      }
      wait()
      $.ajax({
              url: "save.php",
              type: "POST",
              data: { 'ledger': JSON.stringify(ledger,null,"  ")},
              //dataType: "JSON",
              success: function (response) {
                console.log(response);
                // response from php
                if(response.includes("1 file changed"))
                {
                  set_count(day, new_count)
                  update()
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                  console.log(textStatus, errorThrown);
              }
          });
    }
  )
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
  // Today is selected
  var selected = null
  if(max_count === undefined)
  {
    max_count = 10
  }
  selected = new Date(today)
  update()
  var ledger = []
  $.getJSON(ledger_address,function(jd)
    { 
      ledger = jd.map(function(s){ return new Date(s)})
      replay_ledger()
      update()
    })
}
