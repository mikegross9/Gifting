#!/usr/bin/env python3
"""
Create bar chart of NFL team win percentages 2004-2025
"""

import pandas as pd
import matplotlib.pyplot as plt

# Read the data
df = pd.read_csv('nfl_team_season_home_away_2004_2025.csv')

# Calculate total wins, losses, and ties for each team
team_totals = df.groupby('team').agg({
    'home_wins': 'sum',
    'home_losses': 'sum',
    'home_ties': 'sum',
    'away_wins': 'sum',
    'away_losses': 'sum',
    'away_ties': 'sum'
}).reset_index()

# Calculate total wins, losses, ties, and games
team_totals['total_wins'] = team_totals['home_wins'] + team_totals['away_wins']
team_totals['total_losses'] = team_totals['home_losses'] + team_totals['away_losses']
team_totals['total_ties'] = team_totals['home_ties'] + team_totals['away_ties']
team_totals['total_games'] = team_totals['total_wins'] + team_totals['total_losses'] + team_totals['total_ties']

# Calculate win percentage (ties count as 0.5 wins)
team_totals['win_pct'] = (team_totals['total_wins'] + 0.5 * team_totals['total_ties']) / team_totals['total_games']

# Sort by win percentage
team_totals = team_totals.sort_values('win_pct', ascending=False)

# Create bar chart
plt.figure(figsize=(14, 10))
colors = ['#2E7D32' if pct >= 0.6 else '#FF6B35' if pct < 0.4 else '#FFB627' for pct in team_totals['win_pct']]
bars = plt.barh(team_totals['team'], team_totals['win_pct'], color=colors, edgecolor='black', linewidth=0.5)

# Add value labels on bars
for i, (idx, row) in enumerate(team_totals.iterrows()):
    plt.text(row['win_pct'] + 0.01, i, f"{row['win_pct']:.3f}",
             va='center', fontsize=8, fontweight='bold')

# Add reference line at .500
plt.axvline(x=0.5, color='red', linestyle='--', linewidth=1.5, alpha=0.7, label='.500')

plt.xlabel('Win Percentage', fontsize=12, fontweight='bold')
plt.ylabel('Team', fontsize=12, fontweight='bold')
plt.title('NFL Team Win Percentages (2004-2025 Regular Season)\nOrdered Best to Worst',
          fontsize=14, fontweight='bold', pad=20)
plt.xlim(0, 0.75)
plt.grid(axis='x', alpha=0.3, linestyle='--')
plt.legend()
plt.tight_layout()

# Save the chart
plt.savefig('nfl_team_win_percentages_2004_2025.png', dpi=300, bbox_inches='tight')
print("✓ Chart saved as: nfl_team_win_percentages_2004_2025.png")

# Print top 10 and bottom 10
print("\n" + "="*60)
print("TOP 10 TEAMS (2004-2025):")
print("="*60)
for idx, row in team_totals.head(10).iterrows():
    print(f"{row['team']:4s}  {row['win_pct']:.3f}  ({int(row['total_wins'])}-{int(row['total_losses'])}-{int(row['total_ties'])})")

print("\n" + "="*60)
print("BOTTOM 10 TEAMS (2004-2025):")
print("="*60)
for idx, row in team_totals.tail(10).iterrows():
    print(f"{row['team']:4s}  {row['win_pct']:.3f}  ({int(row['total_wins'])}-{int(row['total_losses'])}-{int(row['total_ties'])})")
