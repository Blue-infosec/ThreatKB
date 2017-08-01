from app import app, db
from app.models import c2dns
from flask import abort, jsonify, request
from dateutil import parser
import datetime
import json


@app.route('/InquestKB/c2dns', methods=['GET'])
def get_all_c2dns():
    entities = c2dns.C2dns.query.all()
    return json.dumps([entity.to_dict() for entity in entities])


@app.route('/InquestKB/c2dns/<int:id>', methods=['GET'])
def get_c2dns(id):
    entity = c2dns.C2dns.query.get(id)
    if not entity:
        abort(404)
    return jsonify(entity.to_dict())


@app.route('/InquestKB/c2dns', methods=['POST'])
def create_c2dns():
    entity = c2dns.C2dns(
        domain_name=request.json['domain_name']
        , match_type=request.json['match_type']
        , reference_link=request.json['reference_link']
        , reference_text=request.json['reference_text']
        , expiration_type=request.json['expiration_type']
        , expiration_timestamp=parser.parse(request.json['expiration_timestamp'])
        , state=request.json['state']['state']
    )
    db.session.add(entity)
    db.session.commit()
    return jsonify(entity.to_dict()), 201


@app.route('/InquestKB/c2dns/<int:id>', methods=['PUT'])
def update_c2dns(id):
    entity = c2dns.C2dns.query.get(id)
    if not entity:
        abort(404)
    entity = c2dns.C2dns(
        state=request.json['state'],
        domain_name=request.json['domain_name'],
        match_type=request.json['match_type'],
        reference_link=request.json['reference_link'],
        reference_text=request.json['reference_text'],
        expiration_type=request.json['expiration_type'],
        expiration_timestamp=parser.parse(request.json['expiration_timestamp']),
        id=id
    )
    db.session.merge(entity)
    db.session.commit()
    return jsonify(entity.to_dict()), 200


@app.route('/InquestKB/c2dns/<int:id>', methods=['DELETE'])
def delete_c2dns(id):
    entity = c2dns.C2dns.query.get(id)
    if not entity:
        abort(404)
    db.session.delete(entity)
    db.session.commit()
    return '', 204
