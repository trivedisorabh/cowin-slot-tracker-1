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

function showError(errorStr) {
    $('#error-msg').text(errorStr);
    $('#error-msg').removeClass('hide');
}

function hideError() {
    $('#error-msg').text("");
    $('#error-msg').addClass('hide');
}

/** Fetching Methods */
function fetchState() {
    showLoader();
    fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/states`)
        .then((res) => (res.json()))
        .then((res) => {
            hideError();
            hideLoader();
            let selectHtmlStr = '';
            for(state of res.states) {
                if (state.state_id === 21) {
                    selectHtmlStr += `<option value=${state.state_id} selected>${state.state_name}</option>`;
                } else {
                    selectHtmlStr += `<option value=${state.state_id}>${state.state_name}</option>`;
                }
            }
            $('#state-select').html(selectHtmlStr);
            fetchDist(21);
        })
        .catch(() => {
            showError('Error fetching states from the API. Try refreshing the page.');
            hideLoader();
        });
}

function fetchDist(stateId) {
    showLoader();
    fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`)
        .then((res) => (res.json()))
        .then((res) => {
            hideError()
            hideLoader();
            let selectHtmlStr = '';
            for(district of res.districts) {
                if(district.district_id === 363) {
                    selectHtmlStr += `<option value=${district.district_id} selected>${district.district_name}</option>`;
                } else {
                    selectHtmlStr += `<option value=${district.district_id}>${district.district_name}</option>`;
                }
            }
            $('#district-select').html(selectHtmlStr);
        })
        .catch(() => {
            showError('Error fetching districts from the API. Try refreshing the page.');
            hideLoader();
        });
}

function fetchCenters() {
    showLoader();
    const today = getTodaysDate();
    const apiKey = "48m5Mhn2+YeoafuB11Lq1D5sm2af6A0seSIb6un+3/8=";
    var d = new Date();
    var n = d.toLocaleTimeString();
    const districtCode = $('#district-select').val();
    fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=${districtCode}&date=${today}`)
        .then((res) => (res.json()))
        .then((res) => {
            hideError();
            console.log('res: ', res);
            hideLoader();
        })
        .catch(() => {
            const freq = $('#polling-freq-select option:selected').text();
            showError(`Error fetching centers from the API. Retrying in ${freq}... You can also press Start Button again to retry immediately. `);
            hideLoader();
        })
}

/** Polling Methods */
let appInterval;
function startPolling() {
    playSound();
    fetchCenters();
    if(appInterval) clearInterval(appInterval);
    appInterval = setInterval(fetchCenters, $('#polling-freq-select').val());
    $('#stop-btn').removeClass('hide');
}

function stopPolling() {
    clearInterval(appInterval);
    $('#stop-btn').addClass('hide');
    hideError();
}

function onStateChange() {
    var stateId = $('#state-select').val();
    fetchDist(stateId);
}

$(document).ready(() => {
    fetchState();
});