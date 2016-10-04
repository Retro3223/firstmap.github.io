// TODO: Comments needed in this file.

// Add your team to this list when you've put an icon in /logos!
var icons = [
	2626,
	1452,
	4924,
	1418,
	171,
	1982,
	2370,
	2403,
	2412,
	2848,
	5113,
	5115,
	 236,
	4150,
	5482,
	5859,
	4909,
	2827,
	1108,
	1058,
	2855,
	548,
	3928,
	3015,
	5431
];


// Is your team's location wrong?  Add your team and coordinates to this object to update their correct coordinates manually
var updatedLocations = {
	2403: {lat:33.434551, lng:-111.672356}
}

var map;
var teamMarkers = []
var regionalMarkers = []
var districtMarkers = []

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 30,
			lng: 0
		},
		zoom: 2,
		disableDefaultUI: true,
		zoomControl: true,
		mapTypeControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: true,
		styles: [{
			featureType: 'water',
			elementType: 'geometry',
			stylers: [{
				color: '#193341'
			}]
		}, {
			featureType: 'landscape',
			elementType: 'geometry',
			stylers: [{
				color: '#2c5a71'
			}]
		}, {
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{
				color: '#29768a'
			}, {
				lightness: -37
			}]
		}, {
			featureType: 'poi',
			elementType: 'geometry',
			stylers: [{
				color: '#406d80'
			}]
		}, {
			featureType: 'transit',
			elementType: 'geometry',
			stylers: [{
				color: '#406d80'
			}]
		}, {
			elementType: 'labels.text.stroke',
			stylers: [{
				visibility: 'on'
			}, {
				color: '#3e606f'
			}, {
				weight: 2
			}, {
				gamma: 0.84
			}]
		}, {
			elementType: 'labels.text.fill',
			stylers: [{
				color: '#ffffff'
			}]
		}, {
			featureType: 'administrative',
			elementType: 'geometry',
			stylers: [{
				weight: 0.6
			}, {
				color: '#1a3541'
			}]
		}, {
			elementType: 'labels.icon',
			stylers: [{
				visibility: 'off'
			}]
		}, {
			featureType: 'poi.park',
			elementType: 'geometry',
			stylers: [{
				color: '#2c5a71'
			}]
		}]
	});

	for (i = 0; i < teams.length; i++) {
		createMarker(coordinates[i], teams[i]);
	}

	for (i=0; i < regionals.length; i++) {
		createCompetitionMarker("regional", regionals[i]);
	}

	for (i=0; i < districts.length; i++) {
		createCompetitionMarker("district", districts[i]);
	}
}

function createCompetitionMarker(type, competitionEntry) {
	if(competitionEntry){
		pos = {
			lat: (type == 'regional') ? competitionEntry[1].lat : competitionEntry[2].lat,
			lng: (type == 'regional') ? competitionEntry[1].lng : competitionEntry[2].lng
		};

		var marker = new google.maps.Marker({
			position: pos,
			map: map,
			title: competitionEntry[0],
			icon: (type == 'district') ? 'district.png' : 'regional.png'
		});

		google.maps.event.addListener(marker, 'click', function() {
			openCompInfo(type, competitionEntry, marker);
		});

		if(type=='regional'){
			regionalMarkers.push(marker);
		} else {
			districtMarkers.push(marker);
		}

		return marker
	}
}

function createMarker(pos, t) {
	if (pos) {
		if (t in updatedLocations) {
			pos = {
				lat: updatedLocations[t].lat,
				lng: updatedLocations[t].lng
			};
		} else {
			pos = {
				lat: pos.lat + ((Math.random() / 100) * ((Math.random() >= 0.5) ? -1 : 1)),
				lng: pos.lng + ((Math.random() / 100) * ((Math.random() >= 0.5) ? -1 : 1))
			};
		}

		var marker = new google.maps.Marker({
			position: pos,
			map: map,
			title: t + '',
			icon: (icons.indexOf(t) != -1) ? 'logos/' + t + '.png' : 'marker.png'
		});

		google.maps.event.addListener(marker, 'click', function() {
			openInfo(t, marker);
		});

		teamMarkers.push(marker);

		return marker;
	}
}

function openCompInfo(type, entry, marker) {
	var content = '<h1>';
	content += (type == 'regional') ? entry[0] : entry[1];
	content += '</h1>';

	if(type=='district') {
		content += '<h2 style="text-align: center; font-weight: normal; padding-bottom: 10px;">'
		content += entry[0]
		content += '</h2>'
	}

	content += '<h3 style="text-align: center; font-weight: normal;"">Week ';
	content += (type == 'regional') ? entry[2] : entry[3];
	content += '</h3>';

	try {
		var oldInfoWindow = document.getElementsByClassName('gm-style-iw')[0];
		oldInfoWindow.parentNode.parentNode.removeChild(oldInfoWindow.parentNode);
	} catch (e) {}
	var infoWindow = new google.maps.InfoWindow({
		content: content
	});
	infoWindow.open(map, marker);
}

function openInfo(num, marker) {
	var req = new XMLHttpRequest();
	req.open('GET', 'https://www.thebluealliance.com/api/v2/team/frc' + num + '?X-TBA-App-Id=erikboesen:frcmap:v1.0');
	req.send();
	req.onreadystatechange = function() {
		if (req.readyState === 4 && req.status === 200) {
			var team = JSON.parse(req.responseText);
			var content = '<h1>';
			content += team.website ? '<a href="' + team.website + '">' : '';
			content += 'Team ' + team.team_number;
			content += team.nickname ? ' - ' + team.nickname : '';
			content += team.website ? '</a></h1>' : '</h1>';
			content += team.motto ? '<p><em>"' + team.motto + '"</em></p>' : '';
			content += '<ul>';
			content += '<li><strong>Location:</strong> ' + team.location + '</li>';
			content += team.rookie_year ? '<li><strong>Rookie year:</strong> ' + team.rookie_year + '</li>' : '';
			content += '<li><a href="http://thebluealliance.com/team/' + num + '">View on The Blue Alliance</a></li>';
			content += '</ul>';
			try {
				var oldInfoWindow = document.getElementsByClassName('gm-style-iw')[0];
				oldInfoWindow.parentNode.parentNode.removeChild(oldInfoWindow.parentNode);
			} catch (e) {}
			var infoWindow = new google.maps.InfoWindow({
				content: content
			});
			infoWindow.open(map, marker);
		}
	};
}
