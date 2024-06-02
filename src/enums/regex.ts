export enum Regex {
  Email = '^(?=.{1,256})(?=.{1,64}@.{1,255}$)[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$',
  Password = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).{8,}$',
  Name = '^[a-zA-Z ]{1,20}$',
  Description = '^[a-zA-Z0-9 ]{1,200}$',
}