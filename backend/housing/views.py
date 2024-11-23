from django.shortcuts import render
from django.http import HttpResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate('')
firebase_admin.initialize_app(cred, {
    "databaseURL": "",
})

def index(request):
    email = None  # Default value for email
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')

        if name and email:
            # Save name and email in Firebase Realtime Database
            db.reference(f'Data/{name}').set({'name': name, 'email': email})
            return HttpResponse(f"Name and Email uploaded: {name}, {email}")
        else:
            return HttpResponse("Please provide both name and email.")
    elif request.method == 'GET' and 'name' in request.GET:
        name = request.GET.get('name')
        data_ref = db.reference(f'Data/{name}')
        data = data_ref.get()
        if data:
            email = data.get('email', "Email not found")
        else:
            email = "Email not found"
    # Render the template with email (if retrieved)
    return render(request, 'index.html', {'email': email})