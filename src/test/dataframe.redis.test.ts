import { assert, expect } from 'chai';
import 'mocha';
import * as dataForge from 'data-forge';
import '../index';
import * as mock from 'mock-require';

describe('DataFrame redis data source', function () {

    it('write/read in data asynchronously', function () {
        
        var fromDate = new Date('2047/09/08');
        var toDate = new Date(2047, 8, 12);

        var redisDataFrameLoader = dataForge
        .fromRedis();

        return redisDataFrameLoader
            .write('test:SAM', '20470827', JSON.stringify({H:1.70, L:1.50, O:1.60, C:1.53, V:13435353}))
            .write('test:SAM', '20470828', JSON.stringify({H:1.90, L:1.30, O:1.70, C:1.63, V:3435353}))
            .write('test:SAM', '20470829', JSON.stringify({H:1.99, L:1.60, O:1.70, C:1.70, V:3235353}))
            .write('test:SAM', '20470901', JSON.stringify({H:2.10, L:1.65, O:2.00, C:2.10, V:23435353}))
            .write('test:SAM', '20470902', JSON.stringify({H:2.30, L:1.70, O:2.10, C:2.22, V:33435353}))
            .write('test:SAM', '20470903', JSON.stringify({H:2.60, L:2.15, O:2.40, C:2.66, V:623455353}))
            .write('test:SAM', '20470904', JSON.stringify({H:2.80, L:2.30, O:2.50, C:2.78, V:76435353}))    
            .load('test:SAM', fromDate, toDate)
            .then(dataFrame => {
                expect(dataFrame.count()).to.equal(7);

                return redisDataFrameLoader
                .write('test:SAM', '20470906', JSON.stringify({H:2.80, L:2.30, O:2.50, C:2.78, V:76435353}))
                .write('test:SAM', '20470907', JSON.stringify({H:2.90, L:2.40, O:2.60, C:2.88, V:83435353}))
                .write('test:SAM', '20470908', JSON.stringify({H:2.90, L:2.40, O:2.60, C:2.88, V:83435353}))
                .write('test:SAM', '20470909', JSON.stringify({H:2.90, L:2.40, O:2.60, C:2.88, V:83435353}))
                .update(dataFrame, new Date('2047-09-09'));

            })
            .then(dataFrame => {
                expect(dataFrame.count()).to.equal(11);
            });
    });

});