var app = angular.module('Montecarlo', ['ngMaterial', 'ngMessages']);
app.controller('MontecarloCtrl', function ($scope, $window) {
    $scope.getArea = function () {
        $scope.inicializarVariables();
        $scope.graficarFx($scope.fx, $scope.xMin, $scope.xMax);
        for (var i = 0; i <= $scope.n; i++) {
            setTimeout(function (cantPuntos) {
                var puntoAleatorio = $scope.obtenerPuntoAleatorio();
                $scope.estaEnFuncion(puntoAleatorio);
                $scope.actualizarGraficoFx($scope.fx, $scope.xMin, $scope.xMax);
                $scope.calcularArea(cantPuntos);
                $scope.actualizarGraficoAreaVsN();
                $scope.puntosGenerados++;
            }, 300, i);
        }
    };

    $scope.inicializarVariables = function () {
        $scope.aciertosPositivos = {};
        $scope.aciertosPositivos.x = [];
        $scope.aciertosPositivos.y = [];
        $scope.aciertosPositivos.mode = 'markers';
        $scope.aciertosPositivos.marker = {};
        $scope.aciertosPositivos.marker.color = 'green'
        $scope.aciertosPositivos.type = 'scatter';
        $scope.aciertosPositivos.name = 'Aciertos positivos';

        $scope.aciertosNegativos = {};
        $scope.aciertosNegativos.x = [];
        $scope.aciertosNegativos.y = [];
        $scope.aciertosNegativos.mode = 'markers';
        $scope.aciertosNegativos.marker = {};
        $scope.aciertosNegativos.marker.color = 'orange'
        $scope.aciertosNegativos.type = 'scatter';
        $scope.aciertosNegativos.name = 'Aciertos negativos';

        $scope.errores = {};
        $scope.errores.x = [];
        $scope.errores.y = [];
        $scope.errores.marker = {};
        $scope.errores.marker.color = 'red'
        $scope.errores.mode = 'markers';
        $scope.errores.type = 'scatter';
        $scope.errores.name = 'Errores';

        $scope.puntosGenerados = 0;
        $scope.hits = 0;
        $scope.currentArea = 0;
        $scope.nParcial = [];
        $scope.areaParcial = [];
        $scope.realArea = 0;
    }

    $scope.graficarFx = function (fx, xMin, xMax) {
        try {
            const expr = math.compile(fx);
            $scope.mathFunction = expr;

            xMax = parseFloat(xMax) + parseFloat('0.01');
            const xValues = math.range(xMin, xMax, 0.1).toArray();

            console.log(expr);

            const yValues = xValues.map(function (x) {
                return expr.eval({ x: x });
            })

            const graficoFx = {
                x: xValues,
                y: yValues,
                type: 'scatter'
            };
            graficoFx.marker = {}
            graficoFx.marker.color = 'black'
            graficoFx.name = 'F(x)';

            $scope.yMax = math.max(yValues);
            $scope.yMin = math.min(yValues);

            const graficoRectangulo = $scope.obtenerRectangulo();
            const data = [graficoFx, graficoRectangulo, $scope.aciertosPositivos, $scope.aciertosNegativos, $scope.errores];

            setTimeout(function () {
                document.getElementById('area-container').classList.remove('d-none');
                document.querySelector('.inputs').classList.add('bg-blue');
            }, 300);

            Plotly.update('PlotFx', data);
        } catch (err) {

        }
    };

    $scope.obtenerPuntoAleatorio = function () {

        var x = Math.random() * ($scope.xMax - $scope.xMin) + parseInt($scope.xMin, 10);
        var y = Math.random() * ($scope.yMax - $scope.yMin) + parseFloat($scope.yMin);

        var point = {};
        point.x = x;
        point.y = y;

        return point;
    };

    $scope.estaEnFuncion = function (puntoAleatorio) {

        var fEnPuntoAleatorio = $scope.mathFunction.eval({ x: puntoAleatorio.x });

        if ((puntoAleatorio.y <= fEnPuntoAleatorio && puntoAleatorio.y >= 0)) {
            $scope.aciertosPositivos.x.push(puntoAleatorio.x);
            $scope.aciertosPositivos.y.push(puntoAleatorio.y);
            $scope.hits++;
        } else if ((puntoAleatorio.y >= fEnPuntoAleatorio && puntoAleatorio.y <= 0 && fEnPuntoAleatorio < 0)) {
            $scope.aciertosNegativos.x.push(puntoAleatorio.x);
            $scope.aciertosNegativos.y.push(puntoAleatorio.y);
            $scope.hits--;
        } else {
            $scope.errores.x.push(puntoAleatorio.x);
            $scope.errores.y.push(puntoAleatorio.y);
        }

    };

    $scope.actualizarGraficoFx = function (fx, xMin, xMax) {
        try {
            const expr = math.compile(fx);
            $scope.mathFunction = expr;

            xMax = parseFloat(xMax) + parseFloat('0.01');
            const xValues = math.range(xMin, xMax, 0.01).toArray();

            const yValues = xValues.map(function (x) {
                return expr.eval({ x: x });
            })

            const graficoFx = {
                x: xValues,
                y: yValues,
                type: 'scatter'
            };
            graficoFx.marker = {}
            graficoFx.marker.color = 'black'
            graficoFx.name = 'F(x)';

            const graficoRectangulo = $scope.obtenerRectangulo();
            const data = [graficoFx, graficoRectangulo, $scope.aciertosPositivos, $scope.aciertosNegativos, $scope.errores];

            Plotly.react('PlotFx', data);
        }
        catch (err) {

        }
    };

    $scope.calcularArea = function (cantPuntos) {

        var areaRectangulo = ($scope.xMax - $scope.xMin) * ($scope.yMax - $scope.yMin);

        var area = ($scope.hits / cantPuntos) * areaRectangulo

        $scope.nParcial.push(cantPuntos);
        $scope.areaParcial.push(area);
        $scope.currentArea = area.toFixed(4);
        $scope.$apply()
    };

    $scope.actualizarGraficoAreaVsN = function () {
        try {

            const puntosArea = {
                x: $scope.nParcial,
                y: $scope.areaParcial,
                type: 'scatter'
            };
            puntosArea.marker = {}
            puntosArea.marker.color = "orange"
            puntosArea.name = 'Area';

            const data = [puntosArea];

            Plotly.newPlot('PlotArea', data);
        }
        catch (err) {

        }
    };

    $scope.obtenerRectangulo = function () {
        const points = {};
        points.type = 'scatter';
        points.marker = {};
        points.marker.color = "purple";
        points.x = [$scope.xMin, $scope.xMin, $scope.xMax, $scope.xMax, $scope.xMin];
        points.y = [$scope.yMin, $scope.yMax, $scope.yMax, $scope.yMin, $scope.yMin];
        points.name = 'Rectángulo';

        return points;
    };

    $scope.reset = function () {
        $scope.hits = 0;
        $scope.nParcial = [];
        $scope.areaParcial = [];
        $scope.puntosGenerados = 0;
    };

    $scope.integral = function (min, max, fx, num) {
        const expr = math.compile(fx);
        $scope.mathFunction = expr;

        var sum = 0;
        var dx = (max - min) / num;
        var currentX = min + dx / 2;
        for (var i = 0; i < num; i++) {
            var currentY = expr.eval({x: currentX});

            sum += dx * currentY;
            currentX += dx;
        }
        return sum.toFixed(2);
    }

    $scope.reset();

    $scope.fx = '1-x';
    $scope.xMin = 0;
    $scope.xMax = 2;
    $scope.n = 100;
    $scope.currentArea = 0;
});