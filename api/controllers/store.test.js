const http_mocks = require('node-mocks-http');

const controller = require('./store');

jest.mock('../services/knex', () => {
  const tracker = require('mock-knex').getTracker();
  const knex = require('knex');
  const mockDb = require('mock-knex');
  const db = knex({
    useNullAsDefault: true,
    client: 'sqlite'
  });
  mockDb.mock(db);
  tracker.install();
  tracker.on('query', query => {
    if (query.sql.indexOf('inner join "salesforce"."shift__c"') > 0) {
      query.response([
        {
          storeName: 'T-Mobile Store 00001',
          postalCode: '98102',
          street: '431 Broadway E Suite F',
          city: 'Seattle',
          country: 'USA',
          storeId: '001f400000LjaZfAAJ',
          shiftId: 'a01f400000C0hmAAAR',
          shiftStartTime: '01:00:00',
          shiftEndTime: '17:00:00',
          shiftServiceType:
            'New Service;Product Support;Maintenance/Replacements;Account Issues',
          representativeId: '003f400000J18dBAAR',
          representativeName: 'Andrew Romine'
        },
        {
          storeName: 'T-Mobile Store 00001',
          postalCode: '98102',
          street: '431 Broadway E Suite F',
          city: 'Seattle',
          country: 'USA',
          storeId: '001f400000LjaZfAAJ',
          shiftId: 'a01f400000C0hmIAAR',
          shiftStartTime: '02:00:00',
          shiftEndTime: '18:00:00',
          shiftServiceType:
            'New Service;Product Support;Maintenance/Replacements;Account Issues',
          representativeId: '003f400000J18dAAAR',
          representativeName: 'Robinson Cano'
        }
      ]);
    } else {
      query.response([
        {
          storeName: 'T-Mobile Store 00001',
          postalCode: '98102',
          street: '431 Broadway E Suite F',
          city: 'Seattle',
          country: 'USA',
          storeId: '001f400000LjaZfAAJ',
          appointmentId: 'a00f4000008qcrmAAA',
          appointmentName: 'sandeep Ri',
          appointmentStartTime: null,
          appointmentStatus: 'Waiting',
          appointmentType: 'New Service',
          representativeId: null
        },
        {
          storeName: 'T-Mobile Store 00001',
          postalCode: '98102',
          street: '431 Broadway E Suite F',
          city: 'Seattle',
          country: 'USA',
          storeId: '001f400000LjaZfAAJ',
          appointmentId: 'a00f4000008qcsLAAQ',
          appointmentName: 'Sandeep Ji',
          appointmentStartTime: null,
          appointmentStatus: 'Waiting',
          appointmentType: 'Account Issues',
          representativeId: null
        }
      ]);
    }
  });
  return db;
});

describe('/controllers/store', () => {
  it('should getStoreWaitingTime', async () => {
    let req = http_mocks.createRequest({
      url: `http://somehost/api/store/getStoreWaitingTime?store=001f400000LjabrAAB`
    });

    let res = http_mocks.createResponse();

    await controller.getStoreWaitingTime(req, res);

    expect(JSON.parse(res._getData()).waitingTime).toEqual(300);
  });

  it('should getStoreWaitingQueue', async () => {
    let req = http_mocks.createRequest({
      url: `http://somehost/api/store/getStoreWaitingQueue?store=001f400000LjabrAAB&representative=003f400000J18dAAAR`
    });

    let res = http_mocks.createResponse();

    await controller.getStoreWaitingQueue(req, res);

    expect(JSON.parse(res._getData()).counters.queue.length).toEqual(1);
  });
});
