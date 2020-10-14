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
        
        return dataForge
            .fromRedis()
            .write('asx:price:SAM', '20470908')
            .then(dataFrame => {
                // expect(dataFrame.toCSV()).to.eql(testCsvData);
                console.log("Then.");
            })
            ;
    });

});