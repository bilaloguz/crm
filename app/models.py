from sqlalchemy import Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship

from app.database import Base
    
class Customer(Base):

    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(80), unique=True, index=True)
    company = Column(String(80), index=True)
    title = Column(String(80))
    email = Column(String(80))
    phone = Column(String(80))

    def __repr__(self):
        return '(name=%s, company=%s)' % (self.name, self.company)

class User(Base):

    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(80), unique=True, index=True)
    password = Column(String(80))
    email = Column(String(80))
    phone = Column(String(80))

    def __repr__(self):
        return '(username=%s, email=%s)' % (self.username, self.email)