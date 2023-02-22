import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../../../modules/error';

import Shift from './shift.model';

const getShifts = async (req: Request, res: Response) => {
  const shifts = await Shift.find({});
  res.json({ shifts });
};

const getShift = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const shift = await Shift.findById(id);
  if (!shift) {
    next(new ApiError(httpStatus.NOT_FOUND, 'shift not found'));
    return;
  }
  res.json({ shift });
};

const createShift = async (req: Request, res: Response) => {
  const { date, startTime, endTime } = req.body;
  const shift = await Shift.create({ date, startTime, endTime });

  res.status(201).json({ shift });
};

const updateShift = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { date, startTime, endTime } = req.body;
  const updateFields = {} as any;
  if (date) {
    updateFields.date = date;
  }
  if (startTime) {
    updateFields.startTime = startTime;
  }
  if (endTime) {
    updateFields.endTime = endTime;
  }
  const shift = await Shift.findById(id);
  if (!shift) {
    next(new ApiError(httpStatus.NOT_FOUND, 'Shift not found'));
    return;
  }
  if (
    (endTime ? new Date(endTime) : shift.endTime) <
    (startTime ? new Date(startTime) : shift.startTime)
  ) {
    next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        'end Time must be greater than start Time',
      ),
    );
    return;
  } else if (
    (startTime ? new Date(startTime) : shift.startTime) <
    (date ? new Date(date) : shift.date)
  ) {
    next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        'start Time must be greater than date',
      ),
    );
    return;
  }
  ``;
  const updatedShift = await Shift.findByIdAndUpdate(id, updateFields, {
    new: true,
  });
  res.json({ updatedShift });
};

export { getShifts, getShift, createShift, updateShift };
