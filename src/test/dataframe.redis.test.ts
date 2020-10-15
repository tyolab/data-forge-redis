import { assert, expect } from 'chai';
import 'mocha';
import * as dataForge from 'data-forge';
import '../index';
import * as mock from 'mock-require';

describe('DataFrame redis data source', function () {

    afterEach(function () {
        mock.stop('redis');
    });

    it('write/read in data asynchronously', function () {

        mock('redis', { 
            loadData: (filePath: string, dataFormat: string, callback: Function): void => {
                console.log("Callback.");

                //expect(filePath).to.eql(testFilePath);
                expect(dataFormat).to.eql('utf8');

                callback(null);
            },
        });
        
        var fromDate = new Date('2047/09/08');
        var toDate = new Date(2047, 8, 12);

        return dataForge
            .fromRedis()
            .write('test:SAM', '20470908', JSON.stringify({H:1.70, L:1.50, O:1.60, C:1.53, V:13435353}))
            .write('test:SAM', '20470909', JSON.stringify({H:1.90, L:1.30, O:1.70, C:1.63, V:3435353}))
            .write('test:SAM', '20470910', JSON.stringify({H:1.99, L:1.60, O:1.70, C:1.70, V:3235353}))
            .write('test:SAM', '20470911', JSON.stringify({H:2.10, L:1.65, O:2.00, C:2.10, V:23435353}))
            .write('test:SAM', '20470912', JSON.stringify({H:2.30, L:1.70, O:2.10, C:2.22, V:33435353}))
            .load('test:SAM', fromDate, toDate)
            .then(dataFrame => {
                // expect(dataFrame.toCSV()).to.eql(testCsvData);
                console.log("Then.");
            })
            ;
    });

});