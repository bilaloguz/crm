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
    
