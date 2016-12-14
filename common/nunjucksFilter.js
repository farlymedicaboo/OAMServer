module.exports = {
	toTime: function(str) {
	    var res = str.toString();

	    if (res.length == 3) {
	        res = ("0" + res).split("");
	    } else if (res.length == 4) {
	        res = res.split("");
	    }

	    res.splice(2, 0, ':');
	    return res.join("");
	}
};