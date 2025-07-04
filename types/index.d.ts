interface DataTableType {
  id?: number;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: string | number | undefined;
}
