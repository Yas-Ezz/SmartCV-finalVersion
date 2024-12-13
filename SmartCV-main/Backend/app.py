from flask import Flask, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity  # Import JWT helpers
from flask_cors import CORS
from database import sign_up, login, save_ranked_resumes, get_db_connection
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager
from flask_jwt_extended.utils import decode_token
import bcrypt




import os

app = Flask(__name__)

CORS(app, supports_credentials=True)

app.config["JWT_SECRET_KEY"] = "your_secret_key"  # Replace with a secure key
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False


# Initialize JWTManager
jwt = JWTManager(app)

app.config['UPLOAD_FOLDER'] = 'uploads'

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# Helper Function: Validate File Type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/api/signup', methods=['POST'])
def signup_endpoint():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        if not (name and email and password and role):
            return jsonify({"success": False, "message": "All fields are required"}), 400

        # Call the `sign_up` function
        result = sign_up(name, email, password, role)
        if result["success"]:
            return jsonify({"success": True, "message": result["message"]}), 201
        else:
            return jsonify({"success": False, "message": result["message"]}), 400
    except Exception as e:
        print(f"Error in /api/signup: {e}")
        return jsonify({"success": False, "message": "An error occurred during sign-up."}), 500


# Login Endpoint
@app.route('/api/login', methods=['POST'])
def login_endpoint():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    result = login(email, password)
    if result["success"]:
        return jsonify({
            "success": True,
            "message": result["message"],
            "token": result["token"],
            "role": result["role"]  # Include role in the response
        }), 200
    else:
        return jsonify({"success": False, "message": result["message"]}), 400
    
@app.route('/api/upload-cv-hr', methods=['POST'])
@jwt_required()
def upload_cv_hr():
    try:
        # Log headers for debugging
        print("Request Headers:", request.headers)

        # Get the logged-in user ID from the JWT token
        user_id = get_jwt_identity()
        print(f"Authenticated User ID (HR): {user_id}")

        if not user_id:
            return jsonify({"msg": "Invalid or missing token"}), 401

        # Validate form data
        candidate_name = request.form.get('candidate_name')  # Name of the candidate
        department_id = request.form.get('department_id')
        job_id = request.form.get('job_id')
        file = request.files.get('cv')

        if not candidate_name or not department_id or not job_id or not file:
            return jsonify({"msg": "All fields (candidate_name, department_id, job_id, cv) are required"}), 400

        try:
            department_id = int(department_id)
            job_id = int(job_id)
        except ValueError:
            return jsonify({"msg": "department_id and job_id must be integers"}), 422

        # Validate the file type
        if not allowed_file(file.filename):
            return jsonify({"msg": "Invalid file type. Only PDF, DOC, and DOCX are allowed."}), 422

        # Verify that the logged-in user is an HR professional
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT HRID FROM HRProfessional WHERE UserID = ?", (user_id,))
        hr = cursor.fetchone()

        if not hr:
            return jsonify({"msg": "HR professional not found for the logged-in user"}), 404

        hr_id = hr[0]
        print(f"HR ID: {hr_id}")

        # Check if candidate already exists in Users table
        cursor.execute("SELECT UserID FROM Users WHERE Name = ? AND Role = 'Candidate'", (candidate_name,))
        user = cursor.fetchone()

        if user:
            # Candidate exists in Users, retrieve UserID
            candidate_user_id = user[0]
            print(f"Existing Candidate UserID: {candidate_user_id}")
        else:
            # Candidate does not exist, insert into Users table
            try:
                print(f"Inserting candidate '{candidate_name}' into Users table...")
                cursor.execute(
                    """
                    INSERT INTO Users (Name, Email, Role, RegistrationDate)
                    VALUES (?, ?, 'Candidate', GETDATE())
                    """,
                    (candidate_name, f"Uploaded by HR: {hr_id}")
                )
                connection.commit()

                # Retrieve the UserID of the inserted candidate
                cursor.execute("SELECT SCOPE_IDENTITY()")
                candidate_user_id = cursor.fetchone()[0]
                print(f"Inserted UserID for Candidate: {candidate_user_id}")
            except Exception as user_insert_error:
                print(f"Error inserting user: {user_insert_error}")
                return jsonify({"msg": f"Error inserting candidate into Users table: {str(user_insert_error)}"}), 500

        # Retrieve CandidateID from Candidate table
        cursor.execute("SELECT CandidateID FROM Candidate WHERE UserID = ?", (candidate_user_id,))
        candidate = cursor.fetchone()

        if not candidate:
            return jsonify({"msg": "Failed to retrieve CandidateID after user insertion"}), 500

        candidate_id = candidate[0]
        print(f"Candidate ID: {candidate_id}")

        # Save the file securely
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        print(f"File saved to: {file_path}")

        # Insert CV details into the database
        try:
            query = """
            INSERT INTO CV (CandidateID, FilePath, UploadDate, Format, DepartmentID, JobID, UploadedByHR)
            VALUES (?, ?, GETDATE(), ?, ?, ?, 1)
            """
            file_format = filename.rsplit('.', 1)[1].lower()
            print(f"Executing query: {query} with values ({candidate_id}, {file_path}, {file_format}, {department_id}, {job_id})")
            cursor.execute(query, (candidate_id, file_path, file_format, department_id, job_id))
            connection.commit()
            print("CV inserted successfully.")
        except Exception as query_error:
            print(f"Error inserting CV: {query_error}")
            return jsonify({"msg": f"Error inserting CV: {str(query_error)}"}), 500

        cursor.close()
        connection.close()

        return jsonify({"message": f"CV uploaded successfully for candidate: {candidate_name}!"}), 201

    except Exception as e:
        print(f"Error in /api/upload-cv-hr: {e}")
        return jsonify({"msg": f"Error uploading CV: {str(e)}"}), 500


