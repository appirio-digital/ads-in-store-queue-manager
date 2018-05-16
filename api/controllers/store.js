const { buildQueue } = require('./../common/util');

module.exports = {
  getStoreWaitingTime,
  getStoreWaitingQueue
};

async function getStoreWaitingTime(req, res, next) {
  try {
    const { store } = req.query;

    if (!store) {
      next(new Error('Store Id required parameter.'));
    }

    const { storeDetail, empQueues } = await buildQueue(store);

    // finding smallest waiting queue in store
    const minQueue = empQueues.reduce(
      (min, current) => (min.length < current.length ? min : current),
      empQueues[0]
    );

    return res.json({
      storeDetail,
      waitingTime: minQueue.length
    });
  } catch (error) {
    next(error);
  }
}

async function getStoreWaitingQueue(req, res, next) {
  try {
    const { store, representative } = req.query;

    const { storeDetail, empQueues, message } = await buildQueue(store);

    if (message) {
      return res.json({
        message
      });
    }

    let counters = empQueues.map(queue => {
      return {
        queue: queue.map(appointment => appointment),
        representative: {
          id: queue.representative.representativeId,
          name: queue.representative.representativeName
        }
      };
    });

    counters = representative
      ? counters.find(
          counter => counter.representative.id === representative
        ) || null
      : counters;

    return res.json({
      storeDetail,
      counters
    });
  } catch (error) {
    next(error);
  }
}
