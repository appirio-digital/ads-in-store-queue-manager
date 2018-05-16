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
    query.response([
      {
        storeName: 'T-Mobile Store 00001',
        shiftName: 'S-0013',
        shiftId: 'a01f400000C0hmAAAR',
        representativeId: '003f400000J18dBAAR',
        representativeName: 'Andrew Romine',
        appointmentName: null,
        appointmentStartTime: null,
        shiftStartTime: '09:00:00',
        shiftEndTime: '17:00:00',
        postalCode: '98102',
        street: '431 Broadway E Suite F',
        city: 'Seattle',
        country: 'USA',
        storeId: '001f400000LjaZfAAJ'
      },
      {
        storeName: 'T-Mobile Store 00004',
        shiftName: 'S-0001',
        shiftId: 'a01f400000C0hh2AAB',
        representativeId: '003f400000J18geAAB',
        representativeName: 'James Paxton',
        appointmentName: null,
        appointmentStartTime: null,
        shiftStartTime: '08:00:00',
        shiftEndTime: '16:00:00',
        postalCode: '98102',
        street: '510 1st Ave N',
        city: 'Seattle',
        country: 'USA',
        storeId: '001f400000LjabrAAB'
      }
    ]);
  });
  return db;
});

describe('/controllers/store', () => {
  it('should find', async () => {
    let req = http_mocks.createRequest({
      url: 'http://somehost/api/store/find',
      body: {
        postal_code: '9812',
        type_of_visit: 'New Service'
      }
    });

    let res = http_mocks.createResponse();

    await controller.findStore(req, res);

    expect(JSON.parse(res._getData()).appointmentSlots.length).toEqual(32);
  });
});
