from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from app.database import getDB, engine
import app.models as models
import app.schemas as schemas
from app.repositories import CustomerRepo, UserRepo
from sqlalchemy.orm import Session
import uvicorn
from typing import List,Optional
from fastapi.encoders import jsonable_encoder
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aviteng CRM", description="Customer Relations Management", version="0.0.1")
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
def validation_exception_handler(request, err):
    base_error_message = f"Failed to execute: {request.method}: {request.url}"
    return JSONResponse(status_code=400, content={"message": f"{base_error_message}. Detail: {err}"})

### USER::AUTH START ###

@app.post('/login', tags=["Auth"], response_model=schemas.User, status_code=200)
async def login(userRequest: schemas.UserLogin, db: Session = Depends(getDB)):
    """
    Authenticate user if credentials are correct
    """
    dbUser = UserRepo.fetchByUsername(db, username=userRequest.username)
    if dbUser:
        if dbUser.password == userRequest.password:
            return dbUser
        else:
            raise HTTPException(status_code=400, detail="Wrong password!")
    else:
        raise HTTPException(status_code=400, detail="User does not exist!")


### USER::AUTH END ###

### USER::CRUD START ###

@app.post('/user', tags=["User"], response_model=schemas.User, status_code=200)
async def createUser(userRequest: schemas.UserCreate, db: Session = Depends(getDB)):
    """
    Create a user and store it in the database
    """
    dbUser = UserRepo.fetchByUsername(db, username=userRequest.username)
    if dbUser:
        raise HTTPException(status_code=400, detail="User already exists!")
    user = await UserRepo.create(db=db, user=userRequest)
    return user

@app.get('/user', tags=["User"], response_model=List[schemas.User], status_code=200)
def getAllUsers(request: Request, name: Optional[str] = None, db: Session = Depends(getDB)):
    """
    Get all the users stored in database
    """
    users = UserRepo.fetchAll(db)
    return list(users)
        
@app.get('/user/{userId}', tags=["User"], response_model=schemas.User)
def getUser(userId: int, db: Session = Depends(getDB)):
    """
    Get the user with the given ID provided by user stored in database
    """
    dbUser = UserRepo.fetchById(db, userId)
    if dbUser is None:
        raise HTTPException(status_code=404, detail="User not found with the given ID")
    return dbUser

@app.delete('/user/{userId}', tags=["User"])
async def deleteUser(userId: int, db: Session = Depends(getDB)):
    """
    Delete the user with the given ID stored in database
    """
    dbUser = UserRepo.fetchById(db, userId)
    if dbUser is None:
        raise HTTPException(status_code=404, detail="User not found with the given ID")
    await UserRepo.delete(db, userId)
    return "User deleted successfully!"

@app.put('/user/{userId}', tags=["User"])
async def updateUser(userId: int, userRequest: Request, db: Session = Depends(getDB)):
    """
    Update a user stored in the database
    """
    user = await userRequest.json()
    dbUser = UserRepo.fetchById(db, userId)
    if dbUser:
        if 'username' in user.keys():
            dbUser.username = user['username']
        if 'password' in user.keys():
            dbUser.password = user['password']
        if 'email' in user.keys():
            dbUser.email = user['email']
        if 'phone' in user.keys():
            dbUser.phone = user['phone']
        updatedUser = await UserRepo.update(db=db, userData=dbUser)
        return updatedUser
    else:
        raise HTTPException(status_code=400, detail="User not found with the given ID")   

### USER::CRUD END ###

### CUSTOMER::CRUD START ###

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
def getAllCustomers(request: Request, name: Optional[str] = None, db: Session = Depends(getDB)):
    """
    Get all the customers stored in database
    """
    customers = CustomerRepo.fetchAll(db)
    return templates.TemplateResponse('index.html', {"request": request, "customers": customers})
        
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

### CUSTOMER::CRUD END ###

if __name__ == "__main__":
    uvicorn.run("main:app", port=9000, reload=True)