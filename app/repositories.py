from sqlalchemy.orm import Session

from . import models, schemas


class CustomerRepo:
    
    async def create(db: Session, customer: schemas.CustomerCreate):
        dbCustomer = models.Customer(name=customer.name,company=customer.company,title=customer.title,email=customer.email,phone=customer.phone)
        db.add(dbCustomer)
        db.commit()
        db.refresh(dbCustomer)
        return dbCustomer
        
    def fetchById(db: Session, _id):
        return db.query(models.Customer).filter(models.Customer.id == _id).first()
    
    def fetchByName(db: Session, name):
        return db.query(models.Customer).filter(models.Customer.name == name).first()
    
    def fetchAll(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.Customer).offset(skip).limit(limit).all()
    
    async def delete(db: Session, customerId):
        dbCustomer= db.query(models.Customer).filter_by(id=customerId).first()
        db.delete(dbCustomer)
        db.commit()
            
    async def update(db: Session, customerData):
        updatedCustomer = db.merge(customerData)
        db.commit()
        return updatedCustomer

class UserRepo:
    
    async def create(db: Session, user: schemas.UserCreate):
        dbUser = models.User(username=user.username,password=user.password,email=user.email,phone=user.phone)
        db.add(dbUser)
        db.commit()
        db.refresh(dbUser)
        return dbUser
        
    def fetchById(db: Session, userId):
        return db.query(models.User).filter_by(id=userId).first()
    
    def fetchByUsername(db: Session, username):
        return db.query(models.User).filter(models.User.username == username).first()
    
    def fetchAll(db: Session):
        return db.query(models.User).all()
    
    async def delete(db: Session, userId):
        dbUser= db.query(models.User).filter_by(id=userId).first()
        db.delete(dbUser)
        db.commit()
            
    async def update(db: Session, userData):
        updatedUser = db.merge(userData)
        db.commit()
        return updatedUser