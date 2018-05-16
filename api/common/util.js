const moment = require('moment-timezone');
const Queue = require('./../services/queue');
const { uniqBy, omit, groupBy } = require('lodash');
const { types } = require('pg');

const knex = require('./../services/knex');

const TIMESTAMP_OID = 1114;
const APPOINTMENT_TYPE = {
  'New Service': 20,
  'Product Support': 10,
  'Maintenance/Replacements': 15,
  'Account Issues': 5
};

types.setTypeParser(TIMESTAMP_OID, function(stringValue) {
  return stringValue;
});

module.exports = {
  buildQueue
};

async function buildQueue(store) {
  const timeNow = moment.utc(new Date());

  // fetching all active(Waiting, In-Progress) appointments
  // related to current store from pg
  let allActiveAppointment = await knex
    .select(
      'account.name AS storeName',
      'account.shippingpostalcode AS postalCode',
      'account.shippingstreet AS street',
      'account.shippingcity AS city',
      'account.shippingcountry AS country',
      'account.sfid AS storeId',
      'appointment__c.sfid AS appointmentId',
      'appointment__c.customer_name__c AS appointmentName',
      'appointment__c.start_time__c AS appointmentStartTime',
      'appointment__c.status__c AS appointmentStatus',
      'appointment__c.type__c AS appointmentType',
      'appointment__c.representative__c AS representativeId'
    )
    .from('salesforce.account')
    .innerJoin(
      'salesforce.appointment__c',
      'salesforce.appointment__c.account__c',
      'salesforce.account.sfid'
    )
    .where({
      'salesforce.account.sfid': store
    })
    .whereIn('salesforce.appointment__c.status__c', ['In-Progress', 'Waiting'])
    .orderBy('appointment__c.createddate', 'asc');

  // fetching all available slots and representative details related
  // to current store
  let allShifts = await knex
    .select(
      'account.name AS storeName',
      'account.shippingpostalcode AS postalCode',
      'account.shippingstreet AS street',
      'account.shippingcity AS city',
      'account.shippingcountry AS country',
      'account.sfid AS storeId',
      'shift__c.sfid AS shiftId',
      'shift__c.start_time__c AS shiftStartTime',
      'shift__c.end_time__c AS shiftEndTime',
      'shift__c.service_type__c AS shiftServiceType',
      'shift__c.representative__c AS representativeId',
      'contact.name AS representativeName'
    )
    .from('salesforce.account')
    .innerJoin(
      'salesforce.shift__c',
      'salesforce.shift__c.location__c',
      'salesforce.account.sfid'
    )
    .leftJoin(
      'salesforce.contact',
      'salesforce.contact.sfid',
      'salesforce.shift__c.representative__c'
    )
    .where({
      'salesforce.account.sfid': store
    })
    .andWhere(
      'salesforce.shift__c.start_time__c',
      '<',
      timeNow.format('HH:mm:ss')
    )
    .andWhere(
      'salesforce.shift__c.end_time__c',
      '>',
      timeNow.format('HH:mm:ss')
    );

  if (allShifts.length === 0) {
    return {
      message: 'no representative available at store.'
    };
  }
  // segregating store details
  const [{ storeId, storeName, postalCode, street, city, country }] = uniqBy(
    allShifts,
    'storeName'
  );

  // normalizing store detail information
  allActiveAppointment = allActiveAppointment.map(appointment =>
    omit(appointment, [
      'storeId',
      'storeName',
      'postalCode',
      'street',
      'city',
      'country'
    ])
  );
  // normalizing store detail information and spiting multi picklist options in
  // shiftServiceType field
  allShifts = allShifts.map(shift => {
    const omitshift = omit(shift, [
      'storeId',
      'storeName',
      'postalCode',
      'street',
      'city',
      'country'
    ]);
    return Object.assign(omitshift, {
      shiftServiceType: omitshift.shiftServiceType
        ? omitshift.shiftServiceType.split(';')
        : []
    });
  });

  // creating queue for each available representative
  const empQueues = allShifts.map(shift => new Queue(shift));

  // grouping all active appointments by appointmentStatus (Waiting, In-Progress)
  const groupAppointmentByStatus = Object.assign(
    {
      'In-Progress': [],
      Waiting: []
    },
    groupBy(allActiveAppointment, 'appointmentStatus')
  );

  // enqueuing all In-Progress appointment in related representative queue.
  groupAppointmentByStatus['In-Progress'].forEach(appointment => {
    // finding related representative queue
    const minQueue = empQueues.find(
      queue =>
        queue.representative.representativeId === appointment.representativeId
    );
    if (minQueue) {
      //calculating EstimatedTime
      const appointmentStartTime = moment.utc(appointment.appointmentStartTime);
      let timeDiff =
        APPOINTMENT_TYPE[appointment.appointmentType] -
        Math.round(
          moment.duration(timeNow.diff(appointmentStartTime)).asMinutes()
        );
      timeDiff = timeDiff < -1 ? 0 : timeDiff;
      minQueue.enqueue(appointment, timeDiff);
    }
  });

  // enqueuing all Waiting appointment in smallest waiting queue.
  groupAppointmentByStatus['Waiting'].forEach(appointment => {
    // finding smallest waiting queue related to appointmentType
    const minQueue = empQueues
      .filter(queue =>
        queue.representative.shiftServiceType.includes(
          appointment.appointmentType
        )
      )
      .reduce(
        (min, current) => (min.length < current.length ? min : current),
        empQueues[0]
      );
    // enqueuing appointment
    minQueue.enqueue(
      appointment,
      APPOINTMENT_TYPE[appointment.appointmentType]
    );
  });

  return {
    storeDetail: {
      storeId,
      storeName,
      postalCode,
      street,
      city,
      country
    },
    empQueues,
    groupAppointmentByStatus,
    allActiveAppointment,
    allShifts
  };
}
