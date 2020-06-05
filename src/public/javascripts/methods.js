$(function() {

    $('.choise-method select').change(function() {
        $('.choise-method').hide();
        
        var $selectedMethod = $('.choise-method select option:selected').attr('id');    

        if ($selectedMethod === 'walda') {
            methodWalda();
        } else if ($selectedMethod === 'regret') {
            methodRegret();
        } else if ($selectedMethod === 'hurwitz') {
            methodHurwitz();
        }
    });

    var $visitorsTable = null,
        $visitors = null;

    function initializeMethod(methodName) { 
        $('#first-step form h3').append('Метод ' + methodName);
        $('#first-step').show();
    }

    function hideInitializeMethod() {
        $('#first-step').hide();
        $('#second-step').show(); 
    }

    function showVisitorsTable() {
        $('#button-strategies').on('click', function() {
            var $strategiesCount = parseInt($('#strategies-count').val());
            if (isNaN($strategiesCount) || $strategiesCount < 1 || $strategiesCount > 10) return;

            var visitors = $('#visitors');
            visitors.empty();
            visitors.show();

            visitors.append('<p>Введите посещаемость театра для каждой из стратегий: </p>');

            var tableContent = '<table>';
            tableContent += '<tbody>';

            tableContent += '<tr>';
            for (var i = 0; i < $strategiesCount; i++) {
                tableContent += '<td><input type="number" required></td>';
            }
            tableContent += '</tr>';

            tableContent += '</tbody>';
            tableContent += '</table>';

            visitors.append(tableContent); 
        });
    }

    function sendingRequest(doneCallBack, endpoint) {
        var $buyersPercent = parseInt($("#buyers-percent").val());
        var $strategiesCount = parseInt($('#strategies-count').val());
        
        var payload = {
            'visitors': $visitors,
            'buyersPercent': $buyersPercent
        };

        $.ajax({
            url: endpoint, 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify(payload),
        }).done(doneCallBack);
    }

    function handleContinueButton(handleCallback, endpoint) {
        $('#continue-step').on('click', function (event) {
            event.preventDefault();

            $visitorsTable = $('#visitors table');
            $visitors = $.map($visitorsTable.find('input'), (val, i) => parseInt(val.value));

            sendingRequest(handleCallback, endpoint);
        });
    }

    function methodWalda() {
        initializeMethod('Вальда');
        showVisitorsTable();
        
        function populateTableScore(response) {
            var $scoreTable = $('.score-table');
            $scoreTable.empty();
            
            var tableContent = '<table>';

            tableContent += '<thead>';
            tableContent += '<tr>';
            tableContent += '<th>Количество посетителей</th>';
            $.each($visitors, (index, value) => {
                tableContent += '<th>' + value + '</th>';
            });
            tableContent += '</tr>';
            tableContent += '<tr>';
            tableContent += '<th>Стратегии театра/Количество покупателей программок</th>';
            $.each(response.audienceTheater, (index, value) => {
                tableContent += '<th>B' + (index + 1) + ' ' + value + '</th>';
            });
            tableContent += '</tr>';
            tableContent += '</thead>';
            
            tableContent += '<tbody>';

            $.each(response.audienceTheater, (index, value) => {
                tableContent += '</tr>';
                tableContent += '<th>A' + (index + 1) + ' ' + value + '</th>';
                $.each(response.priceTableProfit[index], (index, value) => {
                    tableContent += '<td>' + value + '</td>';
                });
                tableContent += '</tr>';
            });
            
            tableContent += '</tbody>';
            tableContent += '</table>';

            $scoreTable.append(`
                <p>
                    По критерию Вальда за оптимальную принимается чистая стратегия, которая в 
                    наихудших условиях гарантирует максимальный выигрыш, т.е. a = max(min aij)
                </p>
            `);

            $scoreTable.append(tableContent);
            
            $scoreTable.append(`
                <p>
                    Выбираем из ` + `(` + response.minPriceProfitInRows.toString() + `) ` 
                    +  `макcимальный элемент, т.е max = ` + response.optimalStrategie +`
                </p>
            `);
            
            $scoreTable.append(`
                <p>
                    <strong>Вывод:</strong> по критерию Вальда оптимальной является стратегия № ` + response.optimalStrategieNumber + `, 
                    театру необходимо заказать ` + response.audienceTheater[response.optimalStrategieNumber - 1] + ` программок 
                </p>
            `);
        }

        handleContinueButton((response) => {
            hideInitializeMethod();
            populateTableScore(response);
        }, '/api/walda');
    }

    function methodRegret() {
        initializeMethod('Сэвиджа');
        showVisitorsTable();
        
        function populateTableScore(response) {
            var $scoreTable = $('.score-table');
            $scoreTable.empty();
            
            var tableContent = '<table>';

            tableContent += '<thead>';
            tableContent += '<tr>';
            tableContent += '<th>Количество посетителей</th>';
            $.each($visitors, (index, value) => {
                tableContent += '<th>' + value + '</th>';
            });
            tableContent += '</tr>';
            tableContent += '<tr>';
            tableContent += '<th>Стратегии театра/Количество покупателей программок</th>';
            $.each(response.audienceTheater, (index, value) => {
                tableContent += '<th>B' + (index + 1) + ' ' + value + '</th>';
            });
            tableContent += '</tr>';
            tableContent += '</thead>';
            
            tableContent += '<tbody>';

            $.each(response.audienceTheater, (index, value) => {
                tableContent += '</tr>';
                tableContent += '<th>A' + (index + 1) + ' ' + value + '</th>';
                $.each(response.riskMatrix[index], (index, value) => {
                    tableContent += '<td>' + value + '</td>';
                });
                tableContent += '</tr>';
            });
            
            tableContent += '</tbody>';
            tableContent += '</table>';

            $scoreTable.append(`
                <p>
                    Критерий минимального риска Севиджа рекомендует выбирать в качестве
                    оптимальной стратегии ту, при которой величина максимального риска минимизируется в
                    наихудших условиях, т.е. обеспечивается:
                    a = min(max rij)
                </p>
            `);

            $scoreTable.append(tableContent);
            
            $scoreTable.append(`
                <p>
                    Выбираем из ` + `(` + response.maxPriceProfitInRows.toString() + `) ` +  `минимальный элемент, т.е min = ` + response.optimalStrategie +`
                </p>
            `);
            
            $scoreTable.append(`
                <p>
                    <strong>Вывод:</strong> по критерию Cэвиджа оптимальной является стратегия № ` + response.optimalStrategieNumber + `, театру необходимо заказать ` + response.audienceTheater[response.optimalStrategieNumber - 1] + ` программок ` + `
                </p>
            `);
        }

        handleContinueButton((response) => {
            hideInitializeMethod();
            populateTableScore(response);
        }, '/api/regret');
    }
    
    function methodHurwitz() {
        initializeMethod('Гурвица');
        showVisitorsTable();

        function populateTableScore(response) {
            var $scoreTable = $('.score-table');
            $scoreTable.empty();
            
            var tableContent = '<table>';

            tableContent += '<thead>';
            tableContent += '<tr>';
            tableContent += '<th>Количество посетителей</th>';
            $.each($visitors, (index, value) => {
                tableContent += '<th>' + value + '</th>';
            });
            tableContent += '</tr>';
            tableContent += '<tr>';
            tableContent += '<th>Стратегии театра/Количество покупателей программок</th>';
            $.each(response.audienceTheater, (index, value) => {
                tableContent += '<th>B' + (index + 1) + ' ' + value + '</th>';
            });
            tableContent += '</tr>';
            tableContent += '</thead>';
            
            tableContent += '<tbody>';

            $.each(response.audienceTheater, (index, value) => {
                tableContent += '</tr>';
                tableContent += '<th>A' + (index + 1) + ' ' + value + '</th>';
                $.each(response.priceTableProfit[index], (index, value) => {
                    tableContent += '<td>' + value + '</td>';
                });
                tableContent += '</tr>';
            });
            
            tableContent += '</tbody>';
            tableContent += '</table>';

            $scoreTable.append(`
                <p>
                Критерий Гурвица является критерием пессимизма - оптимизма. За оптимальную
                    принимается та стратегия, для которой выполняется соотношение: max(si),где 
                    si = y min(aij) + (1-y)max(aij) 
                </p>
            `);

            $scoreTable.append(tableContent);
            
            $scoreTable.append(`
                <p>
                    Выбираем из ` + `s[i] = (` + response.calculateCoefs.toString() + `) ` +  `максимальный элемент, т.е max = ` + response.optimalStrategie +`
                </p>
            `);
            
            $scoreTable.append(`
                <p>
                    <strong>Вывод:</strong> по критерию Гурвица оптимальной является стратегия № ` + response.optimalStrategieNumber + `, театру необходимо заказать ` + response.audienceTheater[response.optimalStrategieNumber - 1] + ` программок ` + ` 
                </p>
            `);
        }

        handleContinueButton((response) => {
            hideInitializeMethod();
            populateTableScore(response);
        }, '/api/hurwitz');
    }
});