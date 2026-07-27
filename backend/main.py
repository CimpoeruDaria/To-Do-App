import bcrypt # pt. criptarea parolelor
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # permite interactiunile de tip login/register 
from pydantic import BaseModel # pt. crearea claselor
from database import get_db_connection # pt. conexiunea cu database.py
from datetime import datetime, date
from typing import Optional, List

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


class TaskCreate(BaseModel):
    user_id: int
    text: str
    deadline: Optional[date] = None # opțional: poate fi o dată YYYY-MM-DD sau None

class TaskUpdate(BaseModel):
    completed: Optional[bool] = None


#RUTA 3: Preluarea task urilor pt utilizator 
@app.get("/api/tasks")
def get_user_tasks(user_id: int):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, user_id, text, completed, deadline FROM tasks WHERE user_id = %s ORDER BY id DESC", 
                (user_id,)
            )
            tasks = cursor.fetchall()
            
            # Formatăm boolean-ul și data pentru JSON
            for task in tasks:
                task['completed'] = bool(task['completed'])
                if task['deadline']:
                    task['deadline'] = str(task['deadline'])
                    
            return tasks
    finally:
        connection.close()


#RUTA 4: Adăugarea unui task nou
@app.post("/api/tasks")
def create_task(task_data: TaskCreate):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO tasks (user_id, text, completed, deadline)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (task_data.user_id, task_data.text, False, task_data.deadline))
            task_id = cursor.lastrowid
            connection.commit()

            return {
                "id": task_id,
                "user_id": task_data.user_id,
                "text": task_data.text,
                "completed": False,
                "deadline": str(task_data.deadline) if task_data.deadline else None
            }
    finally:
        connection.close()



#RUTA 5:  Bifare / Desbifare Task (Update status)        
@app.put("/api/tasks/{task_id}")
def update_task(task_id: int, task_data: TaskUpdate):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("UPDATE tasks SET completed = %s WHERE id = %s", (task_data.completed, task_id))
            connection.commit()
            
            return {"status": "success", "task_id": task_id, "completed": task_data.completed}
    finally:
        connection.close()


#RUTA 6: Stergere task
@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
            connection.commit()
            
            return {"status": "success", "mesaj": "Task șters cu succes!"}
    finally:
        connection.close()


class EmailCheck(BaseModel):
    email: str

#RUTA 7: Verificare email pt verificare parola
@app.post("/api/check-email")
def check_email(data: EmailCheck):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE email = %s", (data.email,))
            user = cursor.fetchone()

            if not user:
                raise HTTPException(status_code=404, detail="Acest e-mail nu există în baza de date!")

            return {
                "status": "success",
                "mesaj": "Email-ul a fost găsit. Un link de resetare va fi trimis!"
            }
    finally:
        connection.close()