# Upload CV Endpoint
@app.route('/api/upload-cv', methods=['POST'])
@jwt_required()
def upload_cv():
    try:
        # Log headers for debugging
        print("Request Headers:", request.headers)

        # Get the logged-in user ID from the JWT token
        user_id = get_jwt_identity()
        print(f"Authenticated User ID: {user_id}")

        if not user_id:
            return jsonify({"msg": "Invalid or missing token"}), 401

        # Validate form data
        department_id = request.form.get('department_id')
        job_id = request.form.get('job_id')
        file = request.files.get('cv')

        if not department_id or not job_id or not file:
            return jsonify({"msg": "All fields (department_id, job_id, cv) are required"}), 400

        try:
            department_id = int(department_id)
            job_id = int(job_id)
        except ValueError:
            return jsonify({"msg": "department_id and job_id must be integers"}), 422

        # Validate the file type
        if not allowed_file(file.filename):
            return jsonify({"msg": "Invalid file type. Only PDF, DOC, and DOCX are allowed."}), 422

        # Fetch CandidateID from the database
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT CandidateID FROM Candidate WHERE UserID = ?", (user_id,))
        candidate = cursor.fetchone()

        if not candidate:
            return jsonify({"msg": "Candidate not found for the logged-in user"}), 404

        candidate_id = candidate[0]
        print(f"Candidate ID: {candidate_id}")

        # Save the file securely
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Insert CV details into the database
        query = """
        INSERT INTO CV (CandidateID, FilePath, UploadDate, Format, DepartmentID, JobID, IsDuplicate)
        VALUES (?, ?, GETDATE(), ?, ?, ?, 0)
        """
        file_format = filename.rsplit('.', 1)[1].lower()
        cursor.execute(query, (candidate_id, file_path, file_format, department_id, job_id))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "CV uploaded successfully!"}), 201

    except Exception as e:
        print(f"Error in /api/upload-cv: {e}")
        return jsonify({"msg": f"Error uploading CV: {str(e)}"}), 500



