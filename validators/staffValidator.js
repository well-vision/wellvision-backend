import { body } from "express-validator";

export const validateStaffCreation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  

  body("role")
    .isIn(["Admin", "Manager", "Employee", "Supervisor"])
    .withMessage("Role must be one of: Admin, Manager, Employee, Supervisor"),
  
  body("status")
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either Active or Inactive"),
  
  body("phoneNumber")
    .optional({ checkFalsy: true, nullable: true })
    .isLength({ min: 7, max: 15 })
    .withMessage("Phone number must be between 7 and 15 characters")
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage("Phone number can only contain digits, spaces, hyphens, plus signs, and parentheses"),
  
  body("department")
    .optional({ checkFalsy: true, nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Department name cannot exceed 100 characters"),
];

export const validateStaffUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  
  body("password")
    .optional()
    .custom((value) => {
      if (value && value.trim() !== "") {
        if (value.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          throw new Error("Password must contain at least one lowercase letter, one uppercase letter, and one number");
        }
      }
      return true;
    }),
  
  body("role")
    .optional()
    .isIn(["Admin", "Manager", "Employee", "Supervisor"])
    .withMessage("Role must be one of: Admin, Manager, Employee, Supervisor"),
  
  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either Active or Inactive"),
  
  body("phoneNumber")
    .optional({ checkFalsy: true, nullable: true })
    .isLength({ min: 7, max: 15 })
    .withMessage("Phone number must be between 7 and 15 characters")
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage("Phone number can only contain digits, spaces, hyphens, plus signs, and parentheses"),
  
  body("department")
    .optional({ checkFalsy: true, nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Department name cannot exceed 100 characters"),
];