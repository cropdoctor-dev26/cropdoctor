import sqlite3

conn = sqlite3.connect("cropdoctor.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM diagnosis_history")

rows = cursor.fetchall()

print("Saved scans:")
print(rows)

conn.close()