# Upload Resumes and Rank Them
@app.route('/api/rank_resumes', methods=['POST'])
def rank_resumes_endpoint():
    job_description = request.form.get('job_description')
    uploaded_files = request.files.getlist('resumes')

    if not job_description:
        return jsonify({"success": False, "message": "Job description is required"}), 400

    if not uploaded_files:
        return jsonify({"success": False, "message": "At least one resume must be uploaded"}), 400

    # Save uploaded resumes to the uploads folder
    resume_paths = []
    for file in uploaded_files:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        resume_paths.append(file_path)

    # Call your NLP model to rank resumes (placeholder)
    ranked_resumes = [
        ("John Doe", "john.doe@example.com", 0.95),
        ("Jane Smith", "jane.smith@example.com", 0.89)
    ]

    # Save results to the database
    save_result = save_ranked_resumes(ranked_resumes, job_description)

    if save_result == "Ranked resumes saved successfully":
        return jsonify({"success": True, "message": save_result, "ranked_resumes": ranked_resumes}), 201
    else:
        return jsonify({"success": False, "message": save_result}), 500
@app.route('/api/departments', methods=['GET'])
def get_departments():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "SELECT DepartmentID, Name FROM Department"
        cursor.execute(query)
        departments = [{"DepartmentID": row[0], "Name": row[1]} for row in cursor.fetchall()]
        cursor.close()
        connection.close()
        return jsonify(departments), 200
    except Exception as e:
        print(f"Error fetching departments: {e}")
        return jsonify({"message": "Failed to fetch departments"}), 500

