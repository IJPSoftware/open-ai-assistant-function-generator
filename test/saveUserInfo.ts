export interface SaveUserInfoParams {
  /**
   * The height of the user
   */
  height: string;
  /**
   * the unit of the height of the user
   */
  height_unit: 'cm' | 'ft';
  /**
   * the weight of the user
   */
  weight: string;
  /**
   * the unit of the weight of the user
   */
  weight_unit: 'lb' | 'kg';
  /**
   * The age of the user
   */
  age: string;
  car(asd: string): string
}

export function SaveUserInfo(params: SaveUserInfoParams) {}
