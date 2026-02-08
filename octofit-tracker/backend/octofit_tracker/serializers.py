from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout
from bson.objectid import ObjectId

class ObjectIdField(serializers.Field):
    """Custom field to handle MongoDB ObjectId serialization"""
    def to_representation(self, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value
    
    def to_internal_value(self, data):
        try:
            return ObjectId(data)
        except:
            return data

class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'team']

class TeamSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description']

class ActivitySerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    user_id = ObjectIdField(read_only=True)
    
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'type', 'duration', 'date']

class LeaderboardSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    user_id = ObjectIdField(read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'points']

class WorkoutSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty']
