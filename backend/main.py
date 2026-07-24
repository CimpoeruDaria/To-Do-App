import bcrypt # pt. criptarea parolelor
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # permite interactiunile de tip login/register 
from pydantic import BaseModel # pt. crearea claselor
from database import get_db_connection # pt. conexiunea cu database.py
from datetime import datetime

app = FastAPI(title="To Do App API")

app.add_middleware( # pe unde trec toate cererile HTTP(login/register) din exterior
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], # permite toate metodele (ex. GET, POST etc)
    allow_headers=["*"], 
)



# RUTA: Pagina de pornire
@app.get("/")
def home():
    return {"Bine ai venit pe API-ul aplicatiei To Do App!"}


class userRegister(BaseModel):
   username: str
   email: str
   password: str

#RUTA: REGISTER
@app.post("/api/register")
def register_user(user_data: userRegister):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor: # cursorul cauta in baza de date informatiile
            cursor.execute("SELECT id FROM users WHERE email = %s", (user_data.email,))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Acest email este deja inregistrat!")

            password_bytes = user_data.password.encode('utf-8') # scrie parola initiala in biti
            sare = bcrypt.gensalt() # valoare random (pt. ca 2 utilizatori cu ac. parola sa nu o aiba codificata la fel)
            password_crypt = bcrypt.hashpw(password_bytes, sare).decode('utf-8')

            sql = """ 
                INSERT INTO users (username, email, password_hash) 
                VALUES (%s, %s, %s)
            """
            values_user = (
                user_data.username,
                user_data.email,
                password_crypt,               
            )
            cursor.execute(sql, values_user)
            new_user_id = cursor.lastrowid
            connection.commit()

            return {
                "status": "success", 
                "mesaj": "Contul a fost creat cu succes!", 
                "user_id": new_user_id
            }
    finally:
        connection.close()



class userLogin(BaseModel):
   email: str
   password: str

#RUTA 2: Optiunea de LOGIN
@app.post("/api/login")
def login_user(login_data: userLogin):
    connection = get_db_connection()
    try:
         with connection.cursor() as cursor:  

             cursor.execute("SELECT id, username, email, password_hash FROM users WHERE email = %s", (login_data.email,))
             user = cursor.fetchone() 

             if not user: 
                 raise HTTPException(status_code=400, detail="Email sau parola incorecta!")
             
             sent_password_bytes = login_data.password.encode('utf-8')
             base_password_bytes = user['password_hash'].encode('utf-8')
              
             if bcrypt.checkpw(sent_password_bytes, base_password_bytes):
                return {
                    "status": "success",
                    "mesaj": "Autentificare reușită!",
                    "user": {
                        "id": user['id'],
                        "username": user['username'],
                        "email": user['email'],
                    }
                }
             else:
                 raise HTTPException(status_code=400, detail="Email sau parola incorecta!")
    
    finally:
        connection.close()


           