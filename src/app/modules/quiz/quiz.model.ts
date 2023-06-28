import { Schema, Types, model } from 'mongoose';
import { IQuiz, QuizModel } from './quiz.interface';

const QuizSchema = new Schema<IQuiz, QuizModel>(
  {
    // quizId: {
    //   type: String,
    // },
    quizList: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        serial_no: Number,
        answers: {
          type: [String],
          required: true,
        },
        header_1: {
          type: String,
          trim: true,
        },
        header_2: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        thimble: {
          type: String,
          trim: true,
        },
        tag: {
          type: [String],
        },
        hint: {
          type: String,
          trim: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'deactive'],
    },
    course: {
      type: Types.ObjectId,
      ref: 'Course',
    },
    courseId: {
      type: String,
    },
  },
  {
    timestamps: true,
    // strict: 'throw',
    toJSON: {
      virtuals: true,
    },
  }
);

export const Quiz = model<IQuiz, QuizModel>('Quiz', QuizSchema);
