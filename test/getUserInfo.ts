export interface UserInfo {
  [k: string]: unknown;
}

/**
 * this gets user informations
 */
export function GetUserInfo(params: UserInfo) {
  
}

// { 
//   description: 'this gets user informations',
//   name: 'get_user_info',
//   parameters: 'JSONSchema'
// }

// 1. Pick the function name 
// 2. Description 
// 3. Param Type 
// 4. Return Type
// 5. Convert Param and Return Type to JSON Schema
// 6. out put a file with this data 