@app.route('/api/job-descriptions', methods=['GET'])
def get_job_descriptions():
    department_id = request.args.get('department_id', None)
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Build query
        query = "SELECT JobID, Description, DepartmentID FROM JobDescription"
        if department_id:
            query += " WHERE DepartmentID = ?"
            cursor.execute(query, (department_id,))
        else:
            cursor.execute(query)

        job_descriptions = [
            {"JobID": row[0], "Description": row[1], "DepartmentID": row[2]}
            for row in cursor.fetchall()
        ]

        cursor.close()
        connection.close()

        return jsonify(job_descriptions), 200
    except Exception as e:
        print(f"Error fetching job descriptions: {e}")
        return jsonify({"message": "Failed to fetch job descriptions"}), 500
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    department_id = request.args.get('department_id')
    if not department_id:
        return jsonify({"message": "Department ID is required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "SELECT JobID, Title FROM JobDescription WHERE DepartmentID = ?"
        cursor.execute(query, (department_id,))
        jobs = [{"JobID": row[0], "Title": row[1]} for row in cursor.fetchall()]
        cursor.close()
        connection.close()
        return jsonify(jobs), 200
    except Exception as e:
        print(f"Error fetching jobs: {e}")
        return jsonify({"message": "Failed to fetch jobs"}), 500
@app.route('/api/job/<int:job_id>', methods=['GET'])
def get_job_details(job_id):
    try:
        # Log the job_id being fetched for debugging
        print(f"Fetching job details for JobID: {job_id}")

        # Establish a database connection
        connection = get_db_connection()
        cursor = connection.cursor()

        # Query to fetch job details by JobID
        query = """
        SELECT JobID, Title, Description, Responsibilities, Requirements, DepartmentID
        FROM JobDescription
        WHERE JobID = ?
        """
        cursor.execute(query, (job_id,))
        job = cursor.fetchone()

        cursor.close()
        connection.close()

        # If no job found, return 404
        if not job:
            print(f"JobID {job_id} not found in the database")
            return jsonify({"message": "Job not found"}), 404

        # Return the job details
        return jsonify({
            "JobID": job[0],
            "Title": job[1],
            "Description": job[2],
            "Responsibilities": job[3],
            "Requirements": job[4],
            "DepartmentID": job[5],
        }), 200

    except Exception as e:
        print(f"Error fetching job details for JobID {job_id}: {e}")
        return jsonify({"message": "Error fetching job details"}), 500


    
@app.route('/api/upload-job-description', methods=['POST'])
@jwt_required()
def upload_job_description():
    try:
        # Log incoming headers
        print(f"Headers: {request.headers}")
        print(f"Authorization Header: {request.headers.get('Authorization')}")

        # Retrieve and log incoming payload
        data = request.get_json()
        print(f"Payload received: {data}")

        # Validate required fields
        required_fields = ['title', 'description', 'responsibilities', 'requirements', 'department_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"msg": f"Missing field: {field}"}), 400

        # Ensure all string fields are non-empty strings
        for field in ['title', 'description', 'responsibilities', 'requirements']:
            if not isinstance(data[field], str) or not data[field].strip():
                return jsonify({"msg": f"{field.capitalize()} must be a non-empty string"}), 422

        # Validate department_id as an integer
        try:
            department_id = int(data['department_id'])
        except ValueError:
            return jsonify({"msg": "department_id must be an integer"}), 422

        # Debug the validated payload
        print(f"Validated payload: {data}")

        # Retrieve user ID from JWT and fetch HRID
        user_id = get_jwt_identity()
        print(f"JWT Identity: {user_id} (Type: {type(user_id)})")

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT HRID FROM HRProfessional WHERE UserID = ?", (user_id,))
        hr = cursor.fetchone()

        if not hr:
            return jsonify({"msg": "HR not found for the logged-in user"}), 404

        hr_id = hr[0]

        # Insert job description into the database
        query = """
        INSERT INTO JobDescription (HRID, Title, Description, Responsibilities, Requirements, DepartmentID, UploadDate)
        VALUES (?, ?, ?, ?, ?, ?, GETDATE())
        """
        cursor.execute(query, (
            hr_id,
            data['title'],
            data['description'],
            data['responsibilities'],
            data['requirements'],
            department_id
        ))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Job description uploaded successfully!"}), 201
    except Exception as e:
        print(f"Error in /api/upload-job-description: {e}")
        return jsonify({"msg": f"Error uploading job description: {str(e)}"}), 500


@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "SELECT CandidateID, ResumeSummary FROM Candidate"
        cursor.execute(query)
        candidates = [{"CandidateID": row[0], "ResumeSummary": row[1]} for row in cursor.fetchall()]
        cursor.close()
        connection.close()
        return jsonify(candidates), 200
    except Exception as e:
        print(f"Error fetching candidates: {e}")
        return jsonify({"message": "Failed to fetch candidates"}), 500

@app.route('/api/debug-token', methods=['GET'])
@jwt_required()
def debug_token():
    try:
        # Extract Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Invalid or missing Authorization header"}), 401
        
        token = auth_header.split(" ")[1]
        print(f"Debug: Received Token: {token}")

        # Decode the token manually for debugging
        decoded = decode_token(token)
        print(f"Debug: Decoded Token: {decoded}")

        return jsonify(decoded), 200
    except Exception as e:
        print(f"Error in /api/debug-token: {e}")
        return jsonify({"message": f"Error decoding token: {str(e)}"}), 500

@app.route('/api/test', methods=['GET'])
def test_route():
    print("Test route accessed.")
    return jsonify({"message": "Test route working"}), 200

@app.route('/api/check-token', methods=['GET'])
@jwt_required()
def check_token():
    try:
        # Retrieve the user identity from the token
        user_id = get_jwt_identity()
        print(f"Token is valid. UserID: {user_id}")
        return jsonify({"msg": "Token is valid", "user_id": user_id}), 200
    except Exception as e:
        print(f"Error in token validation: {e}")
        return jsonify({"msg": "Invalid or expired token"}), 401





# Ensure Upload Folder Exists
if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True, port=5000)




