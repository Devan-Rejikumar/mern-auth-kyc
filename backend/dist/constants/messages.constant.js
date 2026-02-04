"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.KYC_MESSAGES = exports.USER_MESSAGES = exports.AUTH_MESSAGES = void 0;
exports.AUTH_MESSAGES = {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    ADMIN_LOGIN_SUCCESS: 'Admin login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    INVALID_CREDENTIALS: 'Invalid credentials',
    UNAUTHORIZED: 'Unauthorized',
    NO_TOKEN: 'No token provided',
    INVALID_TOKEN: 'Invalid or expired token',
    ADMIN_ACCESS_REQUIRED: 'Admin access required',
};
exports.USER_MESSAGES = {
    NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'Email already exists',
    USERNAME_EXISTS: 'Username already exists please choose another one',
    FETCH_ERROR: 'Server error fetching users',
};
exports.KYC_MESSAGES = {
    UPLOAD_SUCCESS: 'File uploaded successfully',
    NO_FILE: 'No file provided',
    UPLOAD_ERROR: 'Server error uploading file',
};
exports.ERROR_MESSAGES = {
    REGISTRATION_FAILED: 'Registration failed',
    SERVER_ERROR: 'Server error',
};
