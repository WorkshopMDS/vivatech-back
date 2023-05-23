import { model, Schema } from 'mongoose';

import type { ITicket } from '../types/ticket.type';
import { makeTicketNumber } from '../utils/functions';

const ticketSchema: Schema = new Schema(
  {
    ticketId: {
      type: String,
      required: true,
      immutable: true,
      default: () => makeTicketNumber(6),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    validityPeriod: {
      type: [
        {
          type: Date,
          validate: {
            validator: (date: Date) => date > new Date(),
            message: 'Date must be in the future',
          },
        },
      ],
      required: true,
    },
    code: {
      type: Number,
      length: 6,
    },
  },
  {
    timestamps: {
      createdAt: 'buyDate',
      updatedAt: 'updatedAt',
    },
  }
);

ticketSchema.pre('save', async function (this: ITicket, next) {
  if (!this.isNew) {
    return next();
  }

  const ticketExists = await this.$model('Tickets').exists({ ticketId: this.ticketId });

  if (ticketExists) {
    // Generate another ticket number if it already exists
    let newTicketId = makeTicketNumber(6);
    while (this.$model('Tickets').exists({ ticketId: newTicketId })) {
      newTicketId = makeTicketNumber(6);
    }
    this.ticketId = newTicketId;
  }

  this.ticketId = this.ticketId.toUpperCase();

  return next();
});

export default model<ITicket>('Tickets', ticketSchema);
