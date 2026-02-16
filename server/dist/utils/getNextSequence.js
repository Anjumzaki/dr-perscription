"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextSequence = void 0;
const Counter_1 = require("../models/Counter");
const getNextSequence = async (name) => {
    const counter = await Counter_1.Counter.findOneAndUpdate({ name }, { $inc: { seq: 1 } }, { new: true, upsert: true });
    return counter.seq;
};
exports.getNextSequence = getNextSequence;
