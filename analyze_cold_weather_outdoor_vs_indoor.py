#!/usr/bin/env python3
"""
Compare cold weather teams: Outdoor stadiums vs Indoor/Dome stadiums
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Read the data
df = pd.read_csv('nfl_team_season_home_away_2004_2025.csv')

# Define cold weather teams
cold_weather_outdoor = {
    'GB': 'Green Bay (Lambeau - Outdoor)',
    'BUF': 'Buffalo (Highmark - Outdoor)',
    'CHI': 'Chicago (Soldier Field - Outdoor)',
    'CLE': 'Cleveland (FirstEnergy - Outdoor)',
    'PIT': 'Pittsburgh (Acrisure - Outdoor)',
    'NE': 'New England (Gillette - Outdoor)'
}

cold_weather_indoor = {
    'DET': 'Detroit (Ford Field - Indoor)',
    'IND': 'Indianapolis (Dome/Retractable)',
    'MIN': 'Minnesota (Mostly Indoor)'
}

# Calculate stats for each team
def calculate_team_stats(team_code, team_data):
    total_home_wins = team_data['home_wins'].sum()
    total_home_losses = team_data['home_losses'].sum()
    total_home_ties = team_data['home_ties'].sum()
    total_away_wins = team_data['away_wins'].sum()
    total_away_losses = team_data['away_losses'].sum()
    total_away_ties = team_data['away_ties'].sum()

    total_home_games = total_home_wins + total_home_losses + total_home_ties
    total_away_games = total_away_wins + total_away_losses + total_away_ties

    home_win_pct = (total_home_wins + 0.5 * total_home_ties) / total_home_games
    away_win_pct = (total_away_wins + 0.5 * total_away_ties) / total_away_games

    index = home_win_pct / away_win_pct if away_win_pct > 0 else 0

    return {
        'team': team_code,
        'home_pct': home_win_pct,
        'away_pct': away_win_pct,
        'index': index,
        'home_record': f"{total_home_wins}-{total_home_losses}-{total_home_ties}",
        'away_record': f"{total_away_wins}-{total_away_losses}-{total_away_ties}"
    }

print("="*100)
print("COLD WEATHER TEAMS: OUTDOOR vs INDOOR STADIUMS (2004-2025)")
print("="*100)

print("\nOUTDOOR STADIUMS (experiencing full weather conditions):")
print("-"*100)
print(f"{'Team':<25} {'Home Record':<15} {'Away Record':<15} {'Home %':<10} {'Away %':<10} {'Index':<8}")
print("-"*100)

outdoor_stats = []
for code, name in cold_weather_outdoor.items():
    team_data = df[df['team'] == code]
    if len(team_data) == 0:
        continue
    stats = calculate_team_stats(code, team_data)
    outdoor_stats.append(stats)
    print(f"{name:<25} {stats['home_record']:<15} {stats['away_record']:<15} {stats['home_pct']:.3f}      {stats['away_pct']:.3f}      {stats['index']:.2f}")

print("\nINDOOR/DOME STADIUMS (protected from weather):")
print("-"*100)
print(f"{'Team':<25} {'Home Record':<15} {'Away Record':<15} {'Home %':<10} {'Away %':<10} {'Index':<8}")
print("-"*100)

indoor_stats = []
for code, name in cold_weather_indoor.items():
    team_data = df[df['team'] == code]
    if len(team_data) == 0:
        continue
    stats = calculate_team_stats(code, team_data)
    indoor_stats.append(stats)
    print(f"{name:<25} {stats['home_record']:<15} {stats['away_record']:<15} {stats['home_pct']:.3f}      {stats['away_pct']:.3f}      {stats['index']:.2f}")

# Calculate averages
outdoor_df = pd.DataFrame(outdoor_stats)
indoor_df = pd.DataFrame(indoor_stats)

avg_outdoor_index = outdoor_df['index'].mean()
avg_indoor_index = indoor_df['index'].mean()
avg_outdoor_home = outdoor_df['home_pct'].mean()
avg_indoor_home = indoor_df['home_pct'].mean()
avg_outdoor_away = outdoor_df['away_pct'].mean()
avg_indoor_away = indoor_df['away_pct'].mean()

print("\n" + "="*100)
print("SUMMARY - AVERAGE HOME/AWAY INDEX:")
print("="*100)
print(f"Outdoor stadiums (6 teams): {avg_outdoor_index:.2f}")
print(f"Indoor stadiums (3 teams):  {avg_indoor_index:.2f}")
print(f"\nDifference: {avg_outdoor_index - avg_indoor_index:+.2f}")
print(f"\nAverage Home Win %:")
print(f"  Outdoor: {avg_outdoor_home:.3f}")
print(f"  Indoor:  {avg_indoor_home:.3f}")
print(f"\nAverage Away Win %:")
print(f"  Outdoor: {avg_outdoor_away:.3f}")
print(f"  Indoor:  {avg_indoor_away:.3f}")

# Create visualization
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))

# Chart 1: Individual team indices
all_teams = list(cold_weather_outdoor.keys()) + list(cold_weather_indoor.keys())
all_stats = outdoor_stats + indoor_stats
indices = [s['index'] for s in all_stats]
colors = ['#2E7D32'] * len(outdoor_stats) + ['#1565C0'] * len(indoor_stats)

x = range(len(all_stats))
bars = ax1.barh(x, indices, color=colors, edgecolor='black', linewidth=1)

for i, (stat, idx) in enumerate(zip(all_stats, indices)):
    ax1.text(idx + 0.03, i, f"{idx:.2f}", va='center', fontweight='bold', fontsize=9)

ax1.set_yticks(x)
team_labels = [cold_weather_outdoor.get(s['team'], cold_weather_indoor.get(s['team'])) for s in all_stats]
ax1.set_yticklabels(team_labels, fontsize=9)
ax1.set_xlabel('Home/Away Index', fontweight='bold', fontsize=11)
ax1.set_title('Cold Weather Teams: Home/Away Index\n(Green = Outdoor, Blue = Indoor)',
              fontweight='bold', fontsize=12, pad=15)
ax1.axvline(x=1.0, color='red', linestyle='--', linewidth=1.5, alpha=0.7)
ax1.grid(axis='x', alpha=0.3)

# Chart 2: Average comparison
categories = ['Outdoor\n(6 teams)', 'Indoor\n(3 teams)']
avg_indices = [avg_outdoor_index, avg_indoor_index]
colors2 = ['#2E7D32', '#1565C0']

bars2 = ax2.bar(categories, avg_indices, color=colors2, edgecolor='black', linewidth=2, width=0.6)

for i, v in enumerate(avg_indices):
    ax2.text(i, v + 0.03, f'{v:.2f}', ha='center', fontweight='bold', fontsize=14,
             bbox=dict(boxstyle='round,pad=0.4', facecolor='white', edgecolor='black', linewidth=2))

ax2.set_ylabel('Average Home/Away Index', fontweight='bold', fontsize=11)
ax2.set_title('Average Home Field Advantage:\nOutdoor vs Indoor Cold Weather Teams',
              fontweight='bold', fontsize=12, pad=15)
ax2.axhline(y=1.0, color='red', linestyle='--', linewidth=1.5, alpha=0.7, label='1.0 (Equal)')
ax2.grid(axis='y', alpha=0.3)
ax2.legend(fontsize=10)
ax2.set_ylim(0, max(avg_indices) * 1.3)

# Chart 3: Home vs Away Win % comparison
x3 = np.arange(2)
width = 0.35

bars3a = ax3.bar(x3 - width/2, [avg_outdoor_home, avg_indoor_home], width,
                 label='Home Win %', color=['#2E7D32', '#1565C0'], alpha=0.8, edgecolor='black')
bars3b = ax3.bar(x3 + width/2, [avg_outdoor_away, avg_indoor_away], width,
                 label='Away Win %', color=['#2E7D32', '#1565C0'], alpha=0.4, edgecolor='black')

ax3.set_ylabel('Win Percentage', fontweight='bold', fontsize=11)
ax3.set_title('Home vs Away Win Percentages\n(Solid = Home, Faded = Away)',
              fontweight='bold', fontsize=12, pad=15)
ax3.set_xticks(x3)
ax3.set_xticklabels(['Outdoor', 'Indoor'])
ax3.axhline(y=0.5, color='red', linestyle='--', linewidth=1, alpha=0.5)
ax3.legend(fontsize=10)
ax3.grid(axis='y', alpha=0.3)

# Chart 4: Home advantage gap
home_advantages = [avg_outdoor_home - avg_outdoor_away, avg_indoor_home - avg_indoor_away]
colors4 = ['#2E7D32', '#1565C0']

bars4 = ax4.bar(categories, home_advantages, color=colors4, edgecolor='black', linewidth=2, width=0.6)

for i, v in enumerate(home_advantages):
    ax4.text(i, v + 0.005, f'+{v:.3f}', ha='center', fontweight='bold', fontsize=14,
             bbox=dict(boxstyle='round,pad=0.4', facecolor='white', edgecolor='black', linewidth=2))

ax4.set_ylabel('Home Win % - Away Win %', fontweight='bold', fontsize=11)
ax4.set_title('Home Field Advantage Gap\n(Higher = Bigger Home Advantage)',
              fontweight='bold', fontsize=12, pad=15)
ax4.grid(axis='y', alpha=0.3)
ax4.set_ylim(0, max(home_advantages) * 1.3)

plt.tight_layout()
plt.savefig('cold_weather_outdoor_vs_indoor_comparison.png', dpi=300, bbox_inches='tight')
print("\n✓ Chart saved as: cold_weather_outdoor_vs_indoor_comparison.png")
