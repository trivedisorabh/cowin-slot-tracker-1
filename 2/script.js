/** Utility Methods */
function showLoader() {
    $('#loader').addClass("is-active");
}

function hideLoader() {
    setTimeout(() => { $('#loader').removeClass("is-active")}, 500);
}

function getTodaysDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '-' + mm + '-' + yyyy;
}

function playSound() {
    var audio = new Audio('audio.mp3');
    audio.play().then(() => {
        // document.getElementById('sound-permission-status').innerHTML = 'Current Audio Status: <span class="badge bg-success">Permission Granted</span>';
    }).catch(() => {
        // document.getElementById('sound-permission-status').innerHTML = 'Current Audio Status: <span class="badge bg-danger">Permission Required</span>';;
    });
}

/** Polling Methods */
function fetchState() {
    showLoader();
    fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/states`)
        .then((res) => (res.json()))
        .then((res) => {
            hideLoader();
            let selectHtmlStr = '';
            for(state of res.states) {
                selectHtmlStr += `<option value=${state.state_id}>${state.state_name}</option>`;
            }
            $('#state-select').html(selectHtmlStr);
            fetchDist(res.states[0].state_id);
        })
        .catch(() => {
            hideLoader();
            // TODO: Show error
        });
}

function fetchDist(stateId) {
    showLoader();
    fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`)
        .then((res) => (res.json()))
        .then((res) => {
            hideLoader();
            console.log('res: ', res);
            let selectHtmlStr = '';
            for(district of res.districts) {
                selectHtmlStr += `<option value=${district.district_id}>${district.district_name}</option>`;
            }
            $('#district-select').html(selectHtmlStr);
        })
        .catch(() => {
            hideLoader();
        });
}

function fetchCenters() {
    const today = getTodaysDate();
    const apiKey = "48m5Mhn2+YeoafuB11Lq1D5sm2af6A0seSIb6un+3/8=";
    var d = new Date();
    var n = d.toLocaleTimeString();
    const districtCode = $('#district-select').val();
    fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=${districtCode}&date=${today}`)
        .then((res) => (res.json()))
        .then((res) => {
            console.log('res: ', res);
        })
        .catch(() => {
            // TODO: Show error
        })
}

function startPolling() {
    playSound();
    fetchCenters();
    setInterval(fetchCenters, $('#polling-freq-select').val());
}

function onStateChange() {
    var stateId = $('#state-select').val();
    fetchDist(stateId);
}

$(document).ready(() => {
    fetchState();
});