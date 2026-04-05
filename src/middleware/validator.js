import {z} from 'zod'
import { CATEGORY, STATUS, TYPE } from '../lib/constants.js';

// const emailRegex = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';
const loginschema = z.object({
    email:z.email({error:'Email not valid'}),
    password : z.string().min(6,"Password must be at least 6 chars")
})
const signupschema = z.object({
    name: z.string().min(3, "Username must be at least 3 chars"),
    email: z.email({error:"email not valid"}),
    password: z.string().min(6, "Password must be at least 6 chars"),
})
const dashboarddataschema = z.object({
    amount: z.number({error :"Amount must be a number"}).positive({error:"Amount must be greater than 0"}),
    category:z.enum(Object.values(CATEGORY),{error:'category not valid'}),
    type:z.enum(Object.values(TYPE),{error:'types not valid'}),
    date:z.preprocess((arg)=>{
        if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    },z.date({error:"Invalid date"})),
    notes:z.string().optional()
})
const filterdashboardschema = z.object({
  type: z.enum(Object.values(TYPE)).optional(),     
  category: z.enum(Object.values(CATEGORY)).optional(),
  startDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), { error: "Invalid start date" }),
  endDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), { error: "Invalid end date" }),
});
const ownershipschema = z.object({
    from : z.email({error:"wrong email formet in 'from' "}),
    to:z.email({error:'wrong email format in "to"'})
})
const updaterolevalschema = z.object({
    email : z.email({error:"wrong email formet in 'from' "}),
    roleid:z.coerce.number({error:"roleid is not a number reqired a number"}).int({error:'roleid must be an integer'}).positive({error:"roleid must be positive"})
})
const updatestatusvalschema = z.object({
    email : z.email({error:"wrong email formet in 'from' "}),
    status:z.enum(Object.values(STATUS),{error:'status not valid'}),
})
const paginationschema = z.object({
    skip : z.number({error:"an integer number is required"}),
    limit: z.number({error:"an integer number is required"})
})
const rolewithpermissionschema = z.object({
    rolename: z.string(),
    permissionidarray: z.array(z.number().int("Permission IDs must be integers")).min(1, "At least one permission ID is required"),
});
const Assignpermissionschema = z.object({
    roleid: z.number().int({error:"Permission IDs must be integers"}),
    permissionidarray: z.array(z.number().int("Permission IDs must be integers")).min(1, "At least one permission ID is required"),
});
const removePermissionsFromRoleschema = z.object({
    permissionidarray: z.array(z.number().int("Permission IDs must be integers")).min(1, "At least one permission ID is required"),
})

const validatebody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      place:"inside body middleware",
      error: err.message,
    });
  }
};

const validatequery = (schema) => (req, res, next) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const loginValidator = validatebody(loginschema);
export const signupValidator = validatebody(signupschema);
export const dashboardDataValidator = validatebody(dashboarddataschema);
export const filterDashboardValidator = validatequery(filterdashboardschema);
export const ownershipValidator = validatebody(ownershipschema);
export const updateRoleValidator = validatebody(updaterolevalschema);
export const updateStatusValidator = validatebody(updatestatusvalschema);
export const paginationValidator = validatebody(paginationschema);
export const roleWithPermissionValidator = validatebody(rolewithpermissionschema);
export const assignPermissionValidator = validatebody(Assignpermissionschema);
export const removePermissionValidator = validatebody(removePermissionsFromRoleschema);
