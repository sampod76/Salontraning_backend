export type IEncodedPaymentData = {
  userId: string;
  course_id: string;
  amount: {
    currency: string;
    total: string;
  };
};
