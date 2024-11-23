from django.http import HttpResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate('')
firebase_admin.initialize_app(cred, {
    "databaseURL": "",
})

def index(request):
    name = db.reference('Data/Name').get()
    return HttpResponse(name)