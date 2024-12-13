import bcrypt
hashed_password = bcrypt.hashpw("securepassword".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
print(hashed_password)