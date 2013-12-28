(function ($) {
    $(document).ready(function () {


        var generatePoints = function (numberOfPoints, angleStep, roughness, totalDistance, layerHeight) {
                var hDistance = totalDistance/numberOfPoints,
                    maxAngle = roughness * 90,
                    angles = Math.floor(maxAngle / angleStep),
                    steps = [],
                    base = angles * angleStep,
                    coords = [],
                    _h = Math.floor( Math.random() * ( layerHeight - 100 ) ),
                    _w = 0;

                coords.push([_w, _h]);
                for (var i = angles * 2; i >= 0; i--) {
                    // console.log(i); // 4, 3, 2, 1, 0
                    // 0 + angles * 2 * angleStep - i*angleStem
                    steps.push( base - (i * angleStep) );
                };




                for (var i = numberOfPoints - 1; i >= 0; i--) {

                    // get random angle
                    var _index = Math.ceil(Math.random() * steps.length-1);
                    var angle = steps[_index];
                    var rad = angle * Math.PI/180;
                    var vDistance = Math.round( Math.tan(rad) * hDistance * 100 ) / 100;

                    console.log('orig', i, vDistance + _h, layerHeight );
                    while( vDistance + _h > layerHeight - 100 || vDistance + _h < 100) {
                        //  || vDistance + _h < 100
                        _index = Math.ceil(Math.random() * steps.length-1);
                        angle = steps[_index];
                        rad = angle * Math.PI/180;
                        vDistance = Math.round( Math.tan(rad) * hDistance * 100 ) / 100;
                        console.log('recalc', i, vDistance + _h);
                    }


                    _h += vDistance;
                    _w += hDistance;
                    var coord = [_w, _h];
                    console.log(coord);
                    // var coord = {
                    //     'rads': rad,
                    //     'angles': angle,
                    //     'vertical': vDistance,
                    //     'horizontal': hDistance,
                    //     'y': _h,
                    //     'x': _w
                    // };
                    coords.push(coord);

                };
                return coords;
                // console.table(coords);
                // tanA = opposite / adjacent
                // I have A, adjacent
                // opposite = tanA * adjacent
                // ajdcent = hDistance
            },
            stage = new Kinetic.Stage({
                container: 'canvas',
                width: $(window).width(),
                height: 500
            }),
            layer = new Kinetic.Layer(),
            simpleText = new Kinetic.Text({
                x: stage.getWidth() - 200,
                y: 0,
                text: '0',
                fontSize: 30,
                fontFamily: 'Arial',
                fill: 'white',
                width: 200
            }),

            rect = new Kinetic.Rect({
                x: 45,
                y: 20,
                width: 30,
                height: 30,
                fill: 'white',
                stroke: 'black',
                strokeWidth: 1
            }),

            line = new Kinetic.Line({
                points: generatePoints(20, 12, 0.9, stage.getWidth(), stage.getHeight()),
                stroke: 'black',
                strokeWidth: 4,
                id: 'surface',
                x: 0,
                y: 50
            }),
            writeMessage = function (message) {
                simpleText.setText(message);
                layer.batchDraw();
            },
            timer = null,
            hVelocity = 0,
            vVelocity = 0,
            down = [];


        // add the shape to the layer
        // layer.add(rect, circle);
        layer.add(rect);
        // layer.add(circle);
        // add the layer to the stage
        layer.add(line);
        layer.add(simpleText);

        stage.add(layer);


        $(document).keydown(function(e) {
            // console.log(e.which);
            down[e.keyCode] = true;
            if(e.keyCode === 32) {
                if( anim.isRunning()) {
                    anim.stop();
                } else {
                    anim.start();
                }

            }
        }).keyup(function(e) {

            down[e.keyCode] = false;
        });




        var anim = new Kinetic.Animation(function(frame) {
            vVelocity += 0.02;


            if(down['37']) {
                hVelocity -= 0.02;
            }

            if(down['39']) {
                hVelocity += 0.02;
            }

            if(down['38']) {
                vVelocity -= 0.04;
            }


            var p = rect.getPosition(),

                bottomLeft = { x: p.x -1, y: p.y + rect.getHeight() + 1 },
                bottomRight = { x: p.x + rect.getWidth() + 1, y: p.y + rect.getHeight() + 1 },

                bottomLeftIntersects = stage.getIntersection(bottomLeft),
                bottomRightIntersects = stage.getIntersection(bottomRight),
                shapeLeft = false,
                shapeRight = false;


            if(bottomLeftIntersects !== null) {
                if(bottomLeftIntersects.shape !== undefined) {
                    if(bottomLeftIntersects.shape.getId() === 'surface') {
                        shapeLeft = true;
                    }

                }
            }

            if(bottomRightIntersects !== null) {
                if(bottomRightIntersects.shape !== undefined) {
                    if(bottomRightIntersects.shape.getId() === 'surface') {
                        shapeRight = true;
                    }
                }
            }


            if(shapeLeft || shapeRight) {
                if( shapeLeft && shapeRight && vVelocity < 0.5) {
                    console.log('landed');
                    alert('landed');
                    anim.stop();
                } else {
                    console.log('crashed');
                    alert('you crashlanded... derp');
                    anim.stop();
                }
            }

            // if(bottomLeftIntersects.hasOwnProperty('shape')){
            //     console.log(bottomLeftIntersects);
            // }


            writeMessage('x: ' + Math.floor(p.x) + ' y: ' + Math.floor(p.y) + ' vv: ' + vVelocity);
            rect.move(hVelocity, vVelocity);

        }, layer);

        anim.start();

    });
}(jQuery));
