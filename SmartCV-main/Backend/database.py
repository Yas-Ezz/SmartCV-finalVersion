import pyodbc
import bcrypt  # For password hashing
import jwt  as pyjwt# For token generation
import hashlib

import datetime
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token


def validate_password(plain_password, hashed_password):
    """
    Validates the given plain password against the bcrypt hashed password.
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def hash_password(password):
    """
    Hashes the plain password using Werkzeug's generate_password_hash function.
    """
    return generate_password_hash(password)


# Database connection
def get_db_connection():
    try:
        connection = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=DESKTOP-NTVHLJU\\SQLEXPRESS;"  # Replace with your server name
            "DATABASE=recruitement_system;"        # Replace with your database name
            "Trusted_Connection=yes;"             # Use Windows Authentication
        )
        return connection
    except Exception as e:
        print("Error connecting to database:", e)
        return None

# Sign-Up Function
import bcrypt

def sign_up(name, email, password, role):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Check if the email already exists in the Account table
        cursor.execute("SELECT Email FROM Account WHERE LOWER(Email) = LOWER(?)", (email,))
        if cursor.fetchone():
            return {"success": False, "message": "Email already exists. Please log in instead."}

        # Hash the password using bcrypt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Insert into Users table
        cursor.execute(
            """
            INSERT INTO Users (Name, Email, Role, RegistrationDate)
            VALUES (?, ?, ?, GETDATE())
            """,
            (name, email, role)
        )
        connection.commit()

        # Retrieve the UserID of the newly inserted user
        cursor.execute("SELECT UserID FROM Users WHERE LOWER(Email) = LOWER(?)", (email,))
        user = cursor.fetchone()
        if not user:
            return {"success": False, "message": "Failed to retrieve UserID."}
        user_id = user[0]

        # Insert into Account table
        cursor.execute(
            """
            INSERT INTO Account (Email, Password, Role, UserID)
            VALUES (?, ?, ?, ?)
            """,
            (email, hashed_password, role, user_id)
        )
        connection.commit()

        return {"success": True, "message": "User registered successfully."}
    except Exception as e:
        print(f"Error during sign-up: {e}")
        return {"success": False, "message": "Error during sign-up."}
    finally:
        cursor.close()
        connection.close()


# Login Function
def login(email, password):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if the email exists
        query = "SELECT UserID, Password, Role FROM Account WHERE LOWER(Email) = LOWER(?)"
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        if not user:
            return {"success": False, "message": "Email not found"}

        user_id, hashed_password, role = user

        # Validate the password
        if not validate_password(password, hashed_password):
            return {"success": False, "message": "Invalid password"}

        # Generate the JWT token
        # Convert user_id to string to prevent errors in Flask-JWT-Extended
        token = create_access_token(identity=str(user_id), additional_claims={"role": role})
        
        print(f"Debug: Generated Token: {token}")


        return {"success": True, "message": "Login successful", "token": token, "role": role}
    except Exception as e:
        return {"success": False, "message": f"Error during login: {str(e)}"}
    finally:
        if connection:
            connection.close()

# Save Ranked Resumes to the Database
def save_ranked_resumes(ranked_resumes, job_description, hr_id=1, department_id=1):
    connection = get_db_connection()
    if not connection:
        return "Failed to connect to the database"

    try:
        cursor = connection.cursor()

        # Insert job description with DepartmentID
        cursor.execute(
            "INSERT INTO JobDescription (HRID, Description, DepartmentID) VALUES (?, ?, ?)",
            (hr_id, job_description, department_id)
        )
        connection.commit()

        # Get the newly inserted JobID
        job_id = cursor.execute("SELECT @@IDENTITY").fetchval()

        # Insert ranked resumes into MatchResult
        for rank, (name, email, similarity) in enumerate(ranked_resumes, start=1):
            print(f"Saving resume: Name={name}, Email={email}, Similarity={similarity}")
            # Insert match result (placeholder CVID for testing)
            cursor.execute(
                "INSERT INTO MatchResult (JobID, CVID, SimilarityScore, Rank) VALUES (?, ?, ?, ?)",
                (job_id, rank, similarity, rank)
            )
            connection.commit()

        cursor.close()
        connection.close()
        return "Ranked resumes saved successfully"
    except Exception as e:
        print(f"Error saving ranked resumes: {e}")
        return "Error saving ranked resumes"

# Test the Functions
if __name__ == "__main__":
    # Test Sign-Up
    print("Testing Sign-Up...")
    sign_up_result = sign_up("Jane Doe", "jane.doe@example.com", "securepassword", "Candidate")
    print(sign_up_result)

    # Test Login
    print("Testing Login...")
    login_result = login("jane.doe@example.com", "securepassword")
    print(login_result)

