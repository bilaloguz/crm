from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import JSONResponse
from app.database import getDB, engine
import app.models as models
import app.schemas as schemas
from app.repositories import CustomerRepo
from sqlalchemy.orm import Session
import uvicorn
from typing import List,Optional
from fastapi.encoders import jsonable_encoder

app = FastAPI(title="Aviteng CRM", description="Customer Relations Management", version="0.0.1")

models.Base.metadata.create_all(bind=engine)

@app.exception_handler(Exception)
def validation_exception_handler(request, err):
    base_error_message = f"Failed to execute: {request.method}: {request.url}"
    return JSONResponse(status_code=400, content={"message": f"{base_error_message}. Detail: {err}"})

@app.post('/customer', tags=["Customer"], response_model=schemas.Customer, status_code=201)
async def createCustomer(customerRequest: schemas.CustomerCreate, db: Session = Depends(getDB)):
    """
    Create a customer and store it in the database
    """
    dbCustomer = CustomerRepo.fetchByName(db, name=customerRequest.name)
    if dbCustomer:
        raise HTTPException(status_code=400, detail="Customer already exists!")
    return await CustomerRepo.create(db=db, customer=customerRequest)

@app.get('/customer', tags=["Customer"], response_model=List[schemas.Customer])
def getAllCustomers(name: Optional[str] = None, db: Session = Depends(getDB)):
    """
    Get all the customers stored in database
    """
    if name:
        customers =[]
        dbCustomer = CustomerRepo.fetchByName(db, name)
        customers.append(dbCustomer)
        return customers
    else:
        return CustomerRepo.fetchAll(db)

@app.get('/customer/{customerId}', tags=["Customer"], response_model=schemas.Customer)
def getCustomer(customerId: int, db: Session = Depends(getDB)):
    """
    Get the customer with the given ID provided by user stored in database
    """
    dbCustomer = CustomerRepo.fetchById(db, customerId)
    if dbCustomer is None:
        raise HTTPException(status_code=404, detail="Customer not found with the given ID")
    return dbCustomer

@app.delete('/customer/{customerId}', tags=["Customer"])
async def deleteCustomer(customerId: int, db: Session = Depends(getDB)):
    """
    Delete the customer with the given ID provided by user stored in database
    """
    dbCustomer = CustomerRepo.fetchById(db, customerId)
    if dbCustomer is None:
        raise HTTPException(status_code=404, detail="Customer not found with the given ID")
    await CustomerRepo.delete(db, customerId)
    return "Customer deleted successfully!"

@app.put('/customer/{customerId}', tags=["Customer"], response_model=schemas.Customer)
async def updateCustomer(customerId: int, customerRequest: schemas.Customer, db: Session = Depends(getDB)):
    """
    Update a customer stored in the database
    """
    dbCustomer = CustomerRepo.fetchById(db, customerId)
    if dbCustomer:
        updateCustomerEncoded = jsonable_encoder(customerRequest)
        dbCustomer.name = updateCustomerEncoded['name']
        dbCustomer.company = updateCustomerEncoded['company']
        dbCustomer.title = updateCustomerEncoded['title']
        dbCustomer.email = updateCustomerEncoded['email']
        dbCustomer.phone = updateCustomerEncoded['phone']
        return await CustomerRepo.update(db=db, customerData=dbCustomer)
    else:
        raise HTTPException(status_code=400, detail="Customer not found with the given ID")   

if __name__ == "__main__":
    uvicorn.run("main:app", port=9000, reload=True)