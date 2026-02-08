from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete existing data
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel', description='Marvel superheroes team')
        dc = Team.objects.create(name='DC', description='DC superheroes team')

        # Create users
        ironman = User.objects.create(name='Iron Man', email='ironman@marvel.com', team=marvel.name)
        captain = User.objects.create(name='Captain America', email='cap@marvel.com', team=marvel.name)
        batman = User.objects.create(name='Batman', email='batman@dc.com', team=dc.name)
        superman = User.objects.create(name='Superman', email='superman@dc.com', team=dc.name)

        # Create activities
        from datetime import date
        Activity.objects.create(user=ironman, type='Running', duration=30, date=date.today())
        Activity.objects.create(user=batman, type='Cycling', duration=45, date=date.today())
        Activity.objects.create(user=superman, type='Swimming', duration=60, date=date.today())
        Activity.objects.create(user=captain, type='Walking', duration=20, date=date.today())

        # Create workouts
        Workout.objects.create(name='Chest workout', description='Chest routine for Iron Man', difficulty='Hard')
        Workout.objects.create(name='Leg workout', description='Leg routine for Batman', difficulty='Medium')
        Workout.objects.create(name='Cardio', description='Cardio routine for Superman', difficulty='Hard')
        Workout.objects.create(name='Yoga', description='Yoga routine for Captain America', difficulty='Easy')

        # Create leaderboard
        Leaderboard.objects.create(user=ironman, points=100)
        Leaderboard.objects.create(user=batman, points=90)
        Leaderboard.objects.create(user=superman, points=110)
        Leaderboard.objects.create(user=captain, points=80)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data'))
