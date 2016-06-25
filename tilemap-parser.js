var parseString = require('xml2js').parseString;
var fs = require('fs') || null;

var i = 2;
var url;
var width = 1136;
var height = 640;
while ( i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
    case '--url' :
    case '-u' :
        url = process.argv[i+1];
        i += 2;
        break;
    case '--width':
    case '-w' :
        width = parseInt(process.argv[i+1]);
        i += 2;
        break;
    case '--height':
    case '-h' :
        height = parseInt(process.argv[i+1]);
        i += 2;
        break;
    default:
        i++;
        break;
    }
}

if (url) {
    var str = fs.readFileSync(url, 'utf8');
    var polygons = [];
    parseString(str, function (err, result) {
        var polys = result.map.objectgroup[0].object;
        for (i = 0; i < polys.length; ++i) {
            var poly = polys[i];
            var x = parseInt(poly['$'].x);
            var y = parseInt(poly['$'].y);
            var pointstr = poly.polygon[0]['$'].points;
            var pts = pointstr.split(' ');
            for (var j = 0; j < pts.length; ++j) {
                pts[j] = pts[j].split(',');
                pts[j] = [
                    parseInt(pts[j][0]) + x,
                    parseInt(pts[j][1]) + y
                ];
            }
            polygons.push(pts);
        }

        console.log(JSON.stringify(polygons));
    });
}