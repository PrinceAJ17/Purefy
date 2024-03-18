// Function to determine the ordinal indicator for a given rank
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
// Function to get the medal image source based on rank
function getMedalImage(rank) {
    switch (rank) {
        case 1: return "assets/images/GoldMedal.png";
        case 2: return "assets/images/SilverMedal.png";
        case 3: return "assets/images/BronzeMedal.png";
        default: return "";
    }
}
var leaderboardData = [
    { name: "Sam", score: 13 },
    { name: "Allen", score: 11 },
    { name: "Asa", score: 10 },
    { name: "Ankita", score: 9 },
    { name: "Adnaan", score: 8 },
    { name: "Prince", score: 7 },
];
document.addEventListener('DOMContentLoaded', function () {
    var leaderboard = document.querySelector('.leaderboard');
    if (!leaderboard)
        return;
    // Sort the data based on scores in descending order
    leaderboardData.sort(function (a, b) { return b.score - a.score; });
    // Remove existing entries to prevent duplication
    while (leaderboard.firstChild) {
        leaderboard.removeChild(leaderboard.firstChild);
    }
    leaderboardData.forEach(function (entry, index) {
        var rank = index + 1;
        var ordinalIndicator = getOrdinalIndicator(rank);
        var medalImageSrc = getMedalImage(rank);
        var entryElement = document.createElement('div');
        entryElement.className = "entry ".concat(ordinalIndicator);
        entryElement.innerHTML = "\n            \n            ".concat(medalImageSrc ? "<img src=\"".concat(medalImageSrc, "\" alt=\"Medal\" style=\"margin-left: 0\">") : '', "\n            <h2>").concat(ordinalIndicator, "</h2>\n            <div class=\"Avatar\">\n                <img src=\"assets/images/Avatar.png\" alt=\"\">\n                <div class=\"name\">").concat(entry.name, "</div>\n            </div>\n            <div class=\"bar\">\n                <div class=\"progress\">\n                    <div class=\"animation\">\n                        <h2>").concat(entry.score, "</h2>\n                    </div>\n                </div>\n            </div>\n        ");
        leaderboard.appendChild(entryElement);
    });
    var highestScore = leaderboardData[0].score;
    leaderboardData.forEach(function (entry, index) {
        var progressWidth = (entry.score / highestScore) * 100;
        var entryElement = leaderboard.children[index];
        var progressBar = entryElement.querySelector('.progress');
        progressBar.style.width = "".concat(progressWidth, "%");
    });
});
