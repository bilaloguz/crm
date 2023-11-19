from typing import List, Optional
from pydantic import BaseModel

### CUSTOMER ###

class CustomerBase(BaseModel):
    name: str
    company : str
    title: str
    email: str
    phone: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int

    class Config:
        orm_mode = True

### CUSTOMER ###

### USER ###

class UserBase(BaseModel):
    username: str
    password : str
    email: str
    phone: str

class UserCreate(UserBase):
    pass

class UserLogin(BaseModel):
    username: str
    password: str

    class Config:
        orm_mode = True

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

### USER ###