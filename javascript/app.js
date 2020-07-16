$('document').ready(function () {
    $("#start-datepicker").datepicker({ dateFormat: 'yy-mm-dd' });
    $("#end-datepicker").datepicker({ dateFormat: 'yy-mm-dd' });

    navigator.geolocation.getCurrentPosition(function (position) {
        const lon = position.coords.longitude;
        const lat = position.coords.latitude;

        console.log(lat, lon);
        let apikey = 'cc5ff5524ad449ad9cd3d2a5117d86a2'

        let request_url = 'https://api.opencagedata.com/geocode/v1/json'
            + '?'
            + 'key=' + apikey
            + '&q=' + encodeURIComponent(lat + ',' + lon)
            + '&pretty=1'
            + '&no_annotations=1';
        $.ajax({
            url: request_url,
            method: 'GET',
            data: {
                'key': 'cc5ff5524ad449ad9cd3d2a5117d86a2',
                'no_annotations': 1
            },
            dataType: 'json',
            statusCode: {
                200: function (response) {  // success
                    console.log(response.results[0].formatted);
                    console.log(response.results[0].components.city);
                    $("#city").val(response.results[0].components.city);
                },
            }
        });
    });

    $("#submitButton").on("click", function (e) {
        e.preventDefault();
        let city = $("#city").val();
        $("#city").val('');
        let startDate = $("#start-datepicker").val().toString();
        let endDate = $("#end-datepicker").val().toString();
        $("#start-datepicker").val('');
        $("#end-datepicker").val('');
        if (startDate && startDate != "") {
            startDate += 'T00:00:00Z'
        }
        if (endDate && endDate != "") {
            endDate += 'T23:59:59Z'
        }
        console.log(startDate, endDate, 'here');

        const tm_apiKey = 'D7i9n1cTYfGDAQL6k8jh2WywiMrh72pX';
        const tm_url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${tm_apiKey}&city=${city}&size=30&startDateTime=${startDate}&endDateTime=${endDate}`
        $.ajax({
            url: tm_url,
            method: 'GET',
            dataType: "json"
        }).then((response) => {
            console.log('success', tm_url);
            let localEvents = response._embedded.events;
            $("#dynamic-tbody").empty();
            localEvents.forEach((evt) => {
                newRow = $('<tr>');
                newRow.html(`<td>${evt.name}</td>
                <td><img class="img" src=${evt.images[8].url} style="height:50px; width:50px"></td>  
                    <td>${evt._embedded.venues[0].name}</td>
                    <td>${evt.classifications[0].segment.name}</td>                
                    <td>${evt.dates.start.dateTime}</td>
                    <td style="text-align:center"><a href="${evt.url}" target="_blank"><i class="fas fa-ticket-alt"></i></a></td>`
                )
                console.log(evt.images[8].url);

                $("#dynamic-tbody").append(newRow);
            })
        })
    })
});