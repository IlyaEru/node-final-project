import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      format: 'YYYY-MM-DD',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
    ],
  },
  {
    versionKey: false,
  },
);

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;
