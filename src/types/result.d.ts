declare namespace Utils {
  export type Result<T> = {
    success: boolean;
    result?: T;
  };
}
