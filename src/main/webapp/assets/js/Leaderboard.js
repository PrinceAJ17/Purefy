window.leaderboardFunctions = (function() {
  function getOrdinalIndicator(rank) {
    var j = rank % 10, k = rank % 100;
    if (j == 1 && k != 11) {
      return rank + "st";
    }
    if (j == 2 && k != 12) {
      return rank + "nd";
    }
    if (j == 3 && k != 13) {
      return rank + "rd";
    }
    return rank + "th";
  }

  function getMedalImage(rank) {
    switch (rank) {
      case 1: return "assets/images/GoldMedal.png";
      case 2: return "assets/images/SilverMedal.png";
      case 3: return "assets/images/BronzeMedal.png";
      default: return "";
    }
  }

  function getBadgeImage(points) {
    if (points >= 0 && points <= 10) {
      return "assets/images/Plant1.png";
    } else if (points > 10 && points <= 20) {
      return "assets/images/Plant2.png";
    } else if (points > 20 && points <= 30) {
      return "assets/images/Plant3.png";
    } else if (points >= 30 && points <= 40) {
      return "assets/images/Mountain1.png";
    } else if (points > 40 && points <= 50) {
      return "assets/images/Mountain2.png";
    } else if (points > 50 && points <= 60) {
      return "assets/images/Mountain3.png";
    } else if (points >= 60 && points <= 70) {
      return "assets/images/Planet1.png";
    } else if (points > 70 && points <= 80) {
      return "assets/images/Planet2.png";
    } else if (points > 80 && points <= 90) {
      return "assets/images/Planet3.png";
    } else if (points >= 90 && points <= 100) {
      return "assets/images/Galaxy1.png";
    } else if (points > 100 && points <= 110) {
      return "assets/images/Galaxy2.png";
    } else if (points > 110 && points <= 120) {
      return "assets/images/Galaxy3.png";
    }
    else {
      return "assets/images/Galaxy3.png";
    }
  }

  function populateLeaderboard(leaderboardData) {
    var leaderboard = document.querySelector('.leaderboard');
    if (!leaderboard)
      return;

    leaderboardData.sort(function (a, b) { return b.current - a.current; });

    while (leaderboard.firstChild) {
      leaderboard.removeChild(leaderboard.firstChild);
    }
    leaderboardData.slice(0, 6).forEach(function (entry, index) {
      var rank = index + 1;
      var ordinalIndicator = getOrdinalIndicator(rank);
      var medalImageSrc = getMedalImage(rank);
      var entryElement = document.createElement('div');
      entryElement.className = "".concat(ordinalIndicator);
      entryElement.innerHTML = "\n            \n            ".concat(medalImageSrc ? "<img src=\"".concat(medalImageSrc, "\" alt=\"Medal\" style=\"margin-left: 0\">") : '', "\n            <h3>").concat(ordinalIndicator, "</h3>\n            <div class=\"Avatar\">\n                <img src=\"assets/images/Avatar.png\" alt=\"\">\n                <div class=\"name\">").concat(entry.name, "</div>\n            </div>\n            <div class=\"bar\">\n                <div class=\"progress\">\n                    <div class=\"animation\">\n                        <h2>").concat(entry.current, "</h2>\n                    </div>\n                </div>\n            </div>\n        ");
      leaderboard.appendChild(entryElement);
    });
    var highestScore = leaderboardData[0] ? leaderboardData[0].current : 0;
    leaderboardData.slice(0, 6).forEach(function (entry, index) {
      var progressWidth = (entry.current / highestScore) * 100;
      var entryElement = leaderboard.children[index];
      var progressBar = entryElement.querySelector('.progress');
      progressBar.style.width = "".concat(progressWidth, "%");
    });
  }



  function populatePreviousLeaderboard(leaderboardData) {
    var leaderboard = document.querySelector('.pleaderboard');
    if (!leaderboard)
      return;

    leaderboardData.sort(function (a, b) { return b.previous - a.previous; });


    while (leaderboard.firstChild) {
      leaderboard.removeChild(leaderboard.firstChild);
    }
    leaderboardData.slice(0, 3).forEach(function (entry, index) {
      var rank = index + 1;
      var ordinalIndicator = getOrdinalIndicator(rank);
      var medalImageSrc = getMedalImage(rank);
      var entryElement = document.createElement('div');
      entryElement.className = "".concat(ordinalIndicator);
      entryElement.innerHTML = `
      ${medalImageSrc ? `<img src="${medalImageSrc}" alt="Medal" style="margin-left: 0">` : ''}
      <div class="Avatar">
        <img src="assets/images/Avatar.png" alt="">
        <div class="name">${entry.name}</div>
      </div>
      <div class="bar">
        <div class="progress" style="width: 100%">
          <div class="animation">
            <h2>${entry.previous}</h2>
          </div>
        </div>
      </div>
    `;
      leaderboard.appendChild(entryElement);
    });
    var highestScore = leaderboardData[0] ? leaderboardData[0].previous : 0;
    leaderboardData.slice(0, 3).forEach(function (entry, index) {
      var progressWidth = (entry.previous / highestScore) * 100;
      var entryElement = leaderboard.children[index];
      var progressBar = entryElement.querySelector('.progress');
      progressBar.style.width = "".concat(progressWidth, "%");
    });
  }




  function populateOverallLeaderboard(leaderboardData) {
    var leaderboard = document.querySelector('.oleaderboard');
    if (!leaderboard)
      return;

    leaderboardData.sort(function (a, b) { return b.total - a.total; });

    while (leaderboard.firstChild) {
      leaderboard.removeChild(leaderboard.firstChild);
    }

    var topbox = document.createElement('div');
    topbox.className = 'topbox';

    var bottombox = document.createElement('div');
    bottombox.className = 'bottombox';

    leaderboardData.forEach(function(entry, index) {
      var rank = index + 1;
      var ordinalIndicator = getOrdinalIndicator(rank);
      var medalImageSrc = getMedalImage(rank);

      var entryElement = document.createElement('div');
      entryElement.className = ordinalIndicator;

      var avatarDiv = document.createElement('div');
      avatarDiv.className = 'Avatar';
      avatarDiv.innerHTML = `
            <img src="assets/images/Avatar.png" alt="">
            <div class="name">${entry.name}</div>
        `;

      var pointsDiv = document.createElement('div');
      pointsDiv.className = 'points';
      pointsDiv.textContent = entry.total;

      entryElement.appendChild(avatarDiv);
      entryElement.appendChild(pointsDiv);

      if (index === 0) {
        topbox.appendChild(entryElement);
      } else if (index < 3){
        bottombox.appendChild(entryElement);
      } else{

      }
    });

    leaderboard.innerHTML = '';
    leaderboard.appendChild(topbox);
    leaderboard.appendChild(bottombox);
  }

function populateYourGroup (){
    var teamname = "Team 13"
    var code = '12345'
    var totalPoints = 40;
    var yourGroup = document.querySelector('.your-group');
    if (!yourGroup)
      return;

    while (yourGroup.firstChild) {
      yourGroup.removeChild(yourGroup.firstChild);
    }

    var nameBadge = document.createElement('div');
    nameBadge.className = 'nameBadge';


    var teamName = document.createElement('div');
    teamName.className = 'teamName'
    teamName.innerHTML = '<h1>'+ teamname +'\n <br><P>'+ code +'</P>\n </h1>';

    var badge = document.createElement('div');
    badge.className = 'Badge'
    badge.innerHTML = '<img src="' + getBadgeImage(totalPoints) + '" alt="">';

    nameBadge.appendChild(teamName);
    nameBadge.appendChild(badge);


    var Points = document.createElement('div');
    Points.className = 'Points';
    Points.innerHTML = ' <h3>Total Weekly Points:</h3>\n <h3>' + totalPoints + '</h3>\n <h3>Next Badge:</h3>\n <img src="'+ getBadgeImage(totalPoints+10) +'" alt="">';

    var Buttons = document.createElement('div');
    Buttons.className = 'Buttons';
    Buttons.innerHTML = '<button class="deleteGroupButton">Delete Group</button>\n <button class="leaveGroupButton">Leave Group</button>'


    yourGroup.appendChild(nameBadge);
    yourGroup.appendChild(Points);
    yourGroup.appendChild(Buttons);


}

  function loadCss() {
    const link = document.createElement('link');
    link.href = 'assets/css/leaderboard';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  return {
    populateLeaderboard: populateLeaderboard,
    populatePreviousLeaderboard: populatePreviousLeaderboard,
    populateOverallLeaderboard: populateOverallLeaderboard,
    populateYourGroup: populateYourGroup,
    loadCss: loadCss
  };
})();

