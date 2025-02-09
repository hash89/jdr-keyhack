import math
from flask import Flask, render_template, request, jsonify, make_response
app = Flask(__name__)

# Coordonnées GPS autorisées (exemple)
AUTHORIZED_COORDS = {
    'latitude': 47.3906246,   # Ex: Paris latitude
    'longitude': 0.7325133    # Ex: Paris longitude
}

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calcule la distance en kilomètres entre deux points géographiques
    spécifiés par leur latitude et longitude en degrés.
    """
    R = 6371  # Rayon de la Terre en kilomètres

    # Convertir les latitudes et longitudes de degrés en radians
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    # Formule de Haversine
    a = math.sin(delta_phi / 2) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return distance

@app.route('/')
def index():
    return render_template('index.html')  # Ne passe plus 'hack_success' au template

@app.route('/check_location', methods=['POST'])
def check_location():
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    # Définir une marge d'erreur en kilomètres
    margin_km = 1  # Vous pouvez ajuster cette valeur en fonction de vos besoins

    # Calculer la distance entre la position de l'utilisateur et les coordonnées autorisées
    distance = haversine_distance(latitude, longitude,
                                  AUTHORIZED_COORDS['latitude'],
                                  AUTHORIZED_COORDS['longitude'])

    is_authorized = distance <= margin_km

    return jsonify({'authorized': is_authorized})

@app.route('/start_hack', methods=['POST'])
def start_hack():
    # Simuler le piratage en attendant côté client
    # Une fois terminé, définir le cookie
    resp = make_response(jsonify({'message': 'Nouvelle clef interceptée : CLEF DE CHIFFREMENT'}))
    resp.set_cookie('hack_success', 'true', max_age=60*60*24)  # Cookie valable 1 jour
    return resp

if __name__ == '__main__':
    app.run(debug=True)