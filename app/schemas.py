from typing import List, Optional
from pydantic import BaseModel

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