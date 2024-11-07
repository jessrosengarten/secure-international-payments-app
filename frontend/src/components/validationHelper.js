// Regex Patterns
export const fullNameRegex = /^[a-zA-Z\- ]{2,}$/;
export const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
export const idNumberRegex = /^[0-9]{13}$/;
export const accountNumberRegex = /^[0-9]{10}$/;
export const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{8,18}$/;
//export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,18}$/;
export const empNumberRegex = /^[a-zA-Z0-9_]{6,10}$/;
export const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
export const accountInfoRegex = /^[0-9]{10}$/;
export const providerCodeRegex = /^[a-zA-Z0-9!@#$%^&*]{4,8}$/;