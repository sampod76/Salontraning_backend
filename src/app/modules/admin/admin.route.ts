import express from 'express';

import validateRequestZod from '../../middlewares/validateRequestZod';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validations';

const router = express.Router();
router.route('/').get(AdminController.getAllAdmins);

router
  .route('/:id')
  .get(AdminController.getSingleAdmin)
  .patch(
    validateRequestZod(AdminValidation.updateAdminZodSchema),
    AdminController.updateAdmin
  )
  .delete(AdminController.deleteAdmin);

export const AdminRoutes = router;
