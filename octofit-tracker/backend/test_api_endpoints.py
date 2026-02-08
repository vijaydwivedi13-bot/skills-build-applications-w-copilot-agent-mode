#!/usr/bin/env python3
"""Test script to verify all API endpoints are working correctly"""
import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"
ENDPOINTS = {
    "users": ["name", "email", "team"],
    "teams": ["name", "description"],
    "activities": ["user_id", "type", "duration", "date"],
    "leaderboard": ["user_id", "points"],
    "workouts": ["name", "description", "difficulty"]
}

def test_endpoint(name, expected_fields):
    """Test a single endpoint"""
    url = f"{BASE_URL}/{name}/"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code != 200:
            print(f"❌ {name}: HTTP {response.status_code}")
            return False
        
        data = response.json()
        
        # Handle both paginated and plain array responses
        items = data.get('results', data) if isinstance(data, dict) else data
        
        if not items:
            print(f"⚠️  {name}: No data returned")
            return True
        
        # Check if first item has expected fields
        first_item = items[0] if isinstance(items, list) else items
        missing_fields = [f for f in expected_fields if f not in first_item]
        
        if missing_fields:
            print(f"❌ {name}: Missing fields {missing_fields}")
            print(f"   Available fields: {list(first_item.keys())}")
            return False
        
        print(f"✅ {name}: OK ({len(items) if isinstance(items, list) else 1} items)")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ {name}: Connection error - {e}")
        return False
    except json.JSONDecodeError:
        print(f"❌ {name}: Invalid JSON response")
        return False

def main():
    print("=" * 60)
    print("Testing Django API Endpoints")
    print("=" * 60)
    
    all_passed = True
    for endpoint, fields in ENDPOINTS.items():
        if not test_endpoint(endpoint, fields):
            all_passed = False
    
    print("=" * 60)
    if all_passed:
        print("✅ All endpoint tests passed!")
        sys.exit(0)
    else:
        print("❌ Some endpoint tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
