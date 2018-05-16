const data = Symbol('data');

class Queue {
  constructor(representative, iterable) {
    this._representative = representative;
    this._length = 0;
    this[data] = [];
    if (iterable) {
      for (const item of iterable) {
        this.enqueue(item);
      }
    }
  }

  get length() {
    return this._length;
  }
  get size() {
    return this[data].length;
  }
  get representative() {
    return this._representative;
  }

  enqueue(appointment, waitingTime) {
    this[data].push(appointment);
    this._length += waitingTime || 0;
    return this;
  }
  dequeue() {
    return this[data].shift();
  }
  peek() {
    return this[data][0];
  }
  clear() {
    this[data] = [];
  }
  has(appointment) {
    for (let i = 0; i < this.size; i++) {
      if (appointment.appointmentId === this[data][i].appointmentId) {
        return true;
      }
    }
    return false;
  }
  forEach(callback, thisArg) {
    for (const item of this) {
      callback.call(thisArg, item, this);
    }
  }

  map(callback) {
    const arr = [];
    for (let i = 0; i < this[data].length; i++)
      arr.push(callback(this[data][i], i, this[data]));
    return arr;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.size; i++) {
      yield this[data][i];
    }
  }
}

module.exports = Queue